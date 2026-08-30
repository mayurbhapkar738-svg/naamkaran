/* Naamkaran — front-end app
 * Depends on config.js (window.NAAMKARAN_CONFIG) and nakshatra.js (window.Nakshatra).
 */
(function () {
  "use strict";

  var CFG = window.NAAMKARAN_CONFIG || {};
  var API = String(CFG.WORKER_URL || "").replace(/\/$/, "");
  var POPULAR_AT = CFG.POPULAR_AT || 3;
  var LIST_KEY = "naamkaran.shortlist.v1";

  var STR = {
    en: {
      tagline: "Indian baby names, chosen the way families actually choose them.",
      lblTradition: "Naming tradition",
      hintTradition: "Defaults to Hindu. Pick another to switch traditions entirely.",
      lblGender: "For a", genderAny: "Either", genderBoy: "Boy", genderGirl: "Girl",
      lblLetter: "Starting letter (optional)", anyLetter: "Any letter",
      lblSibling: "Older sibling's name (optional)",
      hintSibling: "Names will be chosen to sit well beside it.",
      lblThoughts: "Or just say what you're after",
      thoughtsPlaceholder: "something meaning 'radiant', short, easy to say in English",
      nakClosed: "＋ Use the birth star (nakshatra) to pick the starting sound",
      nakOpen: "− Hide birth details",
      lblDob: "Date of birth", lblTob: "Time of birth (local clock)",
      lblTz: "Timezone at birth", lblPlace: "Place of birth",
      lblLat: "Latitude (north positive)", lblLon: "Longitude (east positive)",
      otherPlace: "Somewhere else (enter coordinates)",
      calcBtn: "Calculate nakshatra", clearStar: "Clear",
      goBtn: "Suggest names", moreBtn: "More like this",
      lblResults: "Suggestions",
      publicNote: "Adoption counts are shared by everyone using this site.",
      thinking: "Consulting the naming traditions…",
      needDate: "Enter the date of birth.", needTime: "Enter the time of birth.",
      needCoords: "Enter both latitude and longitude, or pick a city.",
      calcFailed: "Could not read those birth details.",
      starLine: "Nakshatra {n}, pada {p} — moon in {r}",
      sylLabel: "Name should start with:",
      parallaxOn: "Adjusted for your place of birth ({d}°).",
      parallaxOff: "No place given, so this is the geocentric position. Adding a place can shift the pada.",
      boundary: "This falls very close to a pada boundary, so a panchang may put it in the neighbouring pada. Worth confirming.",
      usingStar: "Using the nakshatra sound{s} instead of the letter picker.",
      pick: "I'd pick this name", popular: "Popular", adoptions: "{n} picked this",
      errGeneric: "Something went wrong while gathering names. Try again.",
      errRate: "Too many requests just now — wait a minute and try again.",
      errQuota: "Today's free quota is used up. Try again tomorrow.",
      errConfig: "The backend isn't configured yet (missing API key).",
      errNone: "No names came back. Try loosening the filters.",
      trayCount: "{n} shortlisted: {names}",
      shareBtn: "Share this shortlist", clearList: "Clear", copyBtn: "Copy", copied: "Copied",
      sharing: "Creating link…", shareFail: "Could not create the link. Try again.",
      sharedTitle: "A shortlist shared with you",
      sharedMeta: "{n} names, saved {d}.", sharedDismiss: "Start my own search",
      nakIntro: "Traditionally an astrologer works out the baby's nakshatra and pada from the exact birth moment, and that decides which sound the name should start with. Enter the birth details and this will compute it.",
      footNote: "Nakshatra and pada are computed from the Moon's position using standard astronomical formulas (Lahiri ayanamsa, with a correction for your place of birth). It is a careful estimate, not a replacement for your family priest's panchang — near a pada boundary the two can differ.",
      footFree: "Runs on free tiers, so name generation is rate limited. If it stops responding, try again tomorrow."
    }
  };

  STR.hi = {
    tagline: "भारतीय शिशु नाम — जैसे परिवार असल में चुनते हैं।",
    lblTradition: "नामकरण परंपरा",
    hintTradition: "डिफ़ॉल्ट हिंदू है। दूसरी परंपरा चुनने पर वही लागू होगी।",
    lblGender: "किसके लिए", genderAny: "कोई भी", genderBoy: "बेटा", genderGirl: "बेटी",
    lblLetter: "पहला अक्षर (वैकल्पिक)", anyLetter: "कोई भी अक्षर",
    lblSibling: "बड़े भाई/बहन का नाम (वैकल्पिक)",
    hintSibling: "नाम उसके साथ मेल खाते हुए चुने जाएंगे।",
    lblThoughts: "या अपने मन की बात लिखें",
    thoughtsPlaceholder: "‘तेजस्वी’ अर्थ वाला, छोटा, बोलने में आसान",
    nakClosed: "＋ जन्म नक्षत्र से पहला अक्षर तय करें",
    nakOpen: "− जन्म विवरण छिपाएं",
    lblDob: "जन्म तिथि", lblTob: "जन्म समय (स्थानीय घड़ी)",
    lblTz: "जन्म के समय का टाइमज़ोन", lblPlace: "जन्म स्थान",
    lblLat: "अक्षांश (उत्तर धनात्मक)", lblLon: "देशांतर (पूर्व धनात्मक)",
    otherPlace: "अन्य स्थान (निर्देशांक भरें)",
    calcBtn: "नक्षत्र निकालें", clearStar: "हटाएं",
    goBtn: "नाम सुझाएं", moreBtn: "और सुझाव",
    lblResults: "सुझाव",
    publicNote: "पसंद की गिनती इस साइट के सभी उपयोगकर्ताओं में साझा है।",
    thinking: "नाम खोजे जा रहे हैं…",
    needDate: "जन्म तिथि भरें।", needTime: "जन्म समय भरें।",
    needCoords: "अक्षांश और देशांतर दोनों भरें, या शहर चुनें।",
    calcFailed: "जन्म विवरण पढ़ा नहीं जा सका।",
    starLine: "नक्षत्र {n}, पाद {p} — चंद्र {r} राशि में",
    sylLabel: "नाम इस ध्वनि से शुरू हो:",
    parallaxOn: "जन्म स्थान के अनुसार सुधार किया गया ({d}°)।",
    parallaxOff: "स्थान नहीं दिया गया, यह भू-केंद्रित स्थिति है। स्थान जोड़ने पर पाद बदल सकता है।",
    boundary: "यह पाद की सीमा के बहुत पास है, पंचांग इसे अगला पाद बता सकता है। पुष्टि कर लें।",
    usingStar: "अक्षर चयन की जगह नक्षत्र ध्वनि का उपयोग हो रहा है।",
    pick: "यह नाम मुझे पसंद है", popular: "लोकप्रिय", adoptions: "{n} ने चुना",
    errGeneric: "नाम लाते समय कुछ गड़बड़ हुई। दोबारा कोशिश करें।",
    errRate: "बहुत सारे अनुरोध — एक मिनट बाद कोशिश करें।",
    errQuota: "आज की मुफ़्त सीमा पूरी हो गई। कल कोशिश करें।",
    errConfig: "बैकएंड तैयार नहीं है (API की नहीं मिली)।",
    errNone: "कोई नाम नहीं मिला। फ़िल्टर कम करके देखें।",
    trayCount: "{n} चुने गए: {names}",
    shareBtn: "यह सूची साझा करें", clearList: "हटाएं", copyBtn: "कॉपी", copied: "कॉपी हो गया",
    sharing: "लिंक बन रहा है…", shareFail: "लिंक नहीं बना। दोबारा कोशिश करें।",
    sharedTitle: "आपके साथ साझा की गई सूची",
    sharedMeta: "{n} नाम, {d} को सहेजे गए।", sharedDismiss: "अपनी खोज शुरू करें",
    nakIntro: "परंपरा में ज्योतिषी जन्म के ठीक समय से शिशु का नक्षत्र और पाद निकालते हैं, और उससे तय होता है कि नाम किस ध्वनि से शुरू हो। जन्म विवरण भरें, यह गणना यहीं हो जाएगी।",
    footNote: "नक्षत्र और पाद चंद्रमा की स्थिति से मानक खगोलीय सूत्रों द्वारा निकाले जाते हैं (लाहिड़ी अयनांश, जन्म स्थान के लिए सुधार सहित)। यह एक सावधान अनुमान है, आपके पुरोहित के पंचांग का विकल्प नहीं — पाद की सीमा के पास दोनों में अंतर हो सकता है।",
    footFree: "यह मुफ़्त सेवाओं पर चलता है, इसलिए नाम सुझाव सीमित हैं। यदि उत्तर न मिले तो कल कोशिश करें।"
  };

  STR.mr = {
    tagline: "भारतीय बाळांची नावे — कुटुंबे जशी निवडतात तशी.",
    lblTradition: "नामकरण परंपरा",
    hintTradition: "मूलतः हिंदू. दुसरी परंपरा निवडल्यास तीच वापरली जाईल.",
    lblGender: "कोणासाठी", genderAny: "काहीही", genderBoy: "मुलगा", genderGirl: "मुलगी",
    lblLetter: "पहिले अक्षर (ऐच्छिक)", anyLetter: "कोणतेही अक्षर",
    lblSibling: "मोठ्या भावंडाचे नाव (ऐच्छिक)",
    hintSibling: "त्याच्यासोबत शोभणारी नावे निवडली जातील.",
    lblThoughts: "किंवा तुमच्या मनातले लिहा",
    thoughtsPlaceholder: "‘तेजस्वी’ अर्थाचे, लहान, म्हणायला सोपे",
    nakClosed: "＋ जन्म नक्षत्रावरून पहिले अक्षर ठरवा",
    nakOpen: "− जन्म तपशील लपवा",
    lblDob: "जन्म तारीख", lblTob: "जन्म वेळ (स्थानिक घड्याळ)",
    lblTz: "जन्मवेळेचा टाइमझोन", lblPlace: "जन्मस्थान",
    lblLat: "अक्षांश (उत्तर धन)", lblLon: "रेखांश (पूर्व धन)",
    otherPlace: "इतर ठिकाण (निर्देशांक भरा)",
    calcBtn: "नक्षत्र काढा", clearStar: "काढून टाका",
    goBtn: "नावे सुचवा", moreBtn: "अशीच अजून",
    lblResults: "सुचवलेली नावे",
    publicNote: "पसंतीची मोजणी या साइटच्या सर्व वापरकर्त्यांमध्ये सामायिक आहे.",
    thinking: "नावे शोधत आहे…",
    needDate: "जन्म तारीख भरा.", needTime: "जन्म वेळ भरा.",
    needCoords: "अक्षांश व रेखांश दोन्ही भरा, किंवा शहर निवडा.",
    calcFailed: "जन्म तपशील वाचता आला नाही.",
    starLine: "नक्षत्र {n}, पाद {p} — चंद्र {r} राशीत",
    sylLabel: "नाव या ध्वनीने सुरू व्हावे:",
    parallaxOn: "जन्मस्थानानुसार सुधारणा केली ({d}°).",
    parallaxOff: "स्थान दिले नाही, ही भूकेंद्री स्थिती आहे. स्थान दिल्यास पाद बदलू शकतो.",
    boundary: "हे पादाच्या सीमेजवळ आहे, पंचांग शेजारचा पाद सांगू शकते. खात्री करून घ्या.",
    usingStar: "अक्षराऐवजी नक्षत्र ध्वनी वापरली जात आहे.",
    pick: "हे नाव मला आवडले", popular: "लोकप्रिय", adoptions: "{n} जणांनी निवडले",
    errGeneric: "नावे आणताना अडचण आली. पुन्हा प्रयत्न करा.",
    errRate: "फार विनंत्या — एक मिनिटाने पुन्हा प्रयत्न करा.",
    errQuota: "आजची मोफत मर्यादा संपली. उद्या प्रयत्न करा.",
    errConfig: "बॅकएंड तयार नाही (API की नाही).",
    errNone: "नावे मिळाली नाहीत. फिल्टर कमी करा.",
    trayCount: "{n} निवडली: {names}",
    shareBtn: "ही यादी शेअर करा", clearList: "काढा", copyBtn: "कॉपी", copied: "कॉपी झाले",
    sharing: "लिंक तयार होत आहे…", shareFail: "लिंक तयार झाली नाही. पुन्हा प्रयत्न करा.",
    sharedTitle: "तुमच्यासोबत शेअर केलेली यादी",
    sharedMeta: "{n} नावे, {d} रोजी जतन केली.", sharedDismiss: "माझा शोध सुरू करा",
    nakIntro: "परंपरेनुसार ज्योतिषी जन्माच्या अचूक वेळेवरून बाळाचे नक्षत्र आणि पाद काढतात, आणि त्यावरून नाव कोणत्या ध्वनीने सुरू व्हावे हे ठरते. जन्म तपशील भरा, गणना येथेच होईल.",
    footNote: "नक्षत्र आणि पाद चंद्राच्या स्थितीवरून प्रमाणित खगोलीय सूत्रांनी काढले जातात (लाहिरी अयनांश, जन्मस्थानाची सुधारणा धरून). हा काळजीपूर्वक अंदाज आहे, तुमच्या गुरुजींच्या पंचांगाला पर्याय नाही — पादाच्या सीमेजवळ दोघांत फरक पडू शकतो.",
    footFree: "हे मोफत सेवांवर चालते, म्हणून नावांची निर्मिती मर्यादित आहे. प्रतिसाद न मिळाल्यास उद्या प्रयत्न करा."
  };

  var TRADITIONS = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Parsi", "Buddhist"];
  var TRAD_LABEL = {
    hi: ["हिंदू", "मुस्लिम", "सिख", "ईसाई", "जैन", "पारसी", "बौद्ध"],
    mr: ["हिंदू", "मुस्लिम", "शीख", "ख्रिश्चन", "जैन", "पारशी", "बौद्ध"]
  };

  // name, latitude, longitude (east positive)
  var CITIES = [
    ["Mumbai", 19.0760, 72.8777], ["Delhi", 28.6139, 77.2090], ["Bengaluru", 12.9716, 77.5946],
    ["Hyderabad", 17.3850, 78.4867], ["Chennai", 13.0827, 80.2707], ["Kolkata", 22.5726, 88.3639],
    ["Pune", 18.5204, 73.8567], ["Ahmedabad", 23.0225, 72.5714], ["Jaipur", 26.9124, 75.7873],
    ["Lucknow", 26.8467, 80.9462], ["Nagpur", 21.1458, 79.0882], ["Indore", 22.7196, 75.8577],
    ["Bhopal", 23.2599, 77.4126], ["Patna", 25.5941, 85.1376], ["Kanpur", 26.4499, 80.3319],
    ["Surat", 21.1702, 72.8311], ["Nashik", 19.9975, 73.7898], ["Kochi", 9.9312, 76.2673],
    ["Coimbatore", 11.0168, 76.9558], ["Visakhapatnam", 17.6868, 83.2185],
    ["Chandigarh", 30.7333, 76.7794], ["Amritsar", 31.6340, 74.8723],
    ["Guwahati", 26.1445, 91.7362], ["Bhubaneswar", 20.2961, 85.8245],
    ["Thiruvananthapuram", 8.5241, 76.9366], ["Varanasi", 25.3176, 82.9739],
    ["Aurangabad", 19.8762, 75.3433], ["Kolhapur", 16.7050, 74.2433],
    ["Ludhiana", 30.9010, 75.8573], ["Vadodara", 22.3072, 73.1812],
    ["Madurai", 9.9252, 78.1198], ["Ranchi", 23.3441, 85.3096],
    ["Raipur", 21.2514, 81.6296], ["Dehradun", 30.3165, 78.0322],
    ["Srinagar", 34.0837, 74.7973], ["Panaji", 15.4909, 73.8278],
    ["London", 51.5074, -0.1278], ["New York", 40.7128, -74.0060],
    ["Dubai", 25.2048, 55.2708], ["Singapore", 1.3521, 103.8198],
    ["Toronto", 43.6532, -79.3832], ["Sydney", -33.8688, 151.2093]
  ];

  var TIMEZONES = [
    ["India (IST, +5:30)", 5.5], ["Nepal (+5:45)", 5.75], ["Pakistan (+5:00)", 5],
    ["Sri Lanka (+5:30)", 5.5], ["Bangladesh (+6:00)", 6], ["Gulf / UAE (+4:00)", 4],
    ["UK (GMT, +0:00)", 0], ["UK summer (BST, +1:00)", 1],
    ["Central Europe (+1:00)", 1], ["Central Europe summer (+2:00)", 2],
    ["US Eastern (-5:00)", -5], ["US Eastern daylight (-4:00)", -4],
    ["US Central (-6:00)", -6], ["US Pacific (-8:00)", -8], ["US Pacific daylight (-7:00)", -7],
    ["Singapore / Malaysia (+8:00)", 8], ["Australia East (+10:00)", 10],
    ["Australia East daylight (+11:00)", 11], ["New Zealand (+12:00)", 12]
  ];

  var state = {
    lang: "en",
    tradition: "Hindu",
    gender: "any",
    star: null,        // result from Nakshatra.compute
    seen: [],          // names already shown, so "more like this" doesn't repeat
    shown: [],         // current batch
    list: [],          // shortlist
    busy: false
  };

  var $ = function (id) { return document.getElementById(id); };
  function t(key) {
    var pack = STR[state.lang] || STR.en;
    return pack[key] != null ? pack[key] : STR.en[key];
  }
  function fill(str, vals) {
    return String(str).replace(/\{(\w+)\}/g, function (_, k) {
      return vals[k] != null ? vals[k] : "";
    });
  }
  function setText(id, v) { var el = $(id); if (el) el.textContent = v; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- header star strip ----------
  function buildStars() {
    var box = $("stars");
    if (!box) return;
    var html = "";
    for (var i = 0; i < 27; i++) html += "<i></i>";
    box.innerHTML = html;
    var dots = box.querySelectorAll("i");
    setInterval(function () {
      dots.forEach(function (d) { d.classList.remove("lit"); });
      var k = state.star ? state.star.index - 1 : Math.floor(Math.random() * 27);
      if (dots[k]) dots[k].classList.add("lit");
    }, 2600);
  }

  // ---------- chips, selects ----------
  function renderTraditions() {
    var box = $("traditionChips");
    box.innerHTML = TRADITIONS.map(function (name, i) {
      var label = state.lang === "en" ? name : (TRAD_LABEL[state.lang] || [])[i] || name;
      return '<button type="button" class="chip" data-trad="' + esc(name) + '" aria-pressed="' +
        (state.tradition === name) + '">' + esc(label) + "</button>";
    }).join("");
  }
  function renderGenders() {
    var box = $("genderChips");
    var opts = [["any", t("genderAny")], ["boy", t("genderBoy")], ["girl", t("genderGirl")]];
    box.innerHTML = opts.map(function (o) {
      return '<button type="button" class="chip" data-gender="' + o[0] + '" aria-pressed="' +
        (state.gender === o[0]) + '">' + esc(o[1]) + "</button>";
    }).join("");
  }
  function renderLetters() {
    var sel = $("letter"), keep = sel.value;
    var html = '<option value="">' + esc(t("anyLetter")) + "</option>";
    "ABCDEFGHIJKLMNOPRSTUVYZ".split("").forEach(function (c) {
      html += '<option value="' + c + '">' + c + "</option>";
    });
    sel.innerHTML = html;
    sel.value = keep;
  }
  function renderTz() {
    var sel = $("tz");
    sel.innerHTML = TIMEZONES.map(function (z, i) {
      return '<option value="' + z[1] + '"' + (i === 0 ? " selected" : "") + ">" + esc(z[0]) + "</option>";
    }).join("");
  }
  function renderPlaces() {
    var sel = $("place"), keep = sel.value;
    var html = CITIES.map(function (c) {
      return '<option value="' + c[1] + "," + c[2] + '">' + esc(c[0]) + "</option>";
    }).join("");
    sel.innerHTML = html + '<option value="manual">' + esc(t("otherPlace")) + "</option>";
    sel.value = keep || (CITIES[0][1] + "," + CITIES[0][2]);
  }

  // ---------- language ----------
  function applyLanguage() {
    document.documentElement.lang = state.lang;
    setText("tagline", t("tagline"));
    setText("lblTradition", t("lblTradition"));
    setText("hintTradition", t("hintTradition"));
    setText("lblGender", t("lblGender"));
    setText("lblLetter", t("lblLetter"));
    setText("lblSibling", t("lblSibling"));
    setText("hintSibling", t("hintSibling"));
    setText("lblThoughts", t("lblThoughts"));
    setText("lblDob", t("lblDob"));
    setText("lblTob", t("lblTob"));
    setText("lblTz", t("lblTz"));
    setText("lblPlace", t("lblPlace"));
    setText("lblLat", t("lblLat"));
    setText("lblLon", t("lblLon"));
    setText("calcBtn", t("calcBtn"));
    setText("clearStarBtn", t("clearStar"));
    setText("goBtn", t("goBtn"));
    setText("moreBtn", t("moreBtn"));
    setText("lblResults", t("lblResults"));
    setText("publicNote", t("publicNote"));
    setText("shareBtn", t("shareBtn"));
    setText("clearListBtn", t("clearList"));
    setText("copyBtn", t("copyBtn"));
    setText("sharedTitle", t("sharedTitle"));
    setText("sharedDismiss", t("sharedDismiss"));
    setText("nakIntro", t("nakIntro"));
    setText("footNote", t("footNote"));
    setText("footFree", t("footFree"));
    setText("nakToggleLabel", $("nakPanel").hidden ? t("nakClosed") : t("nakOpen"));
    $("thoughts").placeholder = t("thoughtsPlaceholder");
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang));
    });
    renderTraditions(); renderGenders(); renderLetters(); renderPlaces();
    if (state.star) renderStar();
    if (state.shown.length) renderResults(state.shown);
    renderTray();
  }

  // ---------- nakshatra ----------
  function currentCoords() {
    var v = $("place").value;
    if (v === "manual") {
      var la = parseFloat($("lat").value), lo = parseFloat($("lon").value);
      if (!isFinite(la) || !isFinite(lo)) return null;
      return { lat: la, lon: lo };
    }
    var parts = String(v).split(",");
    return { lat: parseFloat(parts[0]), lon: parseFloat(parts[1]) };
  }

  function calcStar() {
    if (!$("dob").value) { say(t("needDate"), true); return; }
    if (!$("tob").value) { say(t("needTime"), true); return; }
    var coords = currentCoords();
    if ($("place").value === "manual" && !coords) { say(t("needCoords"), true); return; }
    var res = window.Nakshatra.compute({
      date: $("dob").value, time: $("tob").value,
      tzOffsetHours: parseFloat($("tz").value),
      lat: coords ? coords.lat : null, lon: coords ? coords.lon : null
    });
    if (res.error) { say(t("calcFailed") + " (" + res.error + ")", true); return; }
    state.star = res;
    say("");
    renderStar();
  }

  function renderStar() {
    var s = state.star, box = $("starBox");
    if (!s) { box.hidden = true; $("clearStarBtn").hidden = true; return; }
    var nName = state.lang === "en" ? s.nakshatra : s.nakshatraHi + " (" + s.nakshatra + ")";
    var html = '<div class="big">' + esc(fill(t("starLine"),
      { n: nName, p: s.pada, r: esc(s.rashi) })) + "</div>";
    html += '<p class="hint" style="margin:8px 0 4px">' + esc(t("sylLabel")) + "</p><div>" +
      '<span class="syl">' + esc(s.syllable) + "</span></div>";
    html += '<p class="hint" style="margin-top:10px">' + esc(s.topocentric
      ? fill(t("parallaxOn"), { d: s.parallaxShift.toFixed(2) })
      : t("parallaxOff")) + "</p>";
    if (s.nearBoundary) html += '<div class="warn">' + esc(t("boundary")) + "</div>";
    box.innerHTML = html;
    box.hidden = false;
    $("clearStarBtn").hidden = false;
  }

  // ---------- status ----------
  function say(msg, isErr) {
    var el = $("status");
    el.textContent = msg || "";
    el.className = "status" + (isErr ? " err" : "");
  }

  // ---------- generate ----------
  function requestBody() {
    var body = {
      count: 8,
      tradition: state.tradition,
      gender: state.gender,
      language: state.lang,
      thoughts: $("thoughts").value.trim(),
      sibling: $("sibling").value.trim(),
      exclude: state.seen.slice(-40)
    };
    if (state.star) {
      body.syllables = [state.star.syllable];
      body.nakshatraName = state.star.nakshatra;
      body.pada = state.star.pada;
    } else if ($("letter").value) {
      body.letter = $("letter").value;
    }
    return body;
  }

  function errorMessage(status, payload) {
    var code = payload && payload.error;
    if (status === 429) return code === "rate_limited" ? t("errRate") : t("errQuota");
    if (code === "not_configured") return t("errConfig");
    if (code === "empty") return t("errNone");
    if (code === "origin_not_allowed") return "This site's address isn't allowed by the backend (ALLOWED_ORIGIN).";
    if (code === "kv_missing") return "The backend has no KV storage bound (NAMES_KV).";
    if (code === "model_unavailable") return "The AI model set on the backend is no longer available.";
    return t("errGeneric");
  }

  async function generate() {
    if (state.busy) return;
    if (!API) { say(t("errConfig"), true); return; }
    state.busy = true;
    $("goBtn").disabled = true; $("moreBtn").disabled = true;
    say(t("thinking"));
    try {
      var res = await fetch(API + "/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody())
      });
      var payload = await res.json().catch(function () { return null; });
      if (!res.ok || !payload || !payload.names || !payload.names.length) {
        say(errorMessage(res.status, payload), true);
        return;
      }
      state.shown = payload.names;
      payload.names.forEach(function (n) {
        if (state.seen.indexOf(n.name) === -1) state.seen.push(n.name);
      });
      say(state.star ? fill(t("usingStar"), { s: "" }) : "");
      $("lblResults").hidden = false;
      $("publicNote").hidden = false;
      $("moreBtn").hidden = false;
      renderResults(payload.names);
      loadCounts(payload.names.map(function (n) { return n.name; }));
    } catch (e) {
      say(t("errGeneric"), true);
    } finally {
      state.busy = false;
      $("goBtn").disabled = false; $("moreBtn").disabled = false;
    }
  }

  // ---------- results ----------
  var counts = {};   // name -> adoptions, as last read from the backend

  function inList(name) {
    return state.list.some(function (x) { return x.name === name; });
  }

  function nameCard(n) {
    var key = n.name;
    var tally = counts[key] || 0;
    var html = '<article class="name" data-name="' + esc(key) + '">';
    html += "<h3>" + esc(key);
    if (n.script) html += ' <span class="dev">' + esc(n.script) + "</span>";
    if (tally >= POPULAR_AT) html += ' <span class="badge">' + esc(t("popular")) + "</span>";
    html += "</h3>";
    var bits = [];
    if (n.pronunciation) bits.push(n.pronunciation);
    if (n.origin) bits.push(n.origin);
    if (n.gender) bits.push(n.gender);
    if (bits.length) html += '<p class="meta">' + esc(bits.join(" · ")) + "</p>";
    if (n.meaning) html += '<p class="meaning">' + esc(n.meaning) + "</p>";
    if (n.pairing) html += '<p class="pair">' + esc(n.pairing) + "</p>";
    html += '<div class="namefoot"><label class="pick"><input type="checkbox" data-pick="' +
      esc(key) + '"' + (inList(key) ? " checked" : "") + "> " + esc(t("pick")) + "</label>";
    html += '<span class="tally" data-tally="' + esc(key) + '">' +
      (tally > 0 ? esc(fill(t("adoptions"), { n: tally })) : "") + "</span></div>";
    return html + "</article>";
  }

  function renderResults(names) {
    $("results").innerHTML = names.map(nameCard).join("");
  }

  function refreshTallies() {
    state.shown.forEach(function (n) {
      var el = document.querySelector('[data-tally="' + cssEsc(n.name) + '"]');
      var c = counts[n.name] || 0;
      if (el) el.textContent = c > 0 ? fill(t("adoptions"), { n: c }) : "";
      var card = document.querySelector('.name[data-name="' + cssEsc(n.name) + '"]');
      if (!card) return;
      var h = card.querySelector("h3");
      var badge = h.querySelector(".badge");
      if (c >= POPULAR_AT && !badge) {
        var b = document.createElement("span");
        b.className = "badge";
        b.textContent = t("popular");
        h.appendChild(b);
      } else if (c < POPULAR_AT && badge) {
        badge.remove();
      }
    });
  }

  function cssEsc(s) { return String(s).replace(/["\\]/g, "\\$&"); }

  async function loadCounts(names) {
    if (!API || !names.length) return;
    try {
      var res = await fetch(API + "/api/counts?names=" + encodeURIComponent(names.join(",")));
      var payload = await res.json();
      if (payload && payload.counts) {
        Object.keys(payload.counts).forEach(function (k) { counts[k] = payload.counts[k]; });
        refreshTallies();
      }
    } catch (e) { /* counts are a nicety, never block the names */ }
  }

  async function sendCount(name, delta) {
    if (!API) return;
    try {
      var res = await fetch(API + "/api/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, delta: delta })
      });
      var payload = await res.json();
      if (payload && typeof payload.count === "number") {
        counts[name] = payload.count;
        refreshTallies();
      }
    } catch (e) { /* ignore */ }
  }

  // ---------- shortlist ----------
  function loadList() {
    try {
      var raw = localStorage.getItem(LIST_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      state.list = Array.isArray(arr) ? arr.filter(function (x) { return x && x.name; }) : [];
    } catch (e) { state.list = []; }
  }
  function saveList() {
    try { localStorage.setItem(LIST_KEY, JSON.stringify(state.list.slice(0, 25))); }
    catch (e) { /* private browsing, etc. — the tray still works for this visit */ }
  }

  function renderTray() {
    var tray = $("tray");
    if (!state.list.length) {
      tray.hidden = true;
      $("shareRow").hidden = true;
      return;
    }
    var names = state.list.map(function (x) { return x.name; });
    setText("trayNames", fill(t("trayCount"), { n: names.length, names: names.join(", ") }));
    setText("shareBtn", t("shareBtn"));
    setText("clearListBtn", t("clearList"));
    tray.hidden = false;
  }

  function togglePick(name, on) {
    var entry = state.shown.filter(function (n) { return n.name === name; })[0] || { name: name };
    if (on && !inList(name)) {
      state.list.push({
        name: entry.name, script: entry.script || "", pronunciation: entry.pronunciation || "",
        origin: entry.origin || "", gender: entry.gender || "", meaning: entry.meaning || ""
      });
      sendCount(name, 1);
    } else if (!on && inList(name)) {
      state.list = state.list.filter(function (x) { return x.name !== name; });
      sendCount(name, -1);
    }
    saveList();
    renderTray();
  }

  async function share() {
    if (!API || !state.list.length) return;
    var btn = $("shareBtn");
    btn.disabled = true;
    setText("shareBtn", t("sharing"));
    try {
      var res = await fetch(API + "/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names: state.list,
          label: "",
          nakshatra: state.star ? state.star.nakshatra + " pada " + state.star.pada : ""
        })
      });
      var payload = await res.json();
      if (!res.ok || !payload || !payload.id) { say(t("shareFail"), true); return; }
      var base = CFG.SITE_URL || (location.origin + location.pathname);
      $("shareLink").value = base.replace(/\?.*$/, "") + "?list=" + payload.id;
      $("shareRow").hidden = false;
      $("shareLink").select();
    } catch (e) {
      say(t("shareFail"), true);
    } finally {
      btn.disabled = false;
      setText("shareBtn", t("shareBtn"));
    }
  }

  function copyLink() {
    var input = $("shareLink");
    input.select();
    var done = function () { setText("copyBtn", t("copied")); setTimeout(function () { setText("copyBtn", t("copyBtn")); }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(done, function () { document.execCommand("copy"); done(); });
    } else {
      document.execCommand("copy");
      done();
    }
  }

  // ---------- opened from a shared link ----------
  async function openSharedList(id) {
    if (!API) return;
    try {
      var res = await fetch(API + "/api/shortlist?id=" + encodeURIComponent(id));
      var payload = await res.json();
      if (!res.ok || !payload || !payload.names || !payload.names.length) return;
      var when = "";
      try { when = new Date(payload.createdAt).toLocaleDateString(state.lang === "en" ? "en-IN" : (state.lang + "-IN")); }
      catch (e) { when = String(payload.createdAt || "").slice(0, 10); }
      setText("sharedMeta", fill(t("sharedMeta"), { n: payload.names.length, d: when }) +
        (payload.nakshatra ? " " + payload.nakshatra : ""));
      $("sharedBanner").hidden = false;
      state.shown = payload.names;
      $("lblResults").hidden = false;
      $("publicNote").hidden = false;
      renderResults(payload.names);
      loadCounts(payload.names.map(function (n) { return n.name; }));
    } catch (e) { /* a dead link just shows the normal form */ }
  }

  function dismissShared() {
    $("sharedBanner").hidden = true;
    $("results").innerHTML = "";
    $("lblResults").hidden = true;
    $("publicNote").hidden = true;
    state.shown = [];
    history.replaceState(null, "", location.pathname);
  }

  // ---------- wiring ----------
  function wire() {
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () { state.lang = b.dataset.lang; applyLanguage(); });
    });
    $("traditionChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-trad]");
      if (!b) return;
      state.tradition = b.dataset.trad;
      renderTraditions();
    });
    $("genderChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-gender]");
      if (!b) return;
      state.gender = b.dataset.gender;
      renderGenders();
    });
    $("nakToggle").addEventListener("click", function () {
      var panel = $("nakPanel"), open = panel.hidden;
      panel.hidden = !open;
      $("nakToggle").setAttribute("aria-expanded", String(open));
      setText("nakToggleLabel", open ? t("nakOpen") : t("nakClosed"));
    });
    $("place").addEventListener("change", function () {
      $("manualCoords").hidden = $("place").value !== "manual";
    });
    $("calcBtn").addEventListener("click", calcStar);
    $("clearStarBtn").addEventListener("click", function () {
      state.star = null;
      renderStar();
      say("");
    });
    $("form").addEventListener("submit", function (e) {
      e.preventDefault();
      state.seen = [];
      generate();
    });
    $("moreBtn").addEventListener("click", generate);
    $("results").addEventListener("change", function (e) {
      var box = e.target.closest("[data-pick]");
      if (!box) return;
      togglePick(box.dataset.pick, box.checked);
    });
    $("shareBtn").addEventListener("click", share);
    $("clearListBtn").addEventListener("click", function () {
      state.list = [];
      saveList();
      renderTray();
      document.querySelectorAll("[data-pick]").forEach(function (b) { b.checked = false; });
    });
    $("copyBtn").addEventListener("click", copyLink);
    $("sharedDismiss").addEventListener("click", dismissShared);
  }

  function init() {
    var params = new URLSearchParams(location.search);
    var lang = params.get("lang");
    if (lang && STR[lang]) state.lang = lang;
    renderTz();
    buildStars();
    loadList();
    applyLanguage();
    wire();
    var listId = params.get("list");
    if (listId) openSharedList(listId.replace(/[^a-z0-9]/gi, "").slice(0, 12));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
