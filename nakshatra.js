/* Naamkaran — nakshatra engine
 * Moon position via Meeus, "Astronomical Algorithms" 2nd ed., ch. 47 (ELP-2000/82 truncation).
 * Sidereal (Lahiri) conversion + topocentric parallax correction per Meeus ch. 40.
 * Typical accuracy: ~0.01 deg in longitude, well inside one pada (0.833 deg).
 * This is a computed estimate, not a substitute for a family priest's panchang.
 */
(function () {
  "use strict";

  var D2R = Math.PI / 180;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function norm360(x) { x = x % 360; return x < 0 ? x + 360 : x; }

  // Table 47.A — args (D, M, M', F), coeff for longitude (1e-6 deg) and radius (1e-3 km)
  var TA = [
    0,0,1,0,6288774,-20905355, 2,0,-1,0,1274027,-3699111, 2,0,0,0,658314,-2955968,
    0,0,2,0,213618,-569925, 0,1,0,0,-185116,48888, 0,0,0,2,-114332,-3149,
    2,0,-2,0,58793,246158, 2,-1,-1,0,57066,-152138, 2,0,1,0,53322,-170733,
    2,-1,0,0,45758,-204586, 0,1,-1,0,-40923,-129620, 1,0,0,0,-34720,108743,
    0,1,1,0,-30383,104755, 2,0,0,-2,15327,10321, 0,0,1,2,-12528,0,
    0,0,1,-2,10980,79661, 4,0,-1,0,10675,-34782, 0,0,3,0,10034,-23210,
    4,0,-2,0,8548,-21636, 2,1,-1,0,-7888,24208, 2,1,0,0,-6766,30824,
    1,0,-1,0,-5163,-8379, 1,1,0,0,4987,-16675, 2,-1,1,0,4036,-12831,
    2,0,2,0,3994,-10445, 4,0,0,0,3861,-11650, 2,0,-3,0,3665,14403,
    0,1,-2,0,-2689,-7003, 2,0,-1,2,-2602,0, 2,-1,-2,0,2390,10056,
    1,0,1,0,-2348,6322, 2,-2,0,0,2236,-9884, 0,1,2,0,-2120,5751,
    0,2,0,0,-2069,0, 2,-2,-1,0,2048,-4950, 2,0,1,-2,-1773,4130,
    2,0,0,2,-1595,0, 4,-1,-1,0,1215,-3958, 0,0,2,2,-1110,0,
    3,0,-1,0,-892,3258, 2,1,1,0,-810,2616, 4,-1,-2,0,759,-1897,
    0,2,-1,0,-713,-2117, 2,2,-1,0,-700,2354, 2,1,-2,0,691,0,
    2,-1,0,-2,596,0, 4,0,1,0,549,-1423, 0,0,4,0,537,-1117,
    4,-1,0,0,520,-1571, 1,0,-2,0,-487,-1739, 2,1,0,-2,-399,0,
    0,0,2,-2,-381,-4421, 1,1,1,0,351,0, 3,0,-2,0,-340,0,
    4,0,-3,0,330,0, 2,-1,2,0,327,0, 0,2,1,0,-323,1165,
    1,1,-1,0,299,0, 2,0,3,0,294,0, 2,0,-1,-2,0,8752
  ];

  // Table 47.B — args (D, M, M', F), coeff for latitude (1e-6 deg)
  var TB = [
    0,0,0,1,5128122, 0,0,1,1,280602, 0,0,1,-1,277693, 2,0,0,-1,173237,
    2,0,-1,1,55413, 2,0,-1,-1,46271, 2,0,0,1,32573, 0,0,2,1,17198,
    2,0,1,-1,9266, 0,0,2,-1,8822, 2,-1,0,-1,8216, 2,0,-2,-1,4324,
    2,0,1,1,4200, 2,1,0,-1,-3359, 2,-1,-1,1,2463, 2,-1,0,1,2211,
    2,-1,-1,-1,2065, 0,1,-1,-1,-1870, 4,0,-1,-1,1828, 0,1,0,1,-1794,
    0,0,0,3,-1749, 0,1,-1,1,-1565, 1,0,0,1,-1491, 0,1,1,1,-1475,
    0,1,1,-1,-1410, 0,1,0,-1,-1344, 1,0,0,-1,-1335, 0,0,3,1,1107,
    4,0,0,-1,1021, 4,0,-1,1,833, 0,0,1,-3,777, 4,0,-2,1,671,
    2,0,0,-3,607, 2,0,2,-1,596, 2,-1,1,-1,491, 2,0,-2,1,-451,
    0,0,3,-1,439, 2,0,2,1,422, 2,0,-3,-1,421, 2,1,-1,1,-366,
    2,1,0,1,-351, 4,0,0,1,331, 2,-1,1,1,315, 2,-2,0,-1,302,
    0,0,1,3,-283, 2,1,1,-1,-229, 1,1,0,-1,223, 1,1,0,1,223,
    0,1,-2,-1,-220, 2,1,-1,-1,-220, 1,0,1,1,-185, 2,-1,-2,-1,181,
    0,1,2,1,-177, 4,0,-2,-1,176, 4,-1,-1,-1,166, 1,0,1,-1,-164,
    4,0,1,-1,132, 1,0,-1,-1,-119, 4,-1,0,-1,115, 2,-2,0,1,107
  ];

  // Julian Day from a UTC calendar moment (Gregorian; Meeus 7.1)
  function julianDay(y, m, d, hoursUTC) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) +
      d + B - 1524.5 + hoursUTC / 24;
  }

  // Approximate TT - UT1 in seconds (Espenak/Meeus polynomial set, 1900-2150 branches)
  function deltaT(year) {
    var t, u;
    if (year >= 2015) { t = year - 2015; return 67.62 + 0.3645 * t + 0.0039755 * t * t; }
    if (year >= 2005) { t = year - 2005; return 64.69 + 0.2930 * t; }
    if (year >= 1986) { t = year - 2000; return 63.86 + 0.3345 * t - 0.060374 * t * t +
      0.0017275 * Math.pow(t, 3) + 0.000651814 * Math.pow(t, 4) + 0.00002373599 * Math.pow(t, 5); }
    if (year >= 1961) { t = year - 1975; return 45.45 + 1.067 * t - t * t / 260 - Math.pow(t, 3) / 718; }
    if (year >= 1941) { t = year - 1950; return 29.07 + 0.407 * t - t * t / 233 + Math.pow(t, 3) / 2547; }
    if (year >= 1920) { t = year - 1920; return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * Math.pow(t, 3); }
    u = (year - 1900) / 100;
    return -2.79 + 149.4119 * u - 598.939 * u * u + 6196.6 * Math.pow(u, 3) - 19700 * Math.pow(u, 4);
  }

  /* Geocentric apparent Moon position from JDE (TT-based Julian Day).
   * Returns { lon, lat, dist } — ecliptic of date, degrees and km. */
  function moonPosition(jde) {
    var T = (jde - 2451545) / 36525;
    var Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T +
      Math.pow(T, 3) / 538841 - Math.pow(T, 4) / 65194000);
    var D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T +
      Math.pow(T, 3) / 545868 - Math.pow(T, 4) / 113065000);
    var M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T +
      Math.pow(T, 3) / 24490000);
    var Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T +
      Math.pow(T, 3) / 69699 - Math.pow(T, 4) / 14712000);
    var F = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T -
      Math.pow(T, 3) / 3526000 + Math.pow(T, 4) / 863310000);
    var A1 = norm360(119.75 + 131.849 * T);
    var A2 = norm360(53.09 + 479264.290 * T);
    var A3 = norm360(313.45 + 481266.484 * T);
    var E = 1 - 0.002516 * T - 0.0000074 * T * T;

    var sl = 0, sr = 0, sb = 0, i, a, ecc;
    for (i = 0; i < TA.length; i += 6) {
      a = TA[i] * D + TA[i + 1] * M + TA[i + 2] * Mp + TA[i + 3] * F;
      ecc = Math.pow(E, Math.abs(TA[i + 1]));
      sl += TA[i + 4] * ecc * sin(a);
      sr += TA[i + 5] * ecc * cos(a);
    }
    for (i = 0; i < TB.length; i += 5) {
      a = TB[i] * D + TB[i + 1] * M + TB[i + 2] * Mp + TB[i + 3] * F;
      sb += TB[i + 4] * Math.pow(E, Math.abs(TB[i + 1])) * sin(a);
    }
    // additive terms (Venus, Jupiter, flattening of the Earth)
    sl += 3958 * sin(A1) + 1962 * sin(Lp - F) + 318 * sin(A2);
    sb += -2235 * sin(Lp) + 382 * sin(A3) + 175 * sin(A1 - F) + 175 * sin(A1 + F) +
      127 * sin(Lp - Mp) - 115 * sin(Lp + Mp);

    return {
      lon: norm360(Lp + sl / 1e6),
      lat: sb / 1e6,
      dist: 385000.56 + sr / 1000
    };
  }

  // Lahiri (Chitrapaksha) ayanamsa, degrees. Reference epoch 1900.0.
  function lahiriAyanamsa(jd) {
    var T = (jd - 2415020.0) / 36525;
    return 22.460148 + 1.396042 * T + 0.000308 * T * T + 0.000002 * Math.pow(T, 3);
  }

  // Mean obliquity of the ecliptic (Meeus 22.2), degrees
  function obliquity(jde) {
    var T = (jde - 2451545) / 36525;
    return 23.4392911 - (46.8150 * T + 0.00059 * T * T - 0.001813 * Math.pow(T, 3)) / 3600;
  }

  // Apparent sidereal time at Greenwich (Meeus 12.4), degrees
  function greenwichSiderealTime(jd) {
    var T = (jd - 2451545) / 36525;
    return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) +
      0.000387933 * T * T - Math.pow(T, 3) / 38710000);
  }

  /* Topocentric correction: shift the geocentric ecliptic position to what an
   * observer at (latDeg, lonDegEast) actually sees. Meeus ch. 40. */
  function toTopocentric(lon, lat, distKm, jd, jde, latDeg, lonDegEast) {
    var eps = obliquity(jde);
    var sl = sin(lon), cl = cos(lon), sb = sin(lat), cb = cos(lat);
    var se = sin(eps), ce = cos(eps);

    // ecliptic -> equatorial
    var ra = norm360(Math.atan2(sl * ce - Math.tan(lat * D2R) * se, cl) / D2R);
    var dec = Math.asin(sb * ce + cb * se * sl) / D2R;

    // observer's geocentric coordinates (IAU 1976 flattening, sea level)
    var u = Math.atan(0.99664719 * Math.tan(latDeg * D2R));
    var rhoSin = 0.99664719 * Math.sin(u);
    var rhoCos = Math.cos(u);

    var sinPi = 6378.14 / distKm;                      // equatorial horizontal parallax
    var H = norm360(greenwichSiderealTime(jd) + lonDegEast - ra);

    var denom = cos(dec) - rhoCos * sinPi * cos(H);
    var dRa = Math.atan2(-rhoCos * sinPi * sin(H), denom) / D2R;
    var decT = Math.atan2((sin(dec) - rhoSin * sinPi) * cos(dRa), denom) / D2R;
    var raT = norm360(ra + dRa);

    // equatorial -> ecliptic
    var sd = sin(decT), cd = cos(decT), sa = sin(raT), ca = cos(raT);
    return {
      lon: norm360(Math.atan2(sa * ce + Math.tan(decT * D2R) * se, ca) / D2R),
      lat: Math.asin(sd * ce - cd * se * sa) / D2R,
      shift: lon - norm360(Math.atan2(sa * ce + Math.tan(decT * D2R) * se, ca) / D2R)
    };
  }

  var NAKSHATRAS = [
    ["Ashwini", "अश्विनी", ["Chu", "Che", "Cho", "La"]],
    ["Bharani", "भरणी", ["Li", "Lu", "Le", "Lo"]],
    ["Krittika", "कृत्तिका", ["A", "I", "U", "E"]],
    ["Rohini", "रोहिणी", ["O", "Va / Ba", "Vi / Bi", "Vu / Bu"]],
    ["Mrigashira", "मृगशिरा", ["Ve / Be", "Vo / Bo", "Ka", "Ki"]],
    ["Ardra", "आर्द्रा", ["Ku", "Gha", "Nga", "Chha"]],
    ["Punarvasu", "पुनर्वसु", ["Ke", "Ko", "Ha", "Hi"]],
    ["Pushya", "पुष्य", ["Hu", "He", "Ho", "Da"]],
    ["Ashlesha", "आश्लेषा", ["Di", "Du", "De", "Do"]],
    ["Magha", "मघा", ["Ma", "Mi", "Mu", "Me"]],
    ["Purva Phalguni", "पूर्वा फाल्गुनी", ["Mo", "Ta", "Ti", "Tu"]],
    ["Uttara Phalguni", "उत्तरा फाल्गुनी", ["Te", "To", "Pa", "Pi"]],
    ["Hasta", "हस्त", ["Pu", "Sha", "Na", "Tha"]],
    ["Chitra", "चित्रा", ["Pe", "Po", "Ra", "Ri"]],
    ["Swati", "स्वाती", ["Ru", "Re", "Ro", "Ta"]],
    ["Vishakha", "विशाखा", ["Ti", "Tu", "Te", "To"]],
    ["Anuradha", "अनुराधा", ["Na", "Ni", "Nu", "Ne"]],
    ["Jyeshtha", "ज्येष्ठा", ["No", "Ya", "Yi", "Yu"]],
    ["Mula", "मूल", ["Ye", "Yo", "Bha", "Bhi"]],
    ["Purva Ashadha", "पूर्वाषाढा", ["Bhu", "Dha", "Pha", "Dha"]],
    ["Uttara Ashadha", "उत्तराषाढा", ["Bhe", "Bho", "Ja", "Ji"]],
    ["Shravana", "श्रवण", ["Ju / Khi", "Je / Khu", "Jo / Khe", "Gha / Kho"]],
    ["Dhanishta", "धनिष्ठा", ["Ga", "Gi", "Gu", "Ge"]],
    ["Shatabhisha", "शतभिषा", ["Go", "Sa", "Si", "Su"]],
    ["Purva Bhadrapada", "पूर्वा भाद्रपदा", ["Se", "So", "Da", "Di"]],
    ["Uttara Bhadrapada", "उत्तरा भाद्रपदा", ["Du", "Tha", "Jha", "Tra / Na"]],
    ["Revati", "रेवती", ["De", "Do", "Cha", "Chi"]]
  ];

  var RASHIS = [
    ["Mesha", "Aries"], ["Vrishabha", "Taurus"], ["Mithuna", "Gemini"],
    ["Karka", "Cancer"], ["Simha", "Leo"], ["Kanya", "Virgo"],
    ["Tula", "Libra"], ["Vrishchika", "Scorpio"], ["Dhanu", "Sagittarius"],
    ["Makara", "Capricorn"], ["Kumbha", "Aquarius"], ["Meena", "Pisces"]
  ];

  /* Main entry.
   * opts: { date: "YYYY-MM-DD", time: "HH:MM", tzOffsetHours: Number,
   *         lat: Number|null, lon: Number|null }   (lon east-positive)
   * Returns { nakshatra, nakshatraHi, index, pada, syllables, syllable,
   *           rashi, rashiEn, siderealLon, moonLonTropical, parallaxShift,
   *           topocentric, nearBoundary, degreesIntoPada } or { error }. */
  function compute(opts) {
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(opts.date || "").trim());
    var tm = /^(\d{1,2}):(\d{2})$/.exec(String(opts.time || "").trim());
    if (!dm) return { error: "bad-date" };
    if (!tm) return { error: "bad-time" };
    var tz = Number(opts.tzOffsetHours);
    if (!isFinite(tz)) return { error: "bad-timezone" };

    var y = +dm[1], mo = +dm[2], d = +dm[3];
    var hh = +tm[1], mi = +tm[2];
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || hh > 23 || mi > 59) return { error: "bad-date" };

    var hoursUTC = hh + mi / 60 - tz;          // local clock -> UTC
    var jd = julianDay(y, mo, d, hoursUTC);    // UT-based
    var jde = jd + deltaT(y) / 86400;          // TT-based, for the lunar theory

    var geo = moonPosition(jde);
    var lonUsed = geo.lon, latUsed = geo.lat, shift = 0, topo = false;
    var hasPlace = isFinite(Number(opts.lat)) && isFinite(Number(opts.lon)) &&
      opts.lat !== null && opts.lat !== "" && opts.lon !== null && opts.lon !== "";
    if (hasPlace) {
      var t = toTopocentric(geo.lon, geo.lat, geo.dist, jd, jde, Number(opts.lat), Number(opts.lon));
      lonUsed = t.lon; latUsed = t.lat; topo = true;
      shift = ((geo.lon - t.lon + 540) % 360) - 180;
    }

    var sid = norm360(lonUsed - lahiriAyanamsa(jd));
    var nIdx = Math.floor(sid / (40 / 3));               // 13 deg 20' each
    var within = sid - nIdx * (40 / 3);
    var pada = Math.floor(within / (10 / 3)) + 1;        // 3 deg 20' each
    var intoPada = within - (pada - 1) * (10 / 3);
    var nk = NAKSHATRAS[nIdx];
    var rIdx = Math.floor(sid / 30);

    return {
      nakshatra: nk[0], nakshatraHi: nk[1], index: nIdx + 1,
      pada: pada, syllables: nk[2].slice(), syllable: nk[2][pada - 1],
      rashi: RASHIS[rIdx][0], rashiEn: RASHIS[rIdx][1],
      siderealLon: sid, moonLonTropical: lonUsed, moonLat: latUsed,
      moonDistKm: geo.dist, ayanamsa: lahiriAyanamsa(jd),
      parallaxShift: shift, topocentric: topo, jd: jd,
      degreesIntoPada: intoPada,
      // within ~0.05 deg of a pada edge, a real panchang may disagree with us
      nearBoundary: intoPada < 0.05 || (10 / 3) - intoPada < 0.05
    };
  }

  var api = {
    compute: compute, moonPosition: moonPosition, julianDay: julianDay,
    lahiriAyanamsa: lahiriAyanamsa, deltaT: deltaT, NAKSHATRAS: NAKSHATRAS
  };
  if (typeof globalThis !== "undefined") globalThis.Nakshatra = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
