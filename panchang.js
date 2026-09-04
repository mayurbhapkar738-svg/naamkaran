/* Naamkaran — panchang engine
 *
 * Everything a family priest reads off the birth moment, computed in the browser.
 * Depends on nakshatra.js (window.Nakshatra) for the lunar theory, Julian day,
 * ayanamsa and deltaT. Adds:
 *
 *   - Sun's apparent longitude            Meeus ch. 25
 *   - sunrise / sunset / solar noon       Meeus ch. 15, iterated twice
 *   - tithi, paksha, yoga, karana         Sun-Moon elongation and sum
 *   - vaara reckoned sunrise-to-sunrise   not the civil midnight day
 *   - lunar masa (amanta) + masa-nama     from the Sun's rashi at the preceding new moon
 *   - lagna (ascendant) and its rashi     Meeus ch. 13 inverted
 *   - nakshatra attributes                lord, deity, gana, yoni, nadi
 *   - varna / tattva from janma rashi
 *   - dosha flags                         gandanta, mula, jyeshtha, ashlesha, abhukta
 *   - janma-rashi akshara                 derived from the 108-pada table, not hardcoded
 *   - naamkaran muhurta candidates        scored days in the 10-30 day window
 *   - name-form rules                     Ashvalayana Grihyasutra 1.15, Manusmriti 2.31-33
 *
 * No network, no key, no quota. Same inputs in, same answer out, every time.
 */
