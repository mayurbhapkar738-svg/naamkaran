/* Naamkaran — tradition router and the birth sheet
 *
 * Two jobs.
 *
 * 1. Say what each tradition actually computes. Until now "tradition" was a word
 *    passed to the model, so a Christian family was shown a nakshatra panel and a
 *    Muslim family was told their name should start with a pada syllable. Each
 *    tradition gets its own question, or none.
 *
 * 2. Render the janma-patra: every input echoed back with the numbers that came
 *    out of them, so a family can hand the sheet to their priest and have the
 *    working checked. That artifact is the thing a chat window cannot hand over.
 */
(function () {
  "use strict";

  var P = (typeof globalThis !== "undefined" && globalThis.Panchang) ||
    (typeof require === "function" ? require("./panchang.js") : null);

  /* ---------------------------------------------------------------- Hijri
   * Tabular Islamic calendar (the civil/Kuwaiti reckoning). It is arithmetic,
   * so it can sit a day or two off a local moon sighting; the UI says so rather
   * than pretending otherwise. Aqiqah falls on the seventh day, and where that
   * is missed, on the fourteenth or twenty-first. */
  function gregorianToHijri(y, m, d) {
    /* This term must truncate toward zero, the way integer division does in the
     * C original. Math.floor sends January to -2 instead of -1, which shifts
     * every January date by two days and makes the calendar run backwards across
     * the 31 Jan / 1 Feb seam. */
    var k = Math.trunc((m - 14) / 12);
    var jd = Math.floor((1461 * (y + 4800 + k)) / 4) +
      Math.floor((367 * (m - 2 - 12 * k)) / 12) -
      Math.floor((3 * Math.floor((y + 4900 + k) / 100)) / 4) +
      d - 32075;
    var l = jd - 1948440 + 10632;
    var n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    var j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
      Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    var hm = Math.floor((24 * l) / 709);
    var hd = l - Math.floor((709 * hm) / 24);
    var hy = 30 * n + j - 30;
    return { year: hy, month: hm, day: hd, monthName: HIJRI_MONTHS[hm - 1] };
  }
  var HIJRI_MONTHS = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
    "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Shaban", "Ramadan",
    "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"];

  function addDays(iso, n) {
    var p = iso.split("-").map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /* --------------------------------------------------------- the traditions
   * engine:  which computation drives the starting sound
   *   panchang  full nakshatra and pada reckoning, computed here
   *   hijri     Hijri date and aqiqah day, computed here
   *   given     the family already holds the letter; we ask for it, never invent it
   *   none      meaning and sound only
   * askBirth:   whether birth time and place change the answer */
  /* Every string a family reads is keyed by language. blurb, lead, body, asks
   * and gives all live here rather than in English-only literals, so switching
   * to Hindi or Marathi changes the whole page and not just its labels. */
  var TRADITIONS = [
    { id: "Hindu", engine: "panchang", askBirth: true, family: "full",
      label: { en: "Hindu", hi: "हिंदू", mr: "हिंदू" },
      blurb: {
        en: "Nakshatra and pada from the birth moment decide the starting sound.",
        hi: "जन्म के क्षण से नक्षत्र और पाद निकालकर पहली ध्वनि तय होती है।",
        mr: "जन्मक्षणावरून नक्षत्र आणि पाद काढून पहिली ध्वनी ठरते." } },
    { id: "Jain", engine: "panchang", askBirth: true, family: "partial",
      label: { en: "Jain", hi: "जैन", mr: "जैन" },
      blurb: {
        en: "Nakshatra reckoning applies, alongside Tirthankara and virtue names.",
        hi: "नक्षत्र गणना वही रहती है, नाम तीर्थंकरों और गुणों से आते हैं।",
        mr: "नक्षत्र गणना तीच राहते, नावे तीर्थंकर आणि गुणांवरून येतात." } },
    { id: "Buddhist", engine: "none", askBirth: false, family: "none",
      label: { en: "Buddhist", hi: "बौद्ध", mr: "बौद्ध" },
      blurb: {
        en: "Pali names, the paramitas and the virtues. No birth star is computed.",
        hi: "पाली नाम, पारमिताएँ और गुण। जन्म नक्षत्र नहीं निकाला जाता।",
        mr: "पाली नावे, पारमिता आणि गुण. जन्म नक्षत्र काढले जात नाही." } },
    { id: "Sikh", engine: "given", askBirth: false,
      label: { en: "Sikh", hi: "सिख", mr: "शीख" },
      askLetterAs: { en: "The letter from the Hukamnama",
        hi: "हुक्मनामे से मिला अक्षर", mr: "हुकुमनाम्यातून मिळालेले अक्षर" },
      blurb: {
        en: "The first letter comes from the Vak taken at the Gurdwara. This site " +
          "will not simulate that — enter the letter your family received.",
        hi: "पहला अक्षर गुरुद्वारे में लिए गए वाक से आता है। यह साइट उसका दिखावा नहीं " +
          "करेगी — आपको जो अक्षर मिला वह भर दें।",
        mr: "पहिले अक्षर गुरुद्वारात घेतलेल्या वाकातून येते. ही साइट त्याचे नाटक करणार " +
          "नाही — तुम्हाला मिळालेले अक्षर भरा." } },
    { id: "Muslim", engine: "hijri", askBirth: true, birthTimeOptional: true,
      label: { en: "Muslim", hi: "मुस्लिम", mr: "मुस्लिम" },
      blurb: {
        en: "Hijri date and the aqiqah day are computed from the date of birth.",
        hi: "जन्मतिथि से हिजरी तारीख और अक़ीक़ा का दिन निकाला जाता है।",
        mr: "जन्मतारखेवरून हिजरी तारीख आणि अकीका दिवस काढला जातो." } },
    { id: "Christian", engine: "none", askBirth: false,
      label: { en: "Christian", hi: "ईसाई", mr: "ख्रिश्चन" },
      blurb: {
        en: "Names by meaning and origin, with Hebrew, Greek and Latin roots given.",
        hi: "नाम अर्थ और मूल के अनुसार, हिब्रू, ग्रीक और लैटिन मूल के साथ।",
        mr: "नावे अर्थ आणि मुळावरून, हिब्रू, ग्रीक आणि लॅटिन मुळांसह." } },
    { id: "Parsi", engine: "none", askBirth: false,
      label: { en: "Parsi", hi: "पारसी", mr: "पारशी" },
      blurb: {
        en: "Yazata and Shahnameh names, with meanings.",
        hi: "यज़त और शाहनामा के नाम, अर्थ के साथ।",
        mr: "यझत आणि शाहनामा यांतील नावे, अर्थासह." } },
    { id: "Jewish", engine: "none", askBirth: false,
      label: { en: "Jewish", hi: "यहूदी", mr: "ज्यू" },
      blurb: {
        en: "Hebrew names with roots and meanings.",
        hi: "हिब्रू नाम, मूल और अर्थ के साथ।",
        mr: "हिब्रू नावे, मूळ आणि अर्थासह." } },
    { id: "No tradition", engine: "none", askBirth: false,
      label: { en: "No tradition", hi: "कोई परंपरा नहीं", mr: "कोणतीही परंपरा नाही" },
      blurb: {
        en: "Meaning, sound and how the name travels. Nothing else applied.",
        hi: "अर्थ, ध्वनि, और नाम कहाँ कैसा चलेगा। और कुछ लागू नहीं।",
        mr: "अर्थ, ध्वनी, आणि नाव कुठे कसे चालेल. आणखी काही लागू नाही." } }
  ];

  /* The functionary a family would actually consult, per tradition. Saying
   * "pandit" to a Jain family is not merely imprecise, it describes someone
   * from another tradition doing their rite. */
  var OFFICIANT = {
    Hindu: { en: "pandit", hi: "पंडितजी", mr: "गुरुजी" },
    Jain: { en: "priest or astrologer", hi: "पुरोहित या ज्योतिषी",
      mr: "पुरोहित किंवा ज्योतिषी" }
  };
  function officiant(trad, lang) {
    var o = OFFICIANT[trad && trad.id];
    return o ? (o[lang] || o.en) : (OFFICIANT.Hindu[lang] || OFFICIANT.Hindu.en);
  }

  function pick(v, lang) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    return v[lang] || v.en || "";
  }

  /* How much of the family panel a tradition uses. Anything not declared
   * gets "none", so a tradition added later is silent by default rather than
   * quietly inheriting a Hindu question. */
  function familyScope(trad) {
    return (trad && trad.family) || "none";
  }

  function byId(id) {
    for (var i = 0; i < TRADITIONS.length; i++) if (TRADITIONS[i].id === id) return TRADITIONS[i];
    return TRADITIONS[0];
  }
  function labelFor(trad, lang) { return pick(trad.label, lang) || trad.id; }
  function blurbFor(trad, lang) { return pick(trad.blurb, lang); }
  function letterLabelFor(trad, lang) { return pick(trad.askLetterAs, lang); }

  /* ------------------------------------------------------------- the sheet */

  /* The sheet is printed and handed to a priest, so its labels are translated
   * too. The panchang terms themselves are Sanskrit-derived, so Devanagari is
   * their natural spelling rather than a translation. */
  var SHEET = {
    en: { fromDeity: "a name of {deity}", deityNoNames: "we hold no name list for this deity \u2014 ask your priest", sankalpa: "For the sankalpa", shantiHead: "What is usually prescribed", shantiNote: "Named so you can raise it with your priest early. He decides whether it is needed and how it is done.", title: "Janma patra", record: "Birth record", beginsWith: "Name should begin with", beginsWithShort: "begins with",
      pada: "pada", of4: "of 4", entered: "Entered this pada {a} min before birth; leaves it {b} min after.",
      seam: "Birth falls within a few minutes of a pada seam. Two careful calculations can disagree here. Take this sheet to your priest before settling on the sound.",
      flagged: "Flagged", panchangAt: "Panchang at the birth moment", positions: "Positions",
      attributes: "Nakshatra attributes", fourNames: "The four traditional names",
      fourNote: "The grihya sutras describe a set, not one name. Only the last is the name a child is called by.",
      rashiAlt: "If your family uses the rashi, not the pada",
      rashiNote: "Many families take the starting sound from the moon sign rather than the pada. Both are traditional. These are the nine sounds for {rashi}:",
      working: "Working", elapsed: "{n}% elapsed",
      beforeSunrise: "born before sunrise, so the previous vaara",
      needPlace: "needs place of birth", privateNote: "kept private in many families",
      fromMasa: "from {masa} masa", askFamily: "your kula devata — ask your family",
      everyday: "the everyday name, chosen below", noParallax: "none — no place given, so this is the geocentric position",
      forPlace: "for your place", reckoning: "{r} reckoning",
      foot: "Lunar theory: ELP2000-82 truncation (Meeus ch. 47). Solar: Meeus ch. 25. Sidereal conversion by Lahiri ayanamsa. A different ayanamsa, or a panchang using mean rather than true positions, can move a reading near a seam by a pada. Where this sheet and your priest disagree, he has the last word.",
      hijriDate: "Hijri date of birth", aqiqah: "Aqiqah", day7: "Seventh day",
      day14: "Fourteenth day", day21: "Twenty-first day",
      ifMissed: "if the seventh is missed", andIfMissed: "and if the fourteenth is missed",
      hijriFoot: "Converted with the tabular Islamic calendar, which is arithmetic rather than observational and can differ from a local moon sighting by a day either way. Confirm the date with your mosque before fixing the aqiqah.",
      L: { tithi: "Tithi", vaara: "Vaara", nakshatra: "Nakshatra", yoga: "Yoga", karana: "Karana",
        janmaRashi: "Janma rashi", lagna: "Lagna", navamsa: "Navamsa", moonSid: "Moon, sidereal",
        sunSid: "Sun, sidereal", sunriseSet: "Sunrise / sunset", lord: "Lord", deity: "Deity",
        gana: "Gana", yoni: "Yoni", nadi: "Nadi", varna: "Varna", fromTattva: "from {t} tattva",
        nakNama: "Nakshatra nama", masaNama: "Masa nama", devataNama: "Devata nama",
        vyavaharika: "Vyavaharika nama", ayanamsa: "Ayanamsa (Lahiri)", jd: "Julian day (UT)",
        moonTrop: "Moon, tropical", moonLat: "Moon latitude", moonDist: "Moon distance",
        parallax: "Parallax correction", lunarMonth: "Lunar month" } },
    hi: { fromDeity: "{deity} का एक नाम", deityNoNames: "इस देवता के लिए हमारे पास नाम सूची नहीं — पंडितजी से पूछें", sankalpa: "संकल्प के लिए", shantiHead: "सामान्यतः क्या बताया जाता है", shantiNote: "नाम इसलिए दिया है कि आप पंडितजी से पहले ही बात कर सकें। आवश्यक है या नहीं और कैसे करनी है, यह वे तय करेंगे।", title: "जन्म पत्र", record: "जन्म विवरण", beginsWith: "नाम इस ध्वनि से शुरू हो", beginsWithShort: "इससे शुरू",
      pada: "पाद", of4: "में से 4", entered: "जन्म से {a} मिनट पहले इस पाद में प्रवेश; {b} मिनट बाद निकलता है।",
      seam: "जन्म पाद की सीमा के कुछ मिनटों के भीतर पड़ता है। यहाँ दो सावधान गणनाएँ भिन्न हो सकती हैं। ध्वनि तय करने से पहले यह पत्र पंडितजी को दिखाएँ।",
      flagged: "ध्यान देने योग्य", panchangAt: "जन्म के क्षण का पंचांग", positions: "स्थितियाँ",
      attributes: "नक्षत्र के गुण", fourNames: "चार पारंपरिक नाम",
      fourNote: "गृह्यसूत्रों में एक नाम नहीं, नामों का समूह बताया गया है। इनमें अंतिम ही वह नाम है जिससे बच्चा पुकारा जाता है।",
      rashiAlt: "यदि आपका परिवार पाद के बजाय राशि से लेता है",
      rashiNote: "कई परिवार पहली ध्वनि पाद के बजाय चंद्र राशि से लेते हैं। दोनों परंपरागत हैं। {rashi} की नौ ध्वनियाँ ये हैं:",
      working: "गणना", elapsed: "{n}% बीता",
      beforeSunrise: "सूर्योदय से पहले जन्म, इसलिए पिछला वार",
      needPlace: "जन्मस्थान आवश्यक", privateNote: "कई परिवारों में गुप्त रखा जाता है",
      fromMasa: "{masa} मास से", askFamily: "आपके कुलदेवता — परिवार से पूछें",
      everyday: "रोज़ का नाम, नीचे चुना गया", noParallax: "नहीं — स्थान न दिया गया, यह भूकेंद्रित स्थिति है",
      forPlace: "आपके स्थान के लिए", reckoning: "{r} गणना",
      foot: "चंद्र सिद्धांत: ELP2000-82 (Meeus अध्याय 47)। सौर: Meeus अध्याय 25। निरयण रूपांतरण लाहिड़ी अयनांश से। दूसरा अयनांश, या माध्य स्थितियों वाला पंचांग, सीमा के निकट पाठ को एक पाद हिला सकता है। जहाँ यह पत्र और आपके पंडितजी भिन्न हों, अंतिम शब्द उनका है।",
      hijriDate: "जन्म की हिजरी तारीख", aqiqah: "अक़ीक़ा", day7: "सातवाँ दिन",
      day14: "चौदहवाँ दिन", day21: "इक्कीसवाँ दिन",
      ifMissed: "यदि सातवाँ निकल जाए", andIfMissed: "और यदि चौदहवाँ निकल जाए",
      hijriFoot: "सारणीबद्ध इस्लामी कैलेंडर से रूपांतरित, जो गणना पर आधारित है, दर्शन पर नहीं, और स्थानीय चाँद दिखने से एक दिन इधर या उधर हो सकता है। अक़ीक़ा तय करने से पहले मस्जिद से तारीख की पुष्टि करें।",
      L: { tithi: "तिथि", vaara: "वार", nakshatra: "नक्षत्र", yoga: "योग", karana: "करण",
        janmaRashi: "जन्म राशि", lagna: "लग्न", navamsa: "नवमांश", moonSid: "चंद्र, निरयण",
        sunSid: "सूर्य, निरयण", sunriseSet: "सूर्योदय / सूर्यास्त", lord: "स्वामी", deity: "देवता",
        gana: "गण", yoni: "योनि", nadi: "नाड़ी", varna: "वर्ण", fromTattva: "{t} तत्व से",
        nakNama: "नक्षत्र नाम", masaNama: "मास नाम", devataNama: "देवता नाम",
        vyavaharika: "व्यावहारिक नाम", ayanamsa: "अयनांश (लाहिड़ी)", jd: "जूलियन दिन (UT)",
        moonTrop: "चंद्र, सायन", moonLat: "चंद्र अक्षांश", moonDist: "चंद्र दूरी",
        parallax: "लंबन सुधार", lunarMonth: "चंद्र मास" } },
    mr: { fromDeity: "{deity} यांचे एक नाव", deityNoNames: "या देवतेसाठी आमच्याकडे नावांची यादी नाही — गुरुजींना विचारा", sankalpa: "संकल्पासाठी", shantiHead: "सामान्यतः काय सांगितले जाते", shantiNote: "नाव यासाठी दिले की तुम्ही गुरुजींशी आधीच बोलू शकाल. आवश्यक आहे का आणि कशी करायची, हे ते ठरवतील.", title: "जन्म पत्र", record: "जन्म तपशील", beginsWith: "नाव या ध्वनीने सुरू व्हावे", beginsWithShort: "याने सुरू",
      pada: "पाद", of4: "पैकी 4", entered: "जन्माच्या {a} मिनिटे आधी या पादात प्रवेश; {b} मिनिटांनी बाहेर.",
      seam: "जन्म पादाच्या सीमेच्या काही मिनिटांत येतो. येथे दोन काळजीपूर्वक गणना भिन्न असू शकतात. ध्वनी ठरवण्यापूर्वी हे पत्र गुरुजींना दाखवा.",
      flagged: "लक्ष देण्यासारखे", panchangAt: "जन्मक्षणाचे पंचांग", positions: "स्थिती",
      attributes: "नक्षत्राचे गुण", fourNames: "चार पारंपरिक नावे",
      fourNote: "गृह्यसूत्रांत एक नाव नाही, नावांचा संच सांगितला आहे. यांतील शेवटचेच नाव मुलाला हाक मारण्यासाठी वापरले जाते.",
      rashiAlt: "तुमचे कुटुंब पादाऐवजी राशीवरून घेत असेल तर",
      rashiNote: "अनेक कुटुंबे पहिली ध्वनी पादाऐवजी चंद्र राशीवरून घेतात. दोन्ही पारंपरिक आहेत. {rashi} च्या नऊ ध्वनी अशा:",
      working: "गणना", elapsed: "{n}% सरले",
      beforeSunrise: "सूर्योदयापूर्वी जन्म, म्हणून मागील वार",
      needPlace: "जन्मस्थान आवश्यक", privateNote: "अनेक कुटुंबांत गुप्त ठेवले जाते",
      fromMasa: "{masa} मासावरून", askFamily: "तुमचे कुलदैवत — कुटुंबाला विचारा",
      everyday: "रोजचे नाव, खाली निवडलेले", noParallax: "नाही — ठिकाण दिले नाही, ही भूकेंद्री स्थिती आहे",
      forPlace: "तुमच्या ठिकाणासाठी", reckoning: "{r} गणना",
      foot: "चंद्र सिद्धांत: ELP2000-82 (Meeus प्रकरण 47). सौर: Meeus प्रकरण 25. निरयन रूपांतर लाहिरी अयनांशाने. दुसरा अयनांश, किंवा मध्यम स्थिती वापरणारे पंचांग, सीमेजवळचे वाचन एक पाद हलवू शकते. जिथे हे पत्र आणि तुमचे गुरुजी भिन्न असतील, शेवटचा शब्द त्यांचा.",
      hijriDate: "जन्माची हिजरी तारीख", aqiqah: "अकीका", day7: "सातवा दिवस",
      day14: "चौदावा दिवस", day21: "एकविसावा दिवस",
      ifMissed: "सातवा निघून गेल्यास", andIfMissed: "आणि चौदावा निघून गेल्यास",
      hijriFoot: "सारणीबद्ध इस्लामी कॅलेंडरने रूपांतरित, जे गणनेवर आधारित आहे, दर्शनावर नाही, आणि स्थानिक चंद्रदर्शनापासून एक दिवस इकडे किंवा तिकडे असू शकते. अकीका ठरवण्यापूर्वी मशिदीकडून तारीख तपासा.",
      L: { tithi: "तिथी", vaara: "वार", nakshatra: "नक्षत्र", yoga: "योग", karana: "करण",
        janmaRashi: "जन्म राशी", lagna: "लग्न", navamsa: "नवमांश", moonSid: "चंद्र, निरयन",
        sunSid: "सूर्य, निरयन", sunriseSet: "सूर्योदय / सूर्यास्त", lord: "स्वामी", deity: "देवता",
        gana: "गण", yoni: "योनी", nadi: "नाडी", varna: "वर्ण", fromTattva: "{t} तत्त्वावरून",
        nakNama: "नक्षत्र नाम", masaNama: "मास नाम", devataNama: "देवता नाम",
        vyavaharika: "व्यावहारिक नाम", ayanamsa: "अयनांश (लाहिरी)", jd: "जूलियन दिवस (UT)",
        moonTrop: "चंद्र, सायन", moonLat: "चंद्र अक्षांश", moonDist: "चंद्र अंतर",
        parallax: "लंबन सुधार", lunarMonth: "चंद्र मास" } }
  };
  function sh(lang) { return SHEET[lang] || SHEET.en; }
  function tpl(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] == null ? m : vars[k];
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function deg(x) {
    var d = Math.floor(x), m = (x - d) * 60, mm = Math.floor(m), ss = Math.round((m - mm) * 60);
    if (ss === 60) { ss = 0; mm += 1; }
    return d + "° " + String(mm).padStart(2, "0") + "′ " + String(ss).padStart(2, "0") + "″";
  }
  function hm(h) {
    if (h == null) return "—";
    var hh = Math.floor(h), mi = Math.round((h - hh) * 60);
    if (mi === 60) { mi = 0; hh += 1; }
    return String((hh + 24) % 24).padStart(2, "0") + ":" + String(mi).padStart(2, "0");
  }
  function row(k, v) {
    return v == null || v === "" ? "" :
      '<div class="pr"><dt>' + esc(k) + "</dt><dd>" + v + "</dd></div>";
  }

  /* The whole point of the sheet: show the working, name the convention used, and
   * be explicit where a different convention would give a different answer. */
  function patraHtml(p, opts, boundary, lang, fam) {
    if (!p || p.error) return "";
    var n = p.nakshatra, h = "", S = sh(lang || "en"), LB = S.L;
    /* Hoisted deliberately. This used to be declared inside the four-name
     * block; gating that block on Hindu scope meant the assignment was skipped
     * for Jain and Buddhist sheets, which silently took the sankalpa and the
     * shanti block down with it. A dosha going unreported is the worst possible
     * thing to lose quietly. */
    var FMod = (typeof globalThis !== "undefined" && globalThis.Family) || null;
    var dev = (lang === "hi" || lang === "mr");
    /* In Devanagari the term itself is the name, so the roman form is dropped
     * rather than shown alongside. Printing both is what made the sheet read
     * half-translated. */
    function nm(roman, devanagari) {
      return dev && devanagari ? devanagari : roman;
    }

    h += '<section class="patra" id="patraSheet">';
    h += '<header class="patra-head"><h2>' + esc(S.title) + "</h2>" +
      '<p>' + esc(opts.date) + " · " + esc(opts.time) +
      " · UTC" + (p.civil.tz >= 0 ? "+" : "") + p.civil.tz +
      (opts.placeName ? " · " + esc(opts.placeName) : "") + "</p></header>";

    // ---- the answer first
    h += '<div class="patra-answer">';
    h += '<p class="pa-label">' + esc(S.beginsWith) + "</p>";
    h += '<p class="pa-syl">' + esc(n.syllable) + "</p>";
    h += '<p class="pa-from">' + esc(nm(n.name, n.dev)) +
      " \u00b7 " + esc(S.pada) + " " + n.pada + "/4</p>";
    if (boundary) {
      h += '<p class="pa-window">' + esc(tpl(S.entered,
        { a: Math.round(boundary.sinceEntered), b: Math.round(boundary.untilNext) })) + "</p>";
    }
    h += "</div>";

    if (n.nearBoundary) {
      h += '<div class="warn">' + esc(S.seam) + "</div>";
    }

    // ---- doshas, high on the page because they change the plan
    if (p.doshas.length) {
      h += '<div class="patra-dosha"><h3>' + esc(S.flagged) + "</h3>";
      p.doshas.forEach(function (d) {
        h += "<p><strong>" + esc(d.label) + "</strong> " + esc(d.note) + "</p>";
      });
      h += "</div>";
    }

    // ---- the five limbs
    h += '<h3 class="patra-h">' + esc(S.panchangAt) + '</h3><dl class="patra-grid">';
    h += row(LB.tithi, esc(nm(p.tithi.paksha, p.tithi.pakshaDev)) + " " + esc(nm(p.tithi.name, p.tithi.dev)) +
      ' <span class="q">' + esc(tpl(S.elapsed, { n: Math.round(p.tithi.elapsedFraction * 100) })) + "</span>");
    h += row(LB.vaara, esc(dev ? p.vaara.dev : p.vaara.name + " / " + p.vaara.en) +
      (p.vaara.beforeSunrise
        ? ' <span class="q">' + esc(S.beforeSunrise) + "</span>" : ""));
    h += row(LB.nakshatra, esc(nm(n.name, n.dev)) + " \u00b7 " + esc(S.pada) + " " + n.pada);
    h += row(LB.yoga, esc(nm(p.yoga.name, p.yoga.dev)));
    h += row(LB.karana, esc(nm(p.karana.name, p.karana.dev)));
    h += "</dl>";

    h += '<h3 class="patra-h">' + esc(S.positions) + '</h3><dl class="patra-grid">';
    h += row(LB.janmaRashi, esc(dev ? p.rashi.dev : p.rashi.name + " (" + p.rashi.en + ")") +
      " \u00b7 " + esc(LB.lord) + " " + esc(nm(p.rashi.lord, p.rashi.lordDev)));
    h += row(LB.lagna, p.lagna
      ? esc(dev ? p.lagna.dev : p.lagna.rashi + " (" + p.lagna.en + ")") + " " + deg(p.lagna.degreeInRashi)
      : '<span class="q">' + esc(S.needPlace) + "</span>");
    h += row(LB.navamsa, esc(nm(p.navamsa.rashi, p.navamsa.dev)));
    h += row(LB.moonSid, deg(p.moon.siderealLon));
    h += row(LB.sunSid, deg(p.sun.siderealLon) + " \u00b7 " + esc(nm(p.sun.rashi, p.sun.rashiDev)));
    h += row(LB.sunriseSet, p.hasPlace ? hm(p.sunrise) + " — " + hm(p.sunset) : null);
    h += "</dl>";

    h += '<h3 class="patra-h">' + esc(S.attributes) + '</h3><dl class="patra-grid">';
    h += row(LB.lord, esc(nm(n.lord, n.lordDev)));
    h += row(LB.deity, esc(nm(n.deity, n.deityDev)));
    h += row(LB.gana, esc(nm(n.gana, n.ganaDev)));
    h += row(LB.yoni, esc(nm(n.yoni, n.yoniDev)));
    h += row(LB.nadi, esc(nm(n.nadi, n.nadiDev)));
    h += row(LB.varna, esc(nm(p.rashi.varna, p.rashi.varnaDev)) + ' <span class="q">' +
      esc(tpl(LB.fromTattva, { t: nm(p.rashi.tattva, p.rashi.tattvaDev) })) + "</span>");
    h += "</dl>";

    // ---- the four names, which most families have never been told about
    /* The four-name set is described in the grihya sutras, which are Vedic
     * texts. A Jain or Buddhist family may well keep the birth star -- that is
     * why the panchang above still runs for them -- but attributing their
     * naming custom to the grihya sutras would be putting words in their
     * tradition's mouth. So this block is Hindu-only, and the nakshatra
     * syllable above it stands on its own for everyone. */
    if (!fam || fam.scope === "full") {
    h += '<h3 class="patra-h">' + esc(S.fourNames) + "</h3>";
    h += '<p class="patra-note">' + esc(S.fourNote) + "</p>";
    h += '<dl class="patra-grid">';
    h += row(LB.nakNama, esc(S.beginsWithShort) + " <strong>" + esc(n.syllable) + "</strong>" +
      ' <span class="q">' + esc(S.privateNote) + "</span>");
    h += row(LB.masaNama, esc(nm(p.masa.nama, p.masa.namaDev)) +
      ' <span class="q">' + esc(tpl(S.fromMasa, { masa: nm(p.masa.name, p.masa.dev) })) + "</span>");
    /* This row used to read "ask your family". Now that the kula devata is
     * asked for, it is filled like the rest of the set. */

    var dn = (fam && fam.deity && FMod) ? FMod.devataNama(fam.deity, opts.gender) : null;
    if (dn && dn.names.length) {
      h += row(LB.devataNama, esc(dn.names.slice(0, 4).join(", ")) +
        ' <span class="q">' + esc(tpl(S.fromDeity, { deity: dn.deity })) + "</span>");
    } else if (fam && fam.deity) {
      h += row(LB.devataNama, esc(fam.deity) +
        ' <span class="q">' + esc(S.deityNoNames) + "</span>");
    } else {
      h += row(LB.devataNama, '<span class="q">' + esc(S.askFamily) + "</span>");
    }
    h += row(LB.vyavaharika, '<span class="q">' + esc(S.everyday) + "</span>");
    h += "</dl>";
    }

    // ---- alternates, stated plainly
    h += '<h3 class="patra-h">' + esc(S.rashiAlt) + "</h3>";
    h += '<p class="patra-note">' + esc(tpl(S.rashiNote, { rashi: nm(p.rashi.name, p.rashi.dev) })) + "</p>";
    h += '<p class="akshara">' + p.rashi.akshara.map(function (a) {
      return '<span class="ak' + (a === n.syllable ? " on" : "") + '">' + esc(a) + "</span>";
    }).join("") + "</p>";

    // ---- the working
    /* The lineage he recites in the sankalpa. Writing it down saves him asking
     * on the day, which is the whole point of a sheet. */
    /* fam arrives null for any tradition that does not use the panel, so
     * none of this can leak onto a Muslim or Christian sheet. */
    if (fam && FMod) {
      var sk = FMod.sankalpa(fam);
      if (sk.length) {
        h += '<h3 class="patra-h">' + esc(S.sankalpa) + '</h3><dl class="patra-grid">';
        sk.forEach(function (r) { h += row(r[0], esc(r[1])); });
        h += "</dl>";
      }
      /* Which shanti is usually prescribed, and when. Named so a family can
       * raise it with him early; the vidhi is deliberately not described. */
      var sh2 = FMod.shantiFor(p.doshas, fam.eldest === "yes" ? true : fam.eldest === "no" ? false : null);
      if (sh2.length) {
        h += '<h3 class="patra-h">' + esc(S.shantiHead) + "</h3>";
        h += '<p class="patra-note">' + esc(S.shantiNote) + "</p>";
        h += '<dl class="patra-grid">';
        sh2.forEach(function (x) {
          h += row(x.shanti, esc(x.when) + '<span class="q"><br>' + esc(x.note) + "</span>");
        });
        h += "</dl>";
      }
    }

    h += '<h3 class="patra-h">' + esc(S.working) + '</h3><dl class="patra-grid mono">';
    h += row(LB.ayanamsa, deg(p.ayanamsa));
    h += row(LB.jd, p.jd.toFixed(5));
    h += row(LB.moonTrop, deg(p.moon.tropicalLon));
    h += row(LB.moonLat, (p.moon.latitude >= 0 ? "+" : "") + p.moon.latitude.toFixed(4) + "°");
    h += row(LB.moonDist, Math.round(p.moon.distanceKm).toLocaleString() + " km");
    h += row(LB.parallax, p.topocentric
      ? (p.parallaxShift >= 0 ? "+" : "") + p.parallaxShift.toFixed(4) + "\u00b0 " + esc(S.forPlace)
      : '<span class="q">' + esc(S.noParallax) + "</span>");
    h += row(LB.lunarMonth, esc(nm(p.masa.name, p.masa.dev)) + " \u00b7 " +
      esc(tpl(S.reckoning, { r: nm(p.masa.reckoning, p.masa.reckoningDev) })));
    h += "</dl>";

    h += '<p class="patra-foot">' + esc(S.foot) + "</p>";
    h += "</section>";
    return h;
  }

  /* Muslim branch: Hijri date and the aqiqah window. */
  function hijriHtml(opts, lang) {
    var S = sh(lang || "en");
    var p = String(opts.date || "").split("-").map(Number);
    if (p.length !== 3 || !p[0]) return "";
    var hj = gregorianToHijri(p[0], p[1], p[2]);
    var h = '<section class="patra" id="patraSheet">';
    h += '<header class="patra-head"><h2>' + esc(S.record) + "</h2><p>" + esc(opts.date) + "</p></header>";
    h += '<div class="patra-answer"><p class="pa-label">' + esc(S.hijriDate) + "</p>";
    h += '<p class="pa-syl small">' + hj.day + " " + esc(hj.monthName) + " " + hj.year + " AH</p></div>";
    h += '<h3 class="patra-h">' + esc(S.aqiqah) + '</h3><dl class="patra-grid">';
    h += row(S.day7, esc(addDays(opts.date, 6)));
    h += row(S.day14, esc(addDays(opts.date, 13)) + ' <span class="q">' + esc(S.ifMissed) + "</span>");
    h += row(S.day21, esc(addDays(opts.date, 20)) + ' <span class="q">' + esc(S.andIfMissed) + "</span>");
    h += "</dl>";
    h += '<p class="patra-foot">' + esc(S.hijriFoot) + "</p>";
    h += "</section>";
    return h;
  }

  var api = {
    TRADITIONS: TRADITIONS,
    byId: byId,
    labelFor: labelFor, blurbFor: blurbFor, letterLabelFor: letterLabelFor,
    familyScope: familyScope, officiant: officiant,
    sheetStrings: sh,
    patraHtml: patraHtml,
    hijriHtml: hijriHtml,
    gregorianToHijri: gregorianToHijri
  };
  if (typeof globalThis !== "undefined") globalThis.Traditions = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