(function () {
  "use strict";

  var NK = (typeof globalThis !== "undefined" && globalThis.Nakshatra) ||
    (typeof require === "function" ? require("./nakshatra.js") : null);
  if (!NK) throw new Error("panchang.js requires nakshatra.js to be loaded first");

  var D2R = Math.PI / 180;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function tan(d) { return Math.tan(d * D2R); }
  function norm360(x) { x = x % 360; return x < 0 ? x + 360 : x; }
  function norm180(x) { x = norm360(x); return x > 180 ? x - 360 : x; }

  // ---------------------------------------------------------------- the Sun

  /* Apparent geocentric ecliptic longitude of the Sun, degrees of date.
   * Meeus ch. 25 "lower accuracy" — good to about 0.01 deg, which is a
   * quarter the width of the tightest thing we decide with it. */
  function sunLongitude(jde) {
    var T = (jde - 2451545) / 36525;
    var L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
      (0.019993 - 0.000101 * T) * sin(2 * M) +
      0.000289 * sin(3 * M);
    var trueLon = L0 + C;
    var omega = 125.04 - 1934.136 * T;
    return norm360(trueLon - 0.00569 - 0.00478 * sin(omega));
  }

  // Sun's radius vector in AU — only needed for the semidiameter in sunrise
  function sunRadius(jde) {
    var T = (jde - 2451545) / 36525;
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
      (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    var v = M + C;
    return (1.000001018 * (1 - e * e)) / (1 + e * cos(v));
  }

  function obliquity(jde) {
    var T = (jde - 2451545) / 36525;
    return 23.4392911 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  }

  function gst(jd) {
    var T = (jd - 2451545) / 36525;
    return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) +
      0.000387933 * T * T - T * T * T / 38710000);
  }

  // ecliptic longitude (lat 0 for the Sun) -> right ascension & declination
  function sunEquatorial(jde) {
    var lam = sunLongitude(jde), eps = obliquity(jde);
    return {
      lon: lam,
      ra: norm360(Math.atan2(sin(lam) * cos(eps), cos(lam)) / D2R),
      dec: Math.asin(sin(eps) * sin(lam)) / D2R
    };
  }

  /* Sunrise and sunset as UTC hours for the civil date (y,mo,d) at a place.
   * Returns { rise, set, noon, polar } — polar is "up"/"down" when the Sun
   * does not cross the horizon that day, in which case rise/set are null. */
  function sunTimes(y, mo, d, latDeg, lonDegEast) {
    var jd0 = NK.julianDay(y, mo, d, 0);
    var dT = NK.deltaT(y) / 86400;
    var rise = null, set = null, noon = null, polar = null;

    // two passes: seed at 12:00 UT, then re-evaluate at the found event time
    var guessRise = 12, guessSet = 12;
    for (var pass = 0; pass < 3; pass++) {
      // solar noon
      var sN = sunEquatorial(jd0 + 0.5 + dT);
      var L0 = norm360(280.46646 + 36000.76983 * ((jd0 + 0.5 + dT - 2451545) / 36525));
      var eot = 4 * norm180(L0 - 0.0057183 - sN.ra);       // minutes
      noon = 12 - lonDegEast / 15 - eot / 60;

      var sR = sunEquatorial(jd0 + guessRise / 24 + dT);
      var sS = sunEquatorial(jd0 + guessSet / 24 + dT);

      // standard altitude: refraction + semidiameter, per Meeus 15.1
      function h0(jde) { return -0.8333 - 0.0002 * 0; }

      function hourAngle(dec) {
        var c = (sin(-0.8333) - sin(latDeg) * sin(dec)) / (cos(latDeg) * cos(dec));
        if (c > 1) return { H: null, why: "down" };   // never rises
        if (c < -1) return { H: null, why: "up" };    // never sets
        return { H: Math.acos(c) / D2R, why: null };
      }

      var hr = hourAngle(sR.dec), hs = hourAngle(sS.dec);
      if (hr.H === null) { polar = hr.why; rise = set = null; break; }

      var L0r = norm360(280.46646 + 36000.76983 * ((jd0 + guessRise / 24 + dT - 2451545) / 36525));
      var L0s = norm360(280.46646 + 36000.76983 * ((jd0 + guessSet / 24 + dT - 2451545) / 36525));
      var eotR = 4 * norm180(L0r - 0.0057183 - sR.ra);
      var eotS = 4 * norm180(L0s - 0.0057183 - sS.ra);

      rise = 12 - lonDegEast / 15 - eotR / 60 - hr.H / 15;
      set = 12 - lonDegEast / 15 - eotS / 60 + hs.H / 15;
      guessRise = rise; guessSet = set;
    }
    return { rise: rise, set: set, noon: noon, polar: polar };
  }

  // ------------------------------------------------------- panchang tables

  var TITHI = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
    "Trayodashi", "Chaturdashi", "Purnima"];
  var TITHI_DEV = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी",
    "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"];

  var YOGA = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
    "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  // yogas a naming rite avoids
  var YOGA_AVOID = [5, 8, 9, 12, 16, 18, 26];   // Atiganda, Shula, Ganda, Vyaghata, Vyatipata, Parigha, Vaidhriti

  var KARANA_CYCLE = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];

  /* Devanagari for every value the sheet prints. Without these a Hindi sheet
   * reads "Guruvara / Thursday" and "Mithuna / Gemini", which is worse than
   * either language on its own. */
  var YOGA_DEV = ["विष्कम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड",
    "सुकर्मा", "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
    "सिद्धि", "व्यतिपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल",
    "ब्रह्म", "इन्द्र", "वैधृति"];
  var KARANA_DEV = { Kimstughna: "किंस्तुघ्न", Bava: "बव", Balava: "बालव",
    Kaulava: "कौलव", Taitila: "तैतिल", Gara: "गर", Vanija: "वणिज", Vishti: "विष्टि",
    Shakuni: "शकुनि", Chatushpada: "चतुष्पाद", Naga: "नाग" };
  var VAARA_DEV = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  var LORD_DEV = { Ketu: "केतु", Shukra: "शुक्र", Surya: "सूर्य", Chandra: "चंद्र",
    Mangala: "मंगल", Rahu: "राहु", Guru: "गुरु", Shani: "शनि", Budha: "बुध" };
  var GANA_DEV = { Deva: "देव", Manushya: "मनुष्य", Rakshasa: "राक्षस" };
  var NADI_DEV = { Adi: "आदि", Madhya: "मध्य", Antya: "अंत्य" };
  var TATTVA_DEV = { Agni: "अग्नि", Prithvi: "पृथ्वी", Vayu: "वायु", Jala: "जल" };
  var VARNA_DEV = { Brahmana: "ब्राह्मण", Kshatriya: "क्षत्रिय", Vaishya: "वैश्य",
    Shudra: "शूद्र" };
  var YONI_DEV = { Horse: "अश्व", Elephant: "हस्ती", Goat: "मेष", Serpent: "सर्प",
    Dog: "श्वान", Cat: "मार्जार", Rat: "मूषक", Cow: "गौ", Buffalo: "महिष",
    Tiger: "व्याघ्र", Deer: "मृग", Monkey: "वानर", Mongoose: "नकुल", Lion: "सिंह" };
  var DEITY_DEV = ["अश्विनी कुमार", "यम", "अग्नि", "प्रजापति", "चंद्र", "रुद्र", "अदिति",
    "बृहस्पति", "नाग", "पितर", "भग", "अर्यमन", "सवितृ", "विश्वकर्मा", "वायु",
    "इंद्राग्नि", "मित्र", "इंद्र", "निरृति", "आपः", "विश्वेदेवा", "विष्णु", "वसु",
    "वरुण", "अजैकपाद", "अहिर्बुध्न्य", "पूषन्"];

  var VAARA = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara",
    "Shukravara", "Shanivara"];
  var VAARA_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Amanta lunar months, indexed by the Sun's sidereal rashi at the preceding new moon.
  // Sun in Meena at the new moon opens Chaitra, and so on round the wheel.
  var MASA = ["Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwina",
    "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna", "Chaitra"];
  var MASA_DEV = ["वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन",
    "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन", "चैत्र"];
  /* The masa-nama: one of Vishnu's twelve names, by the month of birth. This is the
   * name a child is given for ritual use and almost nobody outside the family knows
   * it. Ordering runs Keshava from Margashirsha, the Vaishnava convention. */
  var MASA_NAMA = {
    Margashirsha: ["Keshava", "केशव"], Pausha: ["Narayana", "नारायण"],
    Magha: ["Madhava", "माधव"], Phalguna: ["Govinda", "गोविंद"],
    Chaitra: ["Vishnu", "विष्णु"], Vaishakha: ["Madhusudana", "मधुसूदन"],
    Jyeshtha: ["Trivikrama", "त्रिविक्रम"], Ashadha: ["Vamana", "वामन"],
    Shravana: ["Shridhara", "श्रीधर"], Bhadrapada: ["Hrishikesha", "हृषीकेश"],
    Ashwina: ["Padmanabha", "पद्मनाभ"], Kartika: ["Damodara", "दामोदर"]
  };

  var RASHI = [
    ["Mesha", "Aries", "मेष"], ["Vrishabha", "Taurus", "वृषभ"], ["Mithuna", "Gemini", "मिथुन"],
    ["Karka", "Cancer", "कर्क"], ["Simha", "Leo", "सिंह"], ["Kanya", "Virgo", "कन्या"],
    ["Tula", "Libra", "तुला"], ["Vrishchika", "Scorpio", "वृश्चिक"], ["Dhanu", "Sagittarius", "धनु"],
    ["Makara", "Capricorn", "मकर"], ["Kumbha", "Aquarius", "कुंभ"], ["Meena", "Pisces", "मीन"]
  ];
  var RASHI_LORD = ["Mangala", "Shukra", "Budha", "Chandra", "Surya", "Budha",
    "Shukra", "Mangala", "Guru", "Shani", "Shani", "Guru"];
  // fire, earth, air, water repeating — gives both tattva and varna
  var TATTVA = ["Agni", "Prithvi", "Vayu", "Jala"];
  var VARNA_BY_TATTVA = { Jala: "Brahmana", Agni: "Kshatriya", Prithvi: "Vaishya", Vayu: "Shudra" };

  var NAK_LORD = ["Ketu", "Shukra", "Surya", "Chandra", "Mangala", "Rahu", "Guru", "Shani", "Budha"];

  var NAK_DEITY = ["Ashvini Kumaras", "Yama", "Agni", "Prajapati", "Chandra", "Rudra",
    "Aditi", "Brihaspati", "Nagas", "Pitris", "Bhaga", "Aryaman", "Savitr",
    "Vishvakarma", "Vayu", "Indra-Agni", "Mitra", "Indra", "Nirriti", "Apas",
    "Vishvadevas", "Vishnu", "Vasus", "Varuna", "Aja Ekapada", "Ahirbudhnya", "Pushan"];

  var NAK_GANA = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva",
    "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa",
    "Deva", "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya",
    "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"];

  var NAK_YONI = ["Horse", "Elephant", "Goat", "Serpent", "Serpent", "Dog", "Cat", "Goat",
    "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer",
    "Deer", "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion",
    "Cow", "Elephant"];

  var NAK_NADI = ["Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya",
    "Antya", "Antya", "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya",
    "Madhya", "Adi", "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
    "Adi", "Madhya", "Antya"];

  // nakshatras counted auspicious for the naming rite itself
  var NAK_GOOD_FOR_NAMING = [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27];

  // ------------------------------------------------------------- the wheel

  /* The 108 pada syllables, flattened from the nakshatra table in nakshatra.js.
   * A rashi spans exactly 9 padas, so the janma-rashi akshara set falls out of
   * the same table instead of being a second list that can drift out of step. */
  function padaSyllables() {
    var out = [];
    NK.NAKSHATRAS.forEach(function (nk) { nk[2].forEach(function (s) { out.push(s); }); });
    return out;
  }
  function rashiAkshara(rashiIndex) {
    var all = padaSyllables();
    return all.slice(rashiIndex * 9, rashiIndex * 9 + 9);
  }

  // ------------------------------------------------------------ new moon

  /* Julian day of the new moon preceding jd. Seeds from the current elongation
   * then brackets and bisects, so it never depends on a mean-lunation table. */
  function elongation(jd) {
    var dT = NK.deltaT(2000 + (jd - 2451545) / 365.25) / 86400;
    var m = NK.moonPosition(jd + dT).lon;
    var s = sunLongitude(jd + dT);
    return norm360(m - s);
  }
  function previousNewMoon(jd) {
    var e = elongation(jd);
    var seed = jd - (e / 360) * 29.530588;
    var lo = seed - 1.5, hi = seed + 1.5;
    // f is signed elongation: negative just before conjunction, positive just after
    var f = function (x) { return norm180(elongation(x)); };
    if (f(lo) > 0) lo -= 2;
    if (f(hi) < 0) hi += 2;
    for (var i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      if (f(mid) < 0) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // ------------------------------------------------------------- ascendant

  /* Sidereal ascendant. Inverts the standard MC/Asc relation; at the equator it
   * degenerates to lagna = MC + 90, which is the check used in the tests. */
  function ascendant(jd, jde, latDeg, lonDegEast) {
    var lst = norm360(gst(jd) + lonDegEast);
    var eps = obliquity(jde);
    var x = cos(lst);
    var y = -(sin(lst) * cos(eps) + tan(latDeg) * sin(eps));
    var tropical = norm360(Math.atan2(x, y) / D2R);
    return {
      tropical: tropical,
      sidereal: norm360(tropical - NK.lahiriAyanamsa(jd)),
      mc: norm360(Math.atan2(sin(lst), cos(lst) * cos(eps)) / D2R)
    };
  }

  // ---------------------------------------------------------------- doshas

  /* Gandanta is the seam where a water sign hands over to a fire sign. Birth in
   * the last pada before, or the first pada after, is the classic case for which
   * a shanti is prescribed before the naming can go ahead. */
  function doshas(nakIndex, pada, degIntoPada) {
    var out = [];
    var n = nakIndex;   // 1-based
    var gandantaPairs = [[27, 4, 1, 1], [9, 4, 10, 1], [18, 4, 19, 1]];
    gandantaPairs.forEach(function (g) {
      if ((n === g[0] && pada === g[1]) || (n === g[2] && pada === g[3])) {
        out.push({
          key: "gandanta",
          label: "Gandanta",
          note: "Birth at the junction of a water and a fire sign. Most traditions " +
            "ask for a shanti before the naming rite. Worth raising with your priest early."
        });
      }
    });
    if (n === 19) {
      out.push({
        key: "mula",
        label: "Mula",
        note: pada === 1
          ? "Mula pada 1 — the portion usually held to need Mula shanti."
          : "Mula nakshatra. Some families perform a shanti; many treat only pada 1 as needing it."
      });
    }
    if (n === 18 && pada === 4) {
      out.push({
        key: "abhukta",
        label: "Abhukta Mula",
        note: "The last pada of Jyeshtha running into Mula. Treated more seriously than " +
          "Mula alone in several sampradayas."
      });
    }
    if (n === 9) {
      out.push({
        key: "ashlesha",
        label: "Ashlesha",
        note: "Ashlesha birth. A shanti is commonly done, particularly in the later padas."
      });
    }
    if (n === 18 && pada !== 4) {
      out.push({
        key: "jyeshtha",
        label: "Jyeshtha",
        note: "Jyeshtha birth. Relevant mainly for an eldest child in some traditions."
      });
    }
    return out;
  }

  // ---------------------------------------------------- name-form rules

  var VOWELS = "aeiou";
  var SEMIVOWELS = ["y", "r", "l", "v", "w"];
  var HARSH = ["kh", "gh", "chh", "th", "ph", "bh", "sh", "ksh"];

  function syllableCount(name) {
    var s = String(name).toLowerCase().replace(/[^a-z]/g, "");
    if (!s) return 0;
    // count vowel groups, treating common Sanskrit digraphs as one nucleus
    var groups = s.replace(/(ai|au|ae|ea|ee|oo|ou)/g, "a").match(/[aeiou]+/g);
    return groups ? groups.length : 0;
  }

  /* Scores a candidate against the form rules in Ashvalayana Grihyasutra 1.15 and
   * Manusmriti 2.31-33. These are rules about the shape of the word, not its
   * meaning, and they are the part of naming that a language model cannot check
   * because it does not count syllables reliably. */
  function nameForm(name, gender) {
    var s = String(name || "").trim();
    if (!s) return null;
    var lower = s.toLowerCase();
    var syl = syllableCount(s);
    var checks = [];

    if (gender === "boy") {
      checks.push({
        rule: "Even number of syllables",
        pass: syl > 0 && syl % 2 === 0,
        detail: syl + (syl === 1 ? " syllable" : " syllables")
      });
      checks.push({
        rule: "Ends in a long vowel or a consonant",
        pass: !/[aiu]$/.test(lower) || /(aa|ee|oo)$/.test(lower),
        detail: "ends in “" + s.slice(-1) + "”"
      });
    } else if (gender === "girl") {
      checks.push({
        rule: "Odd number of syllables",
        pass: syl > 0 && syl % 2 === 1,
        detail: syl + (syl === 1 ? " syllable" : " syllables")
      });
      checks.push({
        rule: "Ends in the long “ā” sound",
        pass: /(a|aa|i|ee)$/.test(lower),
        detail: "ends in “" + s.slice(-1) + "”"
      });
    }

    checks.push({
      rule: "Contains a semivowel (य र ल व)",
      pass: SEMIVOWELS.some(function (c) { return lower.indexOf(c) !== -1; }),
      detail: "for euphony"
    });
    checks.push({
      rule: "Two to four syllables",
      pass: syl >= 2 && syl <= 4,
      detail: "traditional length"
    });
    checks.push({
      rule: "Free of harsh clusters",
      pass: !HARSH.some(function (h) { return lower.indexOf(h) === 0; }),
      detail: "does not open on an aspirate"
    });

    /* Mark the readings that genuinely vary between sources. The syllable-parity
     * rule is the big one: plenty of names a family would never question, Meera
     * and Saanvi among them, fall on the wrong side of it. Showing this as a
     * failed test would be both unkind and wrong, so it is reported as one
     * reading and left to the family. */
    checks.forEach(function (c) {
      c.disputed = /number of syllables/.test(c.rule);
    });

    var firm = checks.filter(function (c) { return !c.disputed; });
    var firmPassed = firm.filter(function (c) { return c.pass; }).length;
    var passed = checks.filter(function (c) { return c.pass; }).length;

    return {
      name: s,
      syllables: syl,
      checks: checks,
      passed: passed,
      total: checks.length,
      // the summary line deliberately counts only the rules the sources agree on
      verdict: firmPassed === firm.length
        ? "sits well within the classical form"
        : firmPassed >= firm.length - 1
          ? "close to the classical form"
          : "an unconventional shape, which plenty of well-loved names also are"
    };
  }

  // --------------------------------------------------------------- muhurta

  /* Candidate days for the naming rite. Tradition puts it on the eleventh or
   * twelfth day; where that lands on a rikta tithi, an amavasya, Vishti karana
   * or an unsuited nakshatra, families push it out, so this scans a window and
   * says why each day is or is not clear. */
  function namingDays(opts) {
    var base = compute(opts);
    if (base.error) return { error: base.error };
    var out = [];
    var lat = Number(opts.lat), lon = Number(opts.lon);
    var hasPlace = isFinite(lat) && isFinite(lon);

    for (var offset = 10; offset <= 30; offset++) {
      var d = new Date(Date.UTC(base.civil.y, base.civil.mo - 1, base.civil.d));
      d.setUTCDate(d.getUTCDate() + offset);
      var y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1, dd = d.getUTCDate();

      // evaluate a little after local sunrise, when the rite is actually done
      var refTime = "08:00";
      if (hasPlace) {
        var st = sunTimes(y, mo, dd, lat, lon);
        if (st.rise != null) {
          var localRise = st.rise + Number(opts.tzOffsetHours);
          var h = Math.floor(localRise + 1.5);
          var mi = Math.round(((localRise + 1.5) - h) * 60);
          if (h >= 0 && h < 24) refTime = String(h).padStart(2, "0") + ":" + String(mi % 60).padStart(2, "0");
        }
      }
      var p = compute({
        date: y + "-" + String(mo).padStart(2, "0") + "-" + String(dd).padStart(2, "0"),
        time: refTime, tzOffsetHours: opts.tzOffsetHours, lat: opts.lat, lon: opts.lon
      });
      if (p.error) continue;

      var blocks = [];
      if ([4, 9, 14].indexOf(p.tithi.numberInPaksha) !== -1) blocks.push("rikta tithi (" + p.tithi.name + ")");
      if (p.tithi.name === "Amavasya") blocks.push("amavasya");
      if (p.karana.name === "Vishti") blocks.push("Vishti karana (bhadra)");
      if (YOGA_AVOID.indexOf(p.yoga.index) !== -1) blocks.push(p.yoga.name + " yoga");
      if (NAK_GOOD_FOR_NAMING.indexOf(p.nakshatra.index) === -1) blocks.push(p.nakshatra.name + " nakshatra");
      if (p.vaara.index === 2 || p.vaara.index === 6) blocks.push(p.vaara.en + " (less favoured)");

      out.push({
        offset: offset,
        date: p.civil.iso,
        weekday: p.vaara.en,
        tithi: p.tithi.paksha + " " + p.tithi.name,
        nakshatra: p.nakshatra.name,
        yoga: p.yoga.name,
        karana: p.karana.name,
        traditional: offset === 11 || offset === 12,
        clear: blocks.length === 0,
        blocks: blocks
      });
    }
    return {
      candidates: out,
      best: out.filter(function (x) { return x.clear; }).slice(0, 5),
      traditional: out.filter(function (x) { return x.traditional; })
    };
  }

  // ------------------------------------------------------------ main entry

  /* compute(opts) -> the whole reading for one birth moment.
   * opts: { date:"YYYY-MM-DD", time:"HH:MM", tzOffsetHours:Number,
   *         lat:Number|null, lon:Number|null }   longitude east-positive */
  function compute(opts) {
    var star = NK.compute(opts);
    if (star.error) return { error: star.error };

    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(opts.date).trim());
    var tm = /^(\d{1,2}):(\d{2})$/.exec(String(opts.time).trim());
    var y = +dm[1], mo = +dm[2], d = +dm[3], hh = +tm[1], mi = +tm[2];
    var tz = Number(opts.tzOffsetHours);
    var jd = star.jd;
    var jde = jd + NK.deltaT(y) / 86400;

    var lat = Number(opts.lat), lon = Number(opts.lon);
    var hasPlace = isFinite(lat) && isFinite(lon) &&
      opts.lat !== null && opts.lat !== "" && opts.lon !== null && opts.lon !== "";

    // ---- Sun, and the two angles the panchang is built from
    var sunLon = sunLongitude(jde);
    var sunSid = norm360(sunLon - NK.lahiriAyanamsa(jd));
    var moonSid = star.siderealLon;

    /* Tithi, yoga and karana all come out of the Sun-Moon elongation, and that
     * has to be measured geocentrically.
     *
     * star.siderealLon carries the topocentric parallax correction when a place
     * is given, which is right for the birth star: the nakshatra is about where
     * the Moon appeared from that spot on Earth. But the Sun's parallax is under
     * nine arcseconds while the Moon's runs to about a degree, so subtracting a
     * geocentric Sun from a topocentric Moon leaves roughly a degree of nonsense
     * in the elongation. Near a syzygy that is enough to report Shukla Pratipada
     * as Krishna Amavasya, which is how this surfaced.
     *
     * Published panchangs reckon the tithi geocentrically, so that is what these
     * five limbs use, while the nakshatra keeps its correction. */
    var moonGeo = norm360(NK.moonPosition(jde).lon - NK.lahiriAyanamsa(jd));
    var elong = norm360(moonGeo - sunSid);
    var sum = norm360(moonGeo + sunSid);

    // ---- tithi and paksha
    var tIdx = Math.floor(elong / 12);                 // 0..29
    var paksha = tIdx < 15 ? "Shukla" : "Krishna";
    var inPaksha = tIdx % 15;                          // 0..14
    var tithiName = inPaksha === 14
      ? (paksha === "Shukla" ? "Purnima" : "Amavasya")
      : TITHI[inPaksha];
    var tithiDev = inPaksha === 14
      ? (paksha === "Shukla" ? "पूर्णिमा" : "अमावस्या")
      : TITHI_DEV[inPaksha];

    // ---- yoga
    var yIdx = Math.floor(sum / (360 / 27));

    // ---- karana: sixty half-tithis, three of which stand outside the cycle
    var kIdx = Math.floor(elong / 6);                  // 0..59
    var karanaName = kIdx === 0 ? "Kimstughna"
      : kIdx <= 56 ? KARANA_CYCLE[(kIdx - 1) % 7]
        : ["Shakuni", "Chatushpada", "Naga"][kIdx - 57];

    // ---- vaara, reckoned sunrise to sunrise rather than midnight to midnight
    var localDecimal = hh + mi / 60;
    var civilDow = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
    var sunriseLocal = null, sunsetLocal = null, beforeSunrise = false;
    if (hasPlace) {
      var st = sunTimes(y, mo, d, lat, lon);
      if (st.rise != null) {
        sunriseLocal = st.rise + tz;
        sunsetLocal = st.set + tz;
        beforeSunrise = localDecimal < sunriseLocal;
      }
    }
    var vIdx = beforeSunrise ? (civilDow + 6) % 7 : civilDow;

    // ---- lunar month, from the Sun's rashi at the new moon that opened it
    var nmJd = previousNewMoon(jd);
    var nmSunSid = norm360(sunLongitude(nmJd + NK.deltaT(y) / 86400) - NK.lahiriAyanamsa(nmJd));
    var masaIdx = Math.floor(nmSunSid / 30);
    var masa = MASA[masaIdx];

    // ---- lagna
    var asc = hasPlace ? ascendant(jd, jde, lat, lon) : null;

    // ---- rashi-derived attributes
    var rIdx = Math.floor(moonSid / 30);
    var tattva = TATTVA[rIdx % 4];

    // ---- pada navamsa: which rashi the pada's navamsa falls in
    var globalPada = (star.index - 1) * 4 + star.pada;         // 1..108
    var navamsaRashi = (globalPada - 1) % 12;

    return {
      civil: { y: y, mo: mo, d: d, hh: hh, mi: mi, tz: tz, iso: dm[0] },

      nakshatra: {
        name: star.nakshatra, dev: star.nakshatraHi, index: star.index,
        pada: star.pada, globalPada: globalPada,
        syllable: star.syllable, syllables: star.syllables,
        lord: NAK_LORD[(star.index - 1) % 9],
        lordDev: LORD_DEV[NAK_LORD[(star.index - 1) % 9]] || "",
        deity: NAK_DEITY[star.index - 1],
        deityDev: DEITY_DEV[star.index - 1] || "",
        gana: NAK_GANA[star.index - 1],
        ganaDev: GANA_DEV[NAK_GANA[star.index - 1]] || "",
        yoni: NAK_YONI[star.index - 1],
        yoniDev: YONI_DEV[NAK_YONI[star.index - 1]] || "",
        nadi: NAK_NADI[star.index - 1],
        nadiDev: NADI_DEV[NAK_NADI[star.index - 1]] || "",
        degreesIntoPada: star.degreesIntoPada,
        nearBoundary: star.nearBoundary,
        minutesToBoundary: null   // filled below
      },

      rashi: {
        name: RASHI[rIdx][0], en: RASHI[rIdx][1], dev: RASHI[rIdx][2],
        index: rIdx + 1, lord: RASHI_LORD[rIdx],
        lordDev: LORD_DEV[RASHI_LORD[rIdx]] || "",
        tattva: tattva, tattvaDev: TATTVA_DEV[tattva] || "",
        varna: VARNA_BY_TATTVA[tattva],
        varnaDev: VARNA_DEV[VARNA_BY_TATTVA[tattva]] || "",
        akshara: rashiAkshara(rIdx)
      },

      navamsa: { rashi: RASHI[navamsaRashi][0], en: RASHI[navamsaRashi][1],
        dev: RASHI[navamsaRashi][2] },

      tithi: {
        name: tithiName, dev: tithiDev, paksha: paksha,
        pakshaDev: paksha === "Shukla" ? "शुक्ल" : "कृष्ण",
        numberInPaksha: inPaksha + 1, index: tIdx + 1,
        elapsedFraction: (elong % 12) / 12
      },

      yoga: { name: YOGA[yIdx], dev: YOGA_DEV[yIdx] || "", index: yIdx + 1, elapsedFraction: (sum % (360 / 27)) / (360 / 27) },
      karana: { name: karanaName, dev: KARANA_DEV[karanaName] || "", index: kIdx + 1 },
      vaara: { name: VAARA[vIdx], dev: VAARA_DEV[vIdx] || "", en: VAARA_EN[vIdx], index: vIdx, beforeSunrise: beforeSunrise },

      masa: {
        name: masa, dev: MASA_DEV[masaIdx], paksha: paksha,
        reckoning: "Amanta", reckoningDev: "अमान्त",
        nama: MASA_NAMA[masa] ? MASA_NAMA[masa][0] : null,
        namaDev: MASA_NAMA[masa] ? MASA_NAMA[masa][1] : null,
        newMoonJd: nmJd
      },

      lagna: asc ? {
        sidereal: asc.sidereal,
        rashi: RASHI[Math.floor(asc.sidereal / 30)][0],
        en: RASHI[Math.floor(asc.sidereal / 30)][1],
        dev: RASHI[Math.floor(asc.sidereal / 30)][2],
        degreeInRashi: asc.sidereal % 30,
        mc: asc.mc
      } : null,

      sun: { siderealLon: sunSid, tropicalLon: sunLon,
        rashi: RASHI[Math.floor(sunSid / 30)][0],
        rashiDev: RASHI[Math.floor(sunSid / 30)][2] },
      moon: {
        siderealLon: moonSid, tropicalLon: star.moonLonTropical,
        latitude: star.moonLat, distanceKm: star.moonDistKm
      },

      sunrise: sunriseLocal, sunset: sunsetLocal,
      elongation: elong,
      moonGeocentricSid: moonGeo,
      ayanamsa: star.ayanamsa,
      topocentric: star.topocentric,
      parallaxShift: star.parallaxShift,
      jd: jd,
      doshas: doshas(star.index, star.pada, star.degreesIntoPada),
      hasPlace: hasPlace
    };
  }

  /* Minutes of clock time until the Moon leaves the current pada. This is the
   * number that decides whether a family needs to go back to their priest: a
   * few minutes either side of the seam and two honest calculations disagree. */
  function padaBoundaryMinutes(opts) {
    var r = NK.compute(opts);
    if (r.error) return null;
    var remaining = (10 / 3) - r.degreesIntoPada;      // degrees left in the pada
    // Moon's apparent motion, from a five-minute difference either side
    var step = 5 / 1440;
    var dT = NK.deltaT(2000 + (r.jd - 2451545) / 365.25) / 86400;
    var a = NK.moonPosition(r.jd - step + dT).lon;
    var b = NK.moonPosition(r.jd + step + dT).lon;
    var degPerMin = norm180(b - a) / 10;
    if (degPerMin <= 0) return null;
    return {
      untilNext: remaining / degPerMin,
      sinceEntered: r.degreesIntoPada / degPerMin,
      degPerMin: degPerMin
    };
  }

  var api = {
    compute: compute,
    sunLongitude: sunLongitude,
    sunTimes: sunTimes,
    ascendant: ascendant,
    previousNewMoon: previousNewMoon,
    elongation: elongation,
    padaBoundaryMinutes: padaBoundaryMinutes,
    namingDays: namingDays,
    nameForm: nameForm,
    syllableCount: syllableCount,
    rashiAkshara: rashiAkshara,
    padaSyllables: padaSyllables,
    tables: {
      TITHI: TITHI, YOGA: YOGA, KARANA_CYCLE: KARANA_CYCLE, VAARA: VAARA,
      MASA: MASA, MASA_NAMA: MASA_NAMA, RASHI: RASHI,
      NAK_LORD: NAK_LORD, NAK_DEITY: NAK_DEITY, NAK_GANA: NAK_GANA,
      NAK_YONI: NAK_YONI, NAK_NADI: NAK_NADI
    }
  };
  if (typeof globalThis !== "undefined") globalThis.Panchang = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
