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
      lblLetter: "Starting letter or sound (optional)", anyLetter: "Any letter",
      letterPlaceholder: "A, Sha, म, चु…",
      hintLetter: "A letter, a syllable, or Devanagari — whatever you were given.",
      aboutAsks: "What we need from you",
      aboutGives: "What you get",
      aboutHim: "A pandit",
      aboutUs: "This page",
      useTyped: "Use \u201c{q}\u201d",
      useTypedHint: "not in our list",
      nearbyAsk: "We don't have {q} in our list \u2014 that's fine. Which town or district is it near?",
      nearbyPlaceholder: "Nearest town or district",
      placeApprox: "Coordinates taken from {town}. A few kilometres makes no difference to the result.",
      placeNone: "Keep typing, or tell us the nearest town.",
      hintAsk: "Is {q} near {town}?",
      hintYes: "Yes, that's it",
      hintNo: "No, I'll pick",
      whereIndia: "In India",
      whereWorld: "Outside India",
      lblVillage: "Village, town or city",
      lblPin: "PIN code",
      lblState: "State",
      villagePlaceholder: "e.g. Kombhali",
      pinPlaceholder: "6 digits",
      statePick: "Choose a state",
      pinAsk: "The PIN code pins this down best. If you do not know it, just choose the state.",
      pinOldBirth: "PIN codes only began in 1972, so a birth before then has none. Choose the state, and add the village's PIN today if you know it.",
      pinTyping: "Keep going \u2014 six digits.",
      pinTooLong: "That is more than six digits. A PIN code is exactly six.",
      pinMismatch: "PIN {pin} is not in {chose}. It looks like {expect}. Check whichever of the two is wrong.",
      pinUnknown: "We do not recognise that PIN code. Choose the state instead.",
      pinKnownState: "We know that PIN is in {states}, but not exactly where. The state is enough.",
      pinFrompin: "Located from {from}.",
      pinFromdistrict: "Located from {from}. A few kilometres makes no difference to the result.",
      pinFromstate: "Located from {from} only. Add a PIN code to narrow it, though it rarely changes the answer.",
      famToggle: "Your family — the things a pandit would ask",
      famIntro: "All optional. Give us what you know and we will use it; leave the rest blank.",
      deityPick: "Choose your kula devata",
      deityOther: "Other / not sure",
      communityPick: "Choose a community",
      vedaPick: "Not sure",
      sampradayaPick: "Not sure",
      lblDeity: "Kula devata",
      lblCommunity: "Community",
      lblGotra: "Gotra",
      lblCarry: "Name to carry forward",
      hintCarry: "A grandparent's name your family must keep. We will suggest it, modern forms of it, and names of the same deity.",
      lblFather: "Father's name",
      lblMother: "Mother's name",
      lblEldest: "Is this your first child?",
      hintEldest: "Some traditions only apply the Jyeshtha reading to an eldest child.",
      lblAkshara: "Which starting sound does your family use?",
      aksharaPada: "From the pada",
      aksharaRashi: "From the rashi",
      aksharaEither: "Either is fine",
      eldestYes: "Yes, first",
      eldestNo: "No",
      eldestSkip: "Rather not say",
      lblAvoid: "Names already used, or to avoid",
      hintAvoid: "Separate with commas. We will keep clear of these.",
      lblVeda: "Veda shakha",
      lblSampradaya: "Sampradaya",
      lin_brahmin: "rishi gotra",
      lin_maratha: "Maratha",
      lin_agarwal: "Agarwal",
      lin_oswal: "Oswal / Jain",
      lin_rajput: "Rajput",
      lin_jat: "Jat",
      lin_telugu: "Telugu",
      lin_kannada: "Kannada",
      lin_other: "other",
      lblSub: "Sub-community",
      subPick: "Choose, if you know it",
      hintSub: "This is usually enough — most families' veda shakha and sampradaya follow from it.",
      ritualSummary: "Veda shakha and sampradaya",
      ritualHelp: "These are ritual details your priest recites in the sankalpa. Most people do not know them offhand, and many families do not have a veda shakha at all. Neither one changes a single name — they are here only so the printed sheet is already filled in. Leave them alone if you are unsure. If you want to find out, your family priest knows, and so usually do your grandparents.",
      guessVeda: "Veda shakha set to {v}, from {why}.",
      guessSampradaya: "Sampradaya set to {s}, from {why}.",
      guessConfirm: "Both are our best guess, not a fact. Change either if you know better, or leave them — your priest will correct them in a second.",
      lblSutra: "Sutra",
      sutraPick: "Choose, if you know it",
      hintSutra: "Your priest recites this in the same breath as the gotra. It settles the veda shakha exactly, so if you know it there is no need to guess at the shakha.",
      certainVeda: "Veda shakha is {v}. That follows from the {why} sutra \u2014 each sutra belongs to one Veda, so this is not a guess.",
      vedaConflict: "These disagree: {sub} usually means {a}, but the {sutra} sutra means {b}. One of the two answers is wrong \u2014 your priest will know which.",
      printPatra: "Print this sheet", muhurtaBtn: "Show naming-day options",
      muhurtaTitle: "Days suited to the naming rite",
      muhurtaIntro: "Tradition puts the naming on the eleventh or twelfth day. Where that lands badly, families move it. These are the next few clear days.",
      muhurtaClear: "clear", muhurtaBlocked: "held back by",
      muhurtaTrad: "traditional day",
      lblSibling: "Older sibling's name (optional)",
      hintSibling: "Names will be chosen to sit well beside it.",
      lblThoughts: "Or just say what you're after",
      thoughtsPlaceholder: "something meaning 'radiant', short, easy to say in English",
      nakClosed: "＋ Use the birth star (nakshatra) to pick the starting sound",
      nakOpen: "− Hide birth details",
      lblDob: "Date of birth", lblTob: "Time of birth (local clock)",
      lblPlace: "Place of birth",
      placePlaceholder: "Start typing a town or city",
      placeHint: "The timezone is worked out from the place and the date, including daylight saving and India's older time zones.",
      placeNeedDate: "enter the date to fix the timezone",
      formerly: "formerly", tzAmbiguous: "clocks changed that night — worth checking",
      needPlace: "Choose the place of birth from the list.",
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
    lblLetter: "पहला अक्षर या ध्वनि (वैकल्पिक)", anyLetter: "कोई भी अक्षर",
    letterPlaceholder: "अ, श, म, चु…",
    hintLetter: "अक्षर, ध्वनि, या देवनागरी — जो आपको बताया गया हो।",
    aboutAsks: "हमें क्या चाहिए",
    aboutGives: "आपको क्या मिलेगा",
    aboutHim: "पंडितजी",
    aboutUs: "यह पेज",
    useTyped: "\u201c{q}\u201d \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902",
    useTypedHint: "\u0939\u092e\u093e\u0930\u0940 \u0938\u0942\u091a\u0940 \u092e\u0947\u0902 \u0928\u0939\u0940\u0902",
    nearbyAsk: "{q} \u0939\u092e\u093e\u0930\u0940 \u0938\u0942\u091a\u0940 \u092e\u0947\u0902 \u0928\u0939\u0940\u0902 \u0939\u0948 \u2014 \u0915\u094b\u0908 \u092c\u093e\u0924 \u0928\u0939\u0940\u0902\u0964 \u092f\u0939 \u0915\u093f\u0938 \u0936\u0939\u0930 \u092f\u093e \u091c\u093f\u0932\u0947 \u0915\u0947 \u092a\u093e\u0938 \u0939\u0948?",
    nearbyPlaceholder: "\u0928\u091c\u0926\u0940\u0915\u0940 \u0936\u0939\u0930 \u092f\u093e \u091c\u093f\u0932\u093e",
    placeApprox: "\u0928\u093f\u0930\u094d\u0926\u0947\u0936\u093e\u0902\u0915 {town} \u0938\u0947 \u0932\u093f\u092f\u0947 \u0917\u092f\u0947\u0964 \u0915\u0941\u0921\u093c \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930 \u0938\u0947 \u0928\u0924\u0940\u091c\u0947 \u092e\u0947\u0902 \u0915\u094b\u0908 \u092c\u0926\u0932\u093e\u0935 \u0928\u0939\u0940\u0902 \u0939\u094b\u0924\u093e\u0964",
    placeNone: "\u0932\u093f\u0916\u0924\u0947 \u0930\u0939\u0947\u0902, \u092f\u093e \u0928\u091c\u0926\u0940\u0915\u0940 \u0936\u0939\u0930 \u092c\u0924\u093e\u090f\u0902\u0964",
    hintAsk: "{q} \u0915\u094d\u092f\u093e {town} \u0915\u0947 \u092a\u093e\u0938 \u0939\u0948?",
    hintYes: "\u0939\u093e\u0902, \u0938\u0939\u0940 \u0939\u0948",
    hintNo: "\u0928\u0939\u0940\u0902, \u092e\u0948\u0902 \u091a\u0941\u0928\u0924\u093e \u0939\u0942\u0902",
    whereIndia: "भारत में",
    whereWorld: "भारत के बाहर",
    lblVillage: "गाँव, कस्बा या शहर",
    lblPin: "पिन कोड",
    lblState: "राज्य",
    villagePlaceholder: "जैसे कोंभाळी",
    pinPlaceholder: "6 अंक",
    statePick: "राज्य चुनें",
    pinAsk: "पिन कोड से स्थान सबसे सही तय होता है। पता न हो तो सिर्फ़ राज्य चुनें।",
    pinOldBirth: "पिन कोड 1972 में शुरू हुए, इसलिए उससे पहले के जन्म का पिन नहीं होता। राज्य चुनें, और गाँव का आज का पिन पता हो तो भर दें।",
    pinTyping: "छह अंक भरें।",
    pinTooLong: "यह छह अंकों से ज़्यादा है। पिन कोड ठीक छह अंकों का होता है।",
    pinMismatch: "पिन {pin} {chose} में नहीं है। यह {expect} लगता है। दोनों में से जो गलत है उसे जाँचें।",
    pinUnknown: "यह पिन कोड पहचान में नहीं आया। राज्य चुन लें।",
    pinKnownState: "यह पिन {states} में है, पर ठीक जगह पता नहीं। राज्य पर्याप्त है।",
    pinFrompin: "{from} से स्थान लिया गया।",
    pinFromdistrict: "{from} से स्थान लिया गया। कुछ किलोमीटर से नतीजे में अंतर नहीं पड़ता।",
    pinFromstate: "केवल {from} से स्थान लिया गया। पिन कोड भरने से और सटीक होगा, पर नतीजा प्रायः वही रहता है।",
    famToggle: "आपका परिवार — जो पंडितजी पूछते हैं",
    famIntro: "सब वैकल्पिक। जो पता हो वह बता दें, हम उसका उपयोग करेंगे; बाकी खाली छोड़ दें।",
    deityPick: "अपने कुलदेवता चुनें",
    deityOther: "अन्य / पता नहीं",
    communityPick: "समुदाय चुनें",
    vedaPick: "पता नहीं",
    sampradayaPick: "पता नहीं",
    lblDeity: "कुलदेवता",
    lblCommunity: "समुदाय",
    lblGotra: "गोत्र",
    lblCarry: "आगे बढ़ाने वाला नाम",
    hintCarry: "दादा या नाना का नाम जो परिवार में रखना आवश्यक है। हम वही नाम, उसके आधुनिक रूप, और उसी देवता के नाम सुझाएँगे।",
    lblFather: "पिता का नाम",
    lblMother: "माता का नाम",
    lblEldest: "यह आपका पहला बच्चा है?",
    hintEldest: "कुछ परंपराओं में ज्येष्ठा का विचार केवल पहले बच्चे पर लागू होता है।",
    lblAkshara: "आपका परिवार कौन सी पहली ध्वनि लेता है?",
    aksharaPada: "पाद से",
    aksharaRashi: "राशि से",
    aksharaEither: "कोई भी ठीक",
    eldestYes: "हाँ, पहला",
    eldestNo: "नहीं",
    eldestSkip: "नहीं बताना",
    lblAvoid: "पहले रखे गए, या बचाने वाले नाम",
    hintAvoid: "अल्पविराम से अलग करें। हम इनसे बचेंगे।",
    lblVeda: "वेद शाखा",
    lblSampradaya: "संप्रदाय",
    lin_brahmin: "ऋषि गोत्र",
    lin_maratha: "मराठा",
    lin_agarwal: "अग्रवाल",
    lin_oswal: "ओसवाल / जैन",
    lin_rajput: "राजपूत",
    lin_jat: "जाट",
    lin_telugu: "तेलुगु",
    lin_kannada: "कन्नड",
    lin_other: "अन्य",
    lblSub: "उप-समुदाय",
    subPick: "पता हो तो चुनें",
    hintSub: "यह सामान्यतः पर्याप्त है — अधिकांश परिवारों की वेद शाखा और संप्रदाय इससे निकल आते हैं।",
    ritualSummary: "वेद शाखा और संप्रदाय",
    ritualHelp: "ये वे विवरण हैं जो पंडितजी संकल्प में बोलते हैं। अधिकांश लोगों को ये याद नहीं होते, और कई परिवारों की वेद शाखा होती ही नहीं। इनसे नाम में कोई अंतर नहीं पड़ता — ये केवल इसलिए हैं कि छपा हुआ पत्र पहले से भरा रहे। पता न हो तो छोड़ दें। जानना हो तो पंडितजी को पता होता है, और अक्सर दादा-दादी को भी।",
    guessVeda: "वेद शाखा {v} रखी गई, {why} से।",
    guessSampradaya: "संप्रदाय {s} रखा गया, {why} से।",
    guessConfirm: "दोनों हमारा अनुमान हैं, तथ्य नहीं। सही पता हो तो बदल दें, या छोड़ दें — पंडितजी एक क्षण में सुधार लेंगे।",
    lblSutra: "सूत्र",
    sutraPick: "पता हो तो चुनें",
    hintSutra: "पंडितजी इसे गोत्र के साथ ही बोलते हैं। इससे वेद शाखा ठीक-ठीक निकल आती है, इसलिए यह पता हो तो शाखा का अनुमान लगाने की आवश्यकता नहीं।",
    certainVeda: "वेद शाखा {v} है। यह {why} सूत्र से निकलती है — हर सूत्र एक ही वेद का होता है, इसलिए यह अनुमान नहीं है।",
    vedaConflict: "ये मेल नहीं खाते: {sub} का अर्थ सामान्यतः {a} होता है, पर {sutra} सूत्र का अर्थ {b} है। दोनों में से एक उत्तर गलत है — पंडितजी बता सकेंगे कौन सा।",
    printPatra: "यह पत्र प्रिंट करें", muhurtaBtn: "नामकरण के दिन देखें",
    muhurtaTitle: "नामकरण के लिए उपयुक्त दिन",
    muhurtaIntro: "परंपरा में नामकरण ग्यारहवें या बारहवें दिन होता है। यदि वह दिन उपयुक्त न हो तो आगे बढ़ाया जाता है। ये अगले शुभ दिन हैं।",
    muhurtaClear: "शुभ", muhurtaBlocked: "बाधा",
    muhurtaTrad: "पारंपरिक दिन",
    lblSibling: "बड़े भाई/बहन का नाम (वैकल्पिक)",
    hintSibling: "नाम उसके साथ मेल खाते हुए चुने जाएंगे।",
    lblThoughts: "या अपने मन की बात लिखें",
    thoughtsPlaceholder: "‘तेजस्वी’ अर्थ वाला, छोटा, बोलने में आसान",
    nakClosed: "＋ जन्म नक्षत्र से पहला अक्षर तय करें",
    nakOpen: "− जन्म विवरण छिपाएं",
    lblDob: "जन्म तिथि", lblTob: "जन्म समय (स्थानीय घड़ी)",
    lblPlace: "जन्म स्थान",
    placePlaceholder: "शहर या गाँव लिखना शुरू करें",
    placeHint: "टाइमज़ोन जन्म स्थान और तिथि से निकाला जाता है — डेलाइट सेविंग और भारत के पुराने समय सहित।",
    placeNeedDate: "टाइमज़ोन के लिए तिथि भरें",
    formerly: "पूर्व नाम", tzAmbiguous: "उस रात घड़ी बदली थी — जाँच लें",
    needPlace: "सूची से जन्म स्थान चुनें।",
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
    lblLetter: "पहिले अक्षर किंवा ध्वनी (ऐच्छिक)", anyLetter: "कोणतेही अक्षर",
    letterPlaceholder: "अ, श, म, चु…",
    hintLetter: "अक्षर, ध्वनी, किंवा देवनागरी — जे तुम्हाला सांगितले असेल.",
    aboutAsks: "आम्हाला काय हवे",
    aboutGives: "तुम्हाला काय मिळेल",
    aboutHim: "गुरुजी",
    aboutUs: "हे पेज",
    useTyped: "\u201c{q}\u201d \u0935\u093e\u092a\u0930\u093e",
    useTypedHint: "\u0906\u092e\u091a\u094d\u092f\u093e \u092f\u093e\u0926\u0940\u0924 \u0928\u093e\u0939\u0940",
    nearbyAsk: "{q} \u0906\u092e\u091a\u094d\u092f\u093e \u092f\u093e\u0926\u0940\u0924 \u0928\u093e\u0939\u0940 \u2014 \u0939\u0930\u0915\u0924 \u0928\u093e\u0939\u0940. \u0939\u0947 \u0915\u094b\u0928\u0924\u094d\u092f\u093e \u0936\u0939\u0930\u093e\u091c\u0935\u0933 \u0915\u093f\u0902\u0935\u093e \u091c\u093f\u0932\u094d\u0939\u094d\u092f\u093e\u0924 \u0906\u0939\u0947?",
    nearbyPlaceholder: "\u091c\u0935\u0933\u091c\u0935\u0933\u091a\u0947 \u0936\u0939\u0930 \u0915\u093f\u0902\u0935\u093e \u091c\u093f\u0932\u094d\u0939\u093e",
    placeApprox: "\u0928\u093f\u0930\u094d\u0926\u0947\u0936\u093e\u0902\u0915 {town} \u092f\u0947\u0925\u0942\u0928 \u0918\u0947\u0924\u0932\u0947. \u0915\u093e\u0939\u0940 \u0915\u093f\u0932\u094b\u092e\u0940\u091f\u0930\u0928\u0947 \u0928\u093f\u0915\u093e\u0932\u093e\u0924 \u092c\u0926\u0932 \u0939\u094b\u0924 \u0928\u093e\u0939\u0940.",
    placeNone: "\u0932\u093f\u0939\u0940\u0924 \u0930\u093e\u0939\u093e, \u0915\u093f\u0902\u0935\u093e \u091c\u0935\u0933\u091a\u0947 \u0936\u0939\u0930 \u0938\u093e\u0902\u0917\u093e.",
    hintAsk: "{q} {town} \u091c\u0935\u0933 \u0906\u0939\u0947 \u0915\u093e?",
    hintYes: "\u0939\u094b\u092f, \u092c\u0930\u094b\u092c\u0930",
    hintNo: "\u0928\u093e\u0939\u0940, \u092e\u0940 \u0928\u093f\u0935\u0921\u0924\u094b",
    whereIndia: "भारतात",
    whereWorld: "भारताबाहेर",
    lblVillage: "गाव, तालुका किंवा शहर",
    lblPin: "पिन कोड",
    lblState: "राज्य",
    villagePlaceholder: "उदा. कोंभाळी",
    pinPlaceholder: "6 अंक",
    statePick: "राज्य निवडा",
    pinAsk: "पिन कोडमुळे ठिकाण सर्वात नेमके ठरते. माहीत नसेल तर फक्त राज्य निवडा.",
    pinOldBirth: "पिन कोड 1972 मध्ये सुरू झाले, त्यामुळे त्याआधीच्या जन्माला पिन नाही. राज्य निवडा, आणि गावाचा आजचा पिन माहीत असेल तर भरा.",
    pinTyping: "सहा अंक भरा.",
    pinTooLong: "हे सहा अंकांपेक्षा जास्त आहे. पिन कोड बरोबर सहा अंकांचा असतो.",
    pinMismatch: "पिन {pin} {chose} मध्ये नाही. तो {expect} वाटतो. दोघांपैकी जे चुकले आहे ते तपासा.",
    pinUnknown: "हा पिन कोड ओळखता आला नाही. राज्य निवडा.",
    pinKnownState: "हा पिन {states} मध्ये आहे, पण नेमके ठिकाण माहीत नाही. राज्य पुरेसे आहे.",
    pinFrompin: "{from} वरून ठिकाण घेतले.",
    pinFromdistrict: "{from} वरून ठिकाण घेतले. काही किलोमीटरने निकालात बदल होत नाही.",
    pinFromstate: "फक्त {from} वरून ठिकाण घेतले. पिन कोड भरल्यास अधिक नेमके होईल, पण निकाल बहुतेक तोच राहतो.",
    famToggle: "तुमचे कुटुंब — गुरुजी जे विचारतात",
    famIntro: "सर्व ऐच्छिक. जे माहीत असेल ते सांगा, आम्ही ते वापरू; बाकी रिकामे ठेवा.",
    deityPick: "तुमचे कुलदैवत निवडा",
    deityOther: "इतर / माहीत नाही",
    communityPick: "समाज निवडा",
    vedaPick: "माहीत नाही",
    sampradayaPick: "माहीत नाही",
    lblDeity: "कुलदैवत",
    lblCommunity: "समाज",
    lblGotra: "गोत्र",
    lblCarry: "पुढे न्यायचे नाव",
    hintCarry: "आजोबांचे नाव जे कुटुंबात ठेवायचे आहे. आम्ही तेच नाव, त्याची आधुनिक रूपे, आणि त्याच देवतेची नावे सुचवू.",
    lblFather: "वडिलांचे नाव",
    lblMother: "आईचे नाव",
    lblEldest: "हे तुमचे पहिले बाळ आहे?",
    hintEldest: "काही परंपरांत ज्येष्ठाचा विचार केवळ पहिल्या बाळाला लागू होतो.",
    lblAkshara: "तुमचे कुटुंब कोणती पहिली ध्वनी घेते?",
    aksharaPada: "पादावरून",
    aksharaRashi: "राशीवरून",
    aksharaEither: "कोणतीही चालेल",
    eldestYes: "हो, पहिले",
    eldestNo: "नाही",
    eldestSkip: "सांगायचे नाही",
    lblAvoid: "आधी ठेवलेली, किंवा टाळायची नावे",
    hintAvoid: "स्वल्पविरामाने वेगळी करा. आम्ही ती टाळू.",
    lblVeda: "वेद शाखा",
    lblSampradaya: "संप्रदाय",
    lin_brahmin: "ऋषी गोत्र",
    lin_maratha: "मराठा",
    lin_agarwal: "अग्रवाल",
    lin_oswal: "ओसवाल / जैन",
    lin_rajput: "राजपूत",
    lin_jat: "जाट",
    lin_telugu: "तेलुगू",
    lin_kannada: "कन्नड",
    lin_other: "इतर",
    lblSub: "उप-समाज",
    subPick: "माहीत असेल तर निवडा",
    hintSub: "हे सामान्यतः पुरेसे आहे — बहुतेक कुटुंबांची वेद शाखा आणि संप्रदाय यावरून निघतात.",
    ritualSummary: "वेद शाखा आणि संप्रदाय",
    ritualHelp: "हे तपशील गुरुजी संकल्पात म्हणतात. बहुतेक लोकांना ते लक्षात नसतात, आणि अनेक कुटुंबांची वेद शाखा असतच नाही. यांमुळे नावात काहीही फरक पडत नाही — ते केवळ छापलेले पत्र आधीच भरलेले असावे यासाठी आहेत. माहीत नसेल तर सोडून द्या. जाणून घ्यायचे असेल तर गुरुजींना माहीत असते, आणि बरेचदा आजी-आजोबांनाही.",
    guessVeda: "वेद शाखा {v} ठेवली, {why} वरून.",
    guessSampradaya: "संप्रदाय {s} ठेवला, {why} वरून.",
    guessConfirm: "दोन्ही आमचा अंदाज आहेत, तथ्य नाही. नेमके माहीत असेल तर बदला, किंवा सोडा — गुरुजी क्षणात दुरुस्त करतील.",
    lblSutra: "सूत्र",
    sutraPick: "माहीत असेल तर निवडा",
    hintSutra: "गुरुजी हे गोत्रासोबतच म्हणतात. यावरून वेद शाखा नेमकी निघते, म्हणून हे माहीत असेल तर शाखेचा अंदाज लावायची गरज नाही.",
    certainVeda: "वेद शाखा {v} आहे. ती {why} सूत्रावरून निघते — प्रत्येक सूत्र एकाच वेदाचे असते, म्हणून हा अंदाज नाही.",
    vedaConflict: "हे जुळत नाहीत: {sub} चा अर्थ सामान्यतः {a} होतो, पण {sutra} सूत्राचा अर्थ {b} आहे. दोघांपैकी एक उत्तर चुकीचे आहे — गुरुजी सांगू शकतील कोणते.",
    printPatra: "हे पत्र छापा", muhurtaBtn: "नामकरणाचे दिवस पहा",
    muhurtaTitle: "नामकरणासाठी योग्य दिवस",
    muhurtaIntro: "परंपरेने नामकरण अकराव्या किंवा बाराव्या दिवशी होते. तो दिवस योग्य नसेल तर पुढे ढकलले जाते. हे पुढील शुभ दिवस आहेत.",
    muhurtaClear: "शुभ", muhurtaBlocked: "अडथळा",
    muhurtaTrad: "पारंपरिक दिवस",
    lblSibling: "मोठ्या भावंडाचे नाव (ऐच्छिक)",
    hintSibling: "त्याच्यासोबत शोभणारी नावे निवडली जातील.",
    lblThoughts: "किंवा तुमच्या मनातले लिहा",
    thoughtsPlaceholder: "‘तेजस्वी’ अर्थाचे, लहान, म्हणायला सोपे",
    nakClosed: "＋ जन्म नक्षत्रावरून पहिले अक्षर ठरवा",
    nakOpen: "− जन्म तपशील लपवा",
    lblDob: "जन्म तारीख", lblTob: "जन्म वेळ (स्थानिक घड्याळ)",
    lblPlace: "जन्मस्थान",
    placePlaceholder: "शहर किंवा गाव लिहायला सुरुवात करा",
    placeHint: "टाइमझोन जन्मस्थान आणि तारखेवरून काढला जातो — डेलाइट सेव्हिंग आणि भारताच्या जुन्या वेळांसह.",
    placeNeedDate: "टाइमझोनसाठी तारीख भरा",
    formerly: "पूर्वीचे", tzAmbiguous: "त्या रात्री घड्याळ बदलले होते — तपासा",
    needPlace: "यादीतून जन्मस्थान निवडा.",
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

  /* The tradition list, its labels and what each one actually computes all live in
   * traditions.js now, so adding a tradition is one entry in one file. */
  var TR = window.Traditions;

  /* The city list and the timezone table used to live here. They are gone.
   * places.js holds the places, and the offset is derived from the place plus
   * the date, so the family is never asked to choose between standard and
   * daylight time -- a wrong pick there is a one-hour error, which is 16.5% of
   * a pada, far worse than any plausible imprecision in the coordinates. */
  var PL = window.Places;
  var PIN = window.Pincode;
  var FM = window.Family;

  var state = {
    lang: "en",
    tradition: "Hindu",
    gender: "any",
    star: null,        // result from Nakshatra.compute
    seen: [],          // names already shown, so "more like this" doesn't repeat
    shown: [],         // current batch
    list: [],          // shortlist
    family: { deity: "", community: "", gotra: "", carryName: "", fatherName: "",
      motherName: "", avoidNames: "", subcommunity: "", sutra: "",
      vedaShakha: "", sampradaya: "",
      vedaTouched: false, sampradayaTouched: false,
      eldest: "", aksharaSource: "pada" },
    panchang: null,    // full reading, when the tradition uses one
    place: null,       // resolved place: name, lat, lon, tz
    typed: "",         // exactly what was typed, kept even when unlisted
    hint: null,        // a backend guess at the nearest town, pending confirmation
    where: "IN",       // which place path is showing
    sky: null,         // the canvas behind everything
    familyScope: "full",  // how much of the family panel this tradition uses
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

  /* The old header dot strip is gone. sky.js draws the real rashi chakra behind
   * the whole page, with the 27 nakshatras at their true longitudes. */

  // ---------- chips, selects ----------
  function renderTraditions() {
    var box = $("traditionChips");
    box.innerHTML = TR.TRADITIONS.map(function (tr) {
      return '<button type="button" class="chip" data-trad="' + esc(tr.id) + '" aria-pressed="' +
        (state.tradition === tr.id) + '">' + esc(TR.labelFor(tr, state.lang)) + "</button>";
    }).join("");
    applyTradition();
  }

  /* The router. Each tradition asks its own question, or none. Showing a nakshatra
   * panel to a Christian family, or telling a Muslim family their name should start
   * with a pada syllable, was the thing most worth fixing here. */
  function applyTradition() {
    var tr = TR.byId(state.tradition);
    applyFamilyScope(tr);
    setText("hintTradition", TR.blurbFor(tr, state.lang));

    var wantsBirth = tr.askBirth;
    $("nakToggle").hidden = !wantsBirth;
    if (!wantsBirth) {
      $("nakPanel").hidden = true;
      $("nakToggle").setAttribute("aria-expanded", "false");
    }
    // the nakshatra panel only means anything for the panchang engine
    $("nakIntro").textContent = tr.engine === "hijri"
      ? "The Hijri date of birth and the aqiqah day are worked out from the date. " +
        "Time and place are not needed for that, so leave them blank if you like."
      : t("nakIntro");
    $("calcBtn").hidden = tr.engine !== "panchang" && tr.engine !== "hijri";

    // Sikh families already hold the letter; relabel rather than pretend to derive it
    setText("lblLetter", TR.letterLabelFor(tr, state.lang) || t("lblLetter"));
    $("hintLetter").textContent = tr.engine === "given"
      ? "Enter the letter your family received at the Gurdwara."
      : t("hintLetter");

    if (state.star && tr.engine !== "panchang") { state.star = null; renderStar(); }
    clearPatra();
    renderAbout();
  }
  function renderGenders() {
    var box = $("genderChips");
    var opts = [["any", t("genderAny")], ["boy", t("genderBoy")], ["girl", t("genderGirl")]];
    box.innerHTML = opts.map(function (o) {
      return '<button type="button" class="chip" data-gender="' + o[0] + '" aria-pressed="' +
        (state.gender === o[0]) + '">' + esc(o[1]) + "</button>";
    }).join("");
  }
  /* The letter is typed now, not picked, so it arrives as anything from "a" to
   * "SHA" to Devanagari. Trim it, drop stray punctuation, and title-case Latin
   * so "chu" and "CHU" reach the backend as the same request. Devanagari and
   * other scripts are passed through untouched. */
  function normaliseLetter(raw) {
    var v = String(raw || "").trim().replace(/[^\p{L}\p{M}]/gu, "");
    if (!v) return "";
    if (/^[a-z]+$/i.test(v)) v = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
    return v.slice(0, 8);
  }
  /* ---------- place autocomplete ----------
   * One field instead of four. The chosen place carries its coordinates and its
   * IANA zone, and the offset is resolved against the date of birth, so wartime
   * India (+6:30 in 1943-44) and every daylight-saving rule come out right
   * without the family knowing any of it. */
  /* Two autocompletes share this code: the birthplace field, and the "nearest
   * town" field that appears when the birthplace is not one we hold.
   *
   * The birthplace field never refuses input. Whatever is typed is kept as the
   * record of where the child was born; only the coordinates have to come from
   * somewhere we recognise. The list therefore always carries a final row that
   * accepts the typed text as-is, so a family from a village is never cornered
   * into picking a town they were not born in. */
  var AC = {
    place:  { items: [], index: -1, input: "place",  list: "placeList"  },
    nearby: { items: [], index: -1, input: "nearby", list: "nearbyList" }
  };

  function acClose(which) {
    var a = AC[which];
    $(a.list).hidden = true;
    $(a.input).setAttribute("aria-expanded", "false");
    a.index = -1;
  }
  function acCloseAll() { acClose("place"); acClose("nearby"); }

  function acRender(which) {
    var a = AC[which], ul = $(a.list), q = $(a.input).value.trim();
    var rows = a.items.map(function (p, i) {
      if (p.__typed) {
        return '<li role="option" class="use-typed" id="' + which + 'opt' + i +
          '" data-i="' + i + '" aria-selected="' + (i === a.index) + '"><span>' +
          esc(fill(t("useTyped"), { q: p.name })) + '</span><span class="where">' +
          esc(t("useTypedHint")) + "</span></li>";
      }
      return '<li role="option" id="' + which + "opt" + i + '" data-i="' + i +
        '" aria-selected="' + (i === a.index) + '"><span>' + esc(p.name) +
        (p.formerly ? ' <span class="old">' + esc(t("formerly")) + " " + esc(p.formerly) + "</span>" : "") +
        '</span><span class="where">' + esc(p.region) + "</span></li>";
    });
    if (!rows.length) {
      ul.innerHTML = '<li class="ac-none" role="presentation">' + esc(t("placeNone")) + "</li>";
    } else {
      ul.innerHTML = rows.join("");
    }
    ul.hidden = false;
    $(a.input).setAttribute("aria-expanded", "true");
  }

  function acSearch(which) {
    var a = AC[which], q = $(a.input).value.trim();
    if (which === "place") { state.place = null; state.typed = q; }
    if (q.length < 2) { acClose(which); renderPlaceMeta(); return; }
    a.index = -1;
    a.items = PL.search(q, which === "place" ? 7 : 8);
    // the birthplace field always offers the typed text as a real choice
    if (which === "place" && !PL.isKnown(q)) a.items.push({ __typed: true, name: q, region: "" });
    acRender(which);
    renderPlaceMeta();
  }

  function acChoose(which, i) {
    var p = AC[which].items[i];
    if (!p) return;
    if (which === "place") {
      if (p.__typed) {
        // keep the typed name, then ask where to take the coordinates from
        state.place = null;
        state.typed = p.name;
        acClose("place");
        openNearby(p.name);
        renderPlaceMeta();
        return;
      }
      state.place = p;
      state.typed = "";
      $("place").value = PL.label(p);
      closeNearby();
      acClose("place");
    } else {
      // resolving a free-typed birthplace against a town nearby
      state.place = PL.freePlace(state.typed || $("place").value, p);
      $("nearby").value = PL.label(p);
      acClose("nearby");
    }
    renderPlaceMeta();
  }

  /* Asks the backend which district a village sits in, then throws away
   * everything except the town name and looks the numbers up locally.
   *
   * Deliberately non-blocking. The manual field opens immediately, so a family
   * is never waiting on an API call, and the hint just pre-fills it when it
   * arrives. If the backend is rate limited, down, slow, or answers with a town
   * we do not hold, nothing breaks: the manual path was already there. */
  var hintSeq = 0;

  async function askPlaceHint(typedName) {
    if (!API) return;
    var seq = ++hintSeq;
    try {
      var res = await fetch(API + "/api/place-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place: typedName })   // the date and time are not sent
      });
      if (!res.ok) return;
      var payload = await res.json().catch(function () { return null; });
      if (!payload || seq !== hintSeq) return;       // a newer edit superseded this
      if (state.place || $("nearbyWrap").hidden) return;

      var town = PL.validateHint(payload.town, payload.region);
      if (!town) return;                             // unknown or contradictory, so ignore it

      state.hint = town;
      $("nearby").value = PL.label(town);
      $("hintConfirm").innerHTML =
        esc(fill(t("hintAsk"), { q: typedName, town: PL.label(town) })) +
        ' <button type="button" class="btn ghost small" id="hintYes">' + esc(t("hintYes")) +
        '</button> <button type="button" class="btn ghost small" id="hintNo">' + esc(t("hintNo")) +
        "</button>";
      $("hintConfirm").hidden = false;
      $("hintYes").addEventListener("click", function () {
        state.place = PL.freePlace(state.typed || $("place").value, town);
        $("hintConfirm").hidden = true;
        renderPlaceMeta();
      });
      $("hintNo").addEventListener("click", function () {
        state.hint = null;
        $("nearby").value = "";
        $("hintConfirm").hidden = true;
        $("nearby").focus();
      });
    } catch (e) { /* a hint is a convenience, never a dependency */ }
  }

  /* ---------- the India path: village name, PIN code, state ----------
   *
   * The PIN is the strongest thing a family can give us, because a valid Indian
   * PIN cannot land in the wrong country. That closes off the only error worth
   * fearing: a wrong timezone shifts a pada for one birth in six, a wrong
   * country for all of them, while being 50 km out shifts one in a thousand.
   *
   * It is asked for, never required. PIN codes began on 15 August 1972, so a
   * grandparent's birth has none, and the state alone is a perfectly workable
   * answer for them. The village name is free text throughout and is only ever
   * the record of birthplace, never a lookup key. */
  function renderWhere() {
    var opts = [["IN", t("whereIndia")], ["XX", t("whereWorld")]];
    $("whereChips").innerHTML = opts.map(function (o) {
      return '<button type="button" class="chip" data-where="' + o[0] + '" aria-pressed="' +
        (state.where === o[0]) + '">' + esc(o[1]) + "</button>";
    }).join("");
    $("indiaPath").hidden = state.where !== "IN";
    $("worldPath").hidden = state.where === "IN";
    state.place = null;
    if (state.where === "IN") resolveIndia(); else renderPlaceMeta();
  }

  function renderStates() {
    var sel = $("stateSel"), keep = sel.value;
    sel.innerHTML = '<option value="">' + esc(t("statePick")) + "</option>" +
      PL.indianRegions().map(function (r) {
        return '<option value="' + esc(r) + '">' + esc(r) + "</option>";
      }).join("");
    sel.value = keep;
  }

  function resolveIndia() {
    var raw = $("pin").value;
    var pinDigits = String(raw).replace(/\D/g, "");
    var village = $("village").value.trim();
    var chosenState = $("stateSel").value;
    var el = $("pinMeta");
    $("pin").classList.remove("pinbad");
    state.place = null;

    // ---- a PIN that is the right shape
    if (PIN.looksValid(raw)) {
      var r = PIN.resolve(raw, function (name) {
        var hit = PL.search(name, 1);
        return hit.length ? hit[0] : null;
      });
      if (!r.error && r.lat != null) {
        var agree = chosenState ? PIN.agreesWithState(raw, chosenState) : null;
        if (agree && !agree.ok) {
          /* Two independent inputs disagreeing is almost always a typo in one of
           * them. Saying so is worth more than any amount of precision. */
          $("pin").classList.add("pinbad");
          el.className = "pinwarn";
          el.innerHTML = esc(fill(t("pinMismatch"),
            { pin: r.pin, chose: chosenState, expect: agree.expected.join(" / ") }));
          return;
        }
        if (!chosenState) { $("stateSel").value = r.region; }
        state.place = {
          name: village || (r.district ? r.district : r.region),
          region: r.region, country: "IN", tz: r.tz,
          lat: r.lat, lon: r.lon,
          exact: r.precision === "pin",
          nearbyLabel: r.precision === "pin"
            ? "PIN " + r.pin
            : r.district + " (PIN " + r.pin.slice(0, 3) + "xxx)"
        };
        showResolved(el, r.precision);
        return;
      }
      if (r.precision === "state-only" && r.states) {
        el.className = "pinok";
        el.innerHTML = esc(fill(t("pinKnownState"), { states: r.states.join(" / ") }));
        if (!chosenState) $("stateSel").value = r.states[0];
        chosenState = $("stateSel").value;
      } else if (r.error === "unknown") {
        el.className = "pinok";
        el.textContent = t("pinUnknown");
      }
    } else if (pinDigits.length > 0 && pinDigits.length < 6) {
      el.className = "hint";
      el.textContent = t("pinTyping");
      return;
    } else if (pinDigits.length > 6) {
      $("pin").classList.add("pinbad");
      el.className = "pinwarn";
      el.textContent = t("pinTooLong");
      return;
    }

    // ---- no usable PIN, so fall back to the state
    if (chosenState) {
      var a = PL.regionAnchor(chosenState);
      if (a) {
        state.place = {
          name: village || chosenState, region: chosenState, country: "IN",
          tz: a.tz, lat: a.lat, lon: a.lon, exact: false,
          nearbyLabel: chosenState
        };
        showResolved(el, "state");
        return;
      }
    }
    el.className = "hint";
    el.textContent = PIN.existedAt($("dob").value) ? t("pinAsk") : t("pinOldBirth");
  }

  function showResolved(el, precision) {
    var p = state.place;
    var off = PL.offsetFor(p.tz, $("dob").value, $("tob").value);
    el.className = "pinok";
    el.innerHTML = "<strong>" + esc(p.name) + "</strong> \u2014 " +
      esc(Math.abs(p.lat).toFixed(2) + "\u00b0" + (p.lat >= 0 ? "N" : "S") + ", " +
        Math.abs(p.lon).toFixed(2) + "\u00b0" + (p.lon >= 0 ? "E" : "W") +
        (off ? "  \u00b7  " + PL.formatOffset(off.hours) : "")) +
      '<span class="approx">' + esc(fill(t("pinFrom" + precision), { from: p.nearbyLabel })) +
      "</span>";
  }

  function openNearby(typedName) {
    $("nearbyAsk").innerHTML = fill(esc(t("nearbyAsk")), { q: "<b>" + esc(typedName) + "</b>" });
    $("nearby").placeholder = t("nearbyPlaceholder");
    $("nearbyWrap").hidden = false;
    $("hintConfirm").hidden = true;
    $("nearby").focus();
    askPlaceHint(typedName);
  }
  function closeNearby() {
    $("nearbyWrap").hidden = true;
    $("hintConfirm").hidden = true;
    state.hint = null;
    $("nearby").value = "";
    AC.nearby.items = [];
    acClose("nearby");
  }

  /* Says what was worked out, so a family can check it rather than trust it.
   * When the coordinates were borrowed from a nearby town, that is stated along
   * with the reason it does not matter. */
  function renderPlaceMeta() {
    var el = $("placeMeta"), p = state.place;
    if (!p) { el.className = "hint"; el.textContent = t("placeHint"); return; }
    var off = PL.offsetFor(p.tz, $("dob").value, $("tob").value);
    var bits = [Math.abs(p.lat).toFixed(2) + "\u00b0" + (p.lat >= 0 ? "N" : "S") +
      ", " + Math.abs(p.lon).toFixed(2) + "\u00b0" + (p.lon >= 0 ? "E" : "W")];
    if (off) bits.push(PL.formatOffset(off.hours) + " \u00b7 " + p.tz);
    else bits.push(t("placeNeedDate"));
    el.className = "placefix";
    el.innerHTML = "<strong>" + esc(p.name) + "</strong> \u2014 " + esc(bits.join("  \u00b7  ")) +
      (off && off.ambiguous ? ' <span class="old">' + esc(t("tzAmbiguous")) + "</span>" : "") +
      (p.exact === false
        ? '<span class="approx">' + esc(fill(t("placeApprox"), { town: p.nearbyLabel })) + "</span>"
        : "");
  }

  // ---------- language ----------
  function applyLanguage() {
    document.documentElement.lang = state.lang;
    setText("tagline", t("tagline"));
    setText("lblTradition", t("lblTradition"));
    setText("hintTradition", t("hintTradition"));
    setText("lblGender", t("lblGender"));
    setText("lblLetter", t("lblLetter"));
    setText("hintLetter", t("hintLetter"));
    $("letter").placeholder = t("letterPlaceholder");
    setText("printPatra", t("printPatra"));
    setText("muhurtaBtn", t("muhurtaBtn"));
    setText("lblSibling", t("lblSibling"));
    setText("hintSibling", t("hintSibling"));
    setText("lblThoughts", t("lblThoughts"));
    setText("lblDob", t("lblDob"));
    setText("lblTob", t("lblTob"));
    setText("lblPlace", t("lblPlace"));
    $("place").placeholder = t("placePlaceholder");
    $("nearby").placeholder = t("nearbyPlaceholder");
    $("village").placeholder = t("villagePlaceholder");
    $("pin").placeholder = t("pinPlaceholder");
    setText("lblVillage", t("lblVillage"));
    setText("famToggleLabel", ($("famPanel").hidden ? "\uFF0B " : "\u2212 ") + t("famToggle"));
    setText("famIntro", t("famIntro"));
    setText("lblDeity", t("lblDeity"));
    setText("lblCommunity", t("lblCommunity"));
    setText("lblGotra", FM ? FM.lineageTerm(state.family.community) : t("lblGotra"));
    setText("lblCarry", t("lblCarry"));
    setText("hintCarry", t("hintCarry"));
    setText("lblFather", t("lblFather"));
    setText("lblMother", t("lblMother"));
    setText("lblEldest", t("lblEldest"));
    setText("hintEldest", t("hintEldest"));
    setText("lblAkshara", t("lblAkshara"));
    setText("lblAvoid", t("lblAvoid"));
    setText("hintAvoid", t("hintAvoid"));
    setText("lblVeda", t("lblVeda"));
    setText("lblSampradaya", t("lblSampradaya"));
    setText("lblSub", t("lblSub"));
    setText("hintSub", t("hintSub"));
    setText("ritualSummary", t("ritualSummary"));
    setText("ritualHelp", t("ritualHelp"));
    setText("lblSutra", t("lblSutra"));
    setText("hintSutra", t("hintSutra"));
    setText("lblPin", t("lblPin"));
    setText("lblState", t("lblState"));
    renderStates();
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
    renderTraditions(); renderGenders(); renderWhere(); renderStates(); renderFamily();
    renderAbout();
    if (state.star) renderStar();
    if (state.shown.length) renderResults(state.shown);
    renderTray();
  }

  // ---------- nakshatra ----------
  function currentCoords() {
    return state.place ? { lat: state.place.lat, lon: state.place.lon } : null;
  }
  /* The sheet records where the child was born, and notes separately where the
   * numbers came from when those differ. */
  function placeNameForSheet() {
    var p = state.place;
    if (!p) return "";
    if (p.exact === false) return p.name + " (near " + p.nearbyLabel + ")";
    return PL.label(p);
  }
  function currentOffset() {
    if (!state.place) return null;
    var o = PL.offsetFor(state.place.tz, $("dob").value, $("tob").value);
    return o ? o.hours : null;
  }

  function calcStar() {
    if (!$("dob").value) { say(t("needDate"), true); return; }

    /* The Hijri date and the aqiqah days follow from the date of birth alone.
     * This function used to demand a time and a place before doing anything,
     * so a Muslim family who entered only a date -- which is all we ask them
     * for -- was told to choose a birthplace and could not get past it. The
     * fields it was insisting on are ones this path never reads. */
    if (TR.byId(state.tradition).engine === "hijri") {
      state.star = null;
      say("");
      renderStar();
      renderPatra(null);
      return;
    }

    if (state.where === "IN") resolveIndia();
    if (!$("tob").value) { say(t("needTime"), true); return; }
    var coords = currentCoords();
    if (!coords) { say(t("needPlace"), true); $("place").focus(); return; }
    var tzOff = currentOffset();
    if (tzOff == null) { say(t("needPlace"), true); return; }
    var res = window.Nakshatra.compute({
      date: $("dob").value, time: $("tob").value,
      tzOffsetHours: tzOff, lat: coords.lat, lon: coords.lon
    });
    if (res.error) { say(t("calcFailed") + " (" + res.error + ")", true); return; }
    state.star = res;
    say("");
    renderStar();
    renderPatra(coords);
    skyShow(res);
  }

  /* ---------- your family ----------
   * Everything optional. A family in a city may not know their gotra, and a
   * form that insists turns them away. But when it is given it is used: the
   * kula devata produces the devata-nama, which is the row of the traditional
   * set that used to read "we cannot know". */
  /* Shows only as much of the family panel as the tradition actually uses,
   * and hides it outright otherwise. A Christian or Muslim family should never
   * be asked for a kula devata, and nothing the panel holds should reach the
   * sheet or the generator for them. */
  function applyFamilyScope(tr) {
    var scope = TR.familyScope(tr);
    state.familyScope = scope;
    $("famToggle").hidden = scope === "none";
    if (scope === "none") {
      $("famPanel").hidden = true;
      $("famToggle").setAttribute("aria-expanded", "false");
    }
    /* Sutra and veda shakha are Vedic. They do not belong on a Jain or
     * Buddhist form even though the nakshatra reckoning does. */
    $("ritualDetails").hidden = scope !== "full";
    $("subWrap").hidden = scope !== "full" ||
      !(FM && FM.subcommunities(state.family.community).length);
  }

  /* The family answers, or nothing at all when the tradition does not use
   * them. Everything downstream -- the sheet, the sankalpa, the shanti block,
   * the constraints sent to the generator -- reads this, so returning null is
   * what keeps a Hindu question out of a Christian result. */
  function familyIfUsed() {
    if (state.familyScope === "none") return null;
    var f = readFamily();
    if (state.familyScope === "full") { f.scope = "full"; return f; }
    /* Partial scope: Jain and Buddhist families keep the nakshatra reckoning
     * and their own naming constraints, but sutra, veda shakha and sampradaya
     * are Vedic and must not appear on their sheet even if a value is sitting
     * in a hidden field from an earlier tradition. Copied rather than mutated,
     * so switching back to Hindu does not find the answers wiped. */
    var out = { scope: "partial" };
    for (var k in f) if (f.hasOwnProperty(k)) out[k] = f[k];
    out.scope = "partial";
    out.sutra = "";
    out.vedaShakha = "";
    out.sampradaya = "";
    out.subcommunity = "";
    return out;
  }

  function renderFamily() {
    if (!FM) return;
    var sel = $("deity");
    var byRegion = {};
    FM.DEVATA.forEach(function (d) {
      var r = d[1] || "";
      (byRegion[r] = byRegion[r] || []).push(d[0]);
    });
    var html = '<option value="">' + esc(t("deityPick")) + "</option>";
    Object.keys(byRegion).forEach(function (r) {
      if (!r) return;
      html += '<optgroup label="' + esc(r) + '">' +
        byRegion[r].map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + "</option>"; }).join("") +
        "</optgroup>";
    });
    html += '<option value="Other / not sure">' + esc(t("deityOther")) + "</option>";
    var keepD = sel.value; sel.innerHTML = html; sel.value = keepD;

    var c = $("community"), keepC = c.value;
    c.innerHTML = '<option value="">' + esc(t("communityPick")) + "</option>" +
      FM.COMMUNITY.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[0]) + "</option>"; }).join("");
    c.value = keepC;

    /* Sub-community first, because it is the question a family can answer, and
     * it usually implies the other two. */
    var sub = $("subcommunity"), keepS = sub.value;
    var subs = FM.subcommunities(state.family.community);
    $("subWrap").hidden = !subs.length;
    sub.innerHTML = '<option value="">' + esc(t("subPick")) + "</option>" +
      subs.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + "</option>"; }).join("");
    sub.value = keepS;

    [["sutra", FM.sutras(), "sutraPick"],
     ["vedaShakha", FM.VEDA, "vedaPick"], ["sampradaya", FM.SAMPRADAYA, "sampradayaPick"]]
      .forEach(function (spec) {
        var e = $(spec[0]), keep = e.value;
        e.innerHTML = '<option value="">' + esc(t(spec[2])) + "</option>" +
          spec[1].map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + "</option>"; }).join("");
        e.value = keep;
      });

    $("eldestChips").innerHTML = [["yes", t("eldestYes")], ["no", t("eldestNo")], ["", t("eldestSkip")]]
      .map(function (o) {
        return '<button type="button" class="chip" data-eldest="' + o[0] + '" aria-pressed="' +
          (state.family.eldest === o[0]) + '">' + esc(o[1]) + "</button>";
      }).join("");
    $("aksharaChips").innerHTML = [["pada", t("aksharaPada")], ["rashi", t("aksharaRashi")], ["either", t("aksharaEither")]]
      .map(function (o) {
        return '<button type="button" class="chip" data-akshara="' + o[0] + '" aria-pressed="' +
          (state.family.aksharaSource === o[0]) + '">' + esc(o[1]) + "</button>";
      }).join("");
  }

  /* Fills the two ritual fields from what the family already told us, and says
   * where the guess came from. They are never silently set: the line underneath
   * names the sub-community or deity it was inferred from, and both remain
   * editable. Neither field changes a name -- they exist so the sankalpa lines
   * on the sheet are already written. */
  function applyRitualGuess() {
    if (!FM) return;
    var f = state.family;
    var g = FM.inferLineageDetail(f.community, f.subcommunity, f.deity, f.sutra);
    var notes = [];
    if (g.veda && !f.vedaTouched) {
      $("vedaShakha").value = g.veda;
      f.vedaShakha = g.veda;
      /* A sutra gives the veda outright rather than probably, so say which
       * kind of answer this is. Presenting a derivation and a correlation in
       * the same voice is how a family trusts the wrong one of the two. */
      if (g.vedaWhy) {
        notes.push({ certain: !!g.vedaCertain,
          text: fill(t(g.vedaCertain ? "certainVeda" : "guessVeda"),
            { v: g.veda, why: g.vedaWhy }) });
      }
    }
    if (g.sampradaya && !f.sampradayaTouched) {
      $("sampradaya").value = g.sampradaya;
      f.sampradaya = g.sampradaya;
      if (g.sampradayaWhy) {
        notes.push({ certain: false,
          text: fill(t("guessSampradaya"), { s: g.sampradaya, why: g.sampradayaWhy }) });
      }
    }
    var el = $("ritualGuess");
    if (notes.length) {
      /* Each line carries its own certainty. A derivation and a correlation
       * shown under one heading is how a family ends up trusting the weaker of
       * the two, so the caveat is attached only where it belongs. */
      el.className = "notelines";
      el.innerHTML = notes.map(function (n) {
        return '<span class="' + (n.certain ? "certain" : "guessed") + '">' +
          esc(n.text) + "</span>";
      }).join("") +
        (notes.some(function (n) { return !n.certain; })
          ? '<span class="guessed">' + esc(t("guessConfirm")) + "</span>" : "");
    } else {
      el.className = "hint";
      el.textContent = "";
    }

    /* Two independent answers disagreeing means one of them is wrong. Say so
     * rather than silently taking the sutra's side, the same way the PIN and
     * state cross-check does. */
    var cf = $("ritualConflict");
    if (g.conflict) {
      cf.className = "conflictnote";
      cf.textContent = fill(t("vedaConflict"), {
        sub: g.conflict.sub, a: g.conflict.fromSub,
        sutra: g.conflict.sutra, b: g.conflict.fromSutra
      });
      cf.hidden = false;
    } else {
      cf.hidden = true;
    }
  }

  function readFamily() {
    state.family.deity = $("deity").value;
    state.family.community = $("community").value;
    state.family.gotra = $("gotra").value.trim();
    state.family.carryName = $("carryName").value.trim();
    state.family.fatherName = $("fatherName").value.trim();
    state.family.motherName = $("motherName").value.trim();
    state.family.avoidNames = $("avoidNames").value.trim();
    state.family.subcommunity = $("subcommunity").value;
    state.family.sutra = $("sutra").value;
    state.family.vedaShakha = $("vedaShakha").value;
    state.family.sampradaya = $("sampradaya").value;
    return state.family;
  }

  // ---------- the birth sheet ----------
  function clearPatra() {
    $("patraMount").innerHTML = "";
    $("muhurtaMount").innerHTML = "";
    $("patraActions").hidden = true;
    state.panchang = null;
  }

  function birthOpts(coords) {
    return {
      date: $("dob").value, time: $("tob").value,
      tzOffsetHours: currentOffset(),
      lat: coords ? coords.lat : null, lon: coords ? coords.lon : null,
      placeName: state.place ? placeNameForSheet() : ""
    };
  }

  /* The sheet is the differentiator, so it is deliberately verbose about its own
   * working: every input echoed back, the convention named, and the distance to
   * the nearest pada seam stated in minutes. A family can hand this to their
   * priest and have it checked, which is the one thing a chat window cannot do. */
  function renderPatra(coords) {
    var tr = TR.byId(state.tradition);
    var opts = birthOpts(coords);
    if (tr.engine === "hijri") {
      $("patraMount").innerHTML = TR.hijriHtml(opts, state.lang);
      $("patraActions").hidden = false;
      $("muhurtaBtn").hidden = true;
      return;
    }
    if (tr.engine !== "panchang") { clearPatra(); return; }

    var p = window.Panchang.compute(opts);
    if (p.error) { clearPatra(); return; }
    var boundary = window.Panchang.padaBoundaryMinutes(opts);
    state.panchang = p;
    $("patraMount").innerHTML = TR.patraHtml(p, opts, boundary, state.lang, familyIfUsed());
    $("patraActions").hidden = false;
    $("muhurtaBtn").hidden = false;
    $("muhurtaMount").innerHTML = "";
  }

  function renderMuhurta() {
    var coords = currentCoords();
    var nd = window.Panchang.namingDays(birthOpts(coords));
    if (!nd || nd.error || !nd.candidates) return;
    var rows = nd.candidates.filter(function (c) { return c.clear || c.traditional; }).slice(0, 10);
    var h = '<section class="patra"><header class="patra-head"><h2>' +
      esc(t("muhurtaTitle")) + "</h2><p>" + esc(t("muhurtaIntro")) + "</p></header>";
    h += '<dl class="patra-grid">';
    rows.forEach(function (c) {
      var right = esc(c.tithi) + " · " + esc(c.nakshatra) +
        '<br><span class="q">' + (c.clear ? esc(t("muhurtaClear"))
          : esc(t("muhurtaBlocked")) + " " + esc(c.blocks.join("; "))) + "</span>";
      h += '<div class="pr"><dt>' + esc(c.date) + " · " + esc(c.weekday) +
        (c.traditional ? '<br><span class="q">' + esc(t("muhurtaTrad")) + "</span>" : "") +
        "</dt><dd>" + right + "</dd></div>";
    });
    h += "</dl><p class=\"patra-foot\">Rikta tithis, amavasya, Vishti karana and the " +
      "less-suited nakshatras are treated as holding a day back. Families differ on " +
      "which of these they observe, so treat this as a shortlist to take to your priest, " +
      "not a ruling.</p></section>";
    $("muhurtaMount").innerHTML = h;
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
    } else {
      var L = normaliseLetter($("letter").value);
      if (L) body.letter = L;
    }
    body.engine = TR.byId(state.tradition).engine;
    /* The family answers become explicit constraints rather than prose, so the
     * generator can be told which are hard and which are preferences. */
    var famNow = familyIfUsed();
    if (FM && famNow) {
      var fc = FM.constraints(famNow);
      if (fc.hard.length) body.mustHonour = fc.hard.map(function (x) { return x.text; });
      if (fc.soft.length) body.preferences = fc.soft.map(function (x) { return x.text; });
      if (fc.avoid.length) body.avoid = fc.avoid;
      var dn = famNow.deity ? FM.devataNama(famNow.deity, state.gender) : null;
      if (dn && dn.names.length) body.deityNames = dn.names;
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
      var clean = cleanNames(payload.names);
      if (!clean.length) { say(errorMessage(res.status, payload), true); return; }
      state.shown = clean;
      clean.forEach(function (n) {
        if (state.seen.indexOf(n.name) === -1) state.seen.push(n.name);
      });
      say(state.star ? fill(t("usingStar"), { s: "" }) : "");
      $("lblResults").hidden = false;
      $("publicNote").hidden = false;
      $("moreBtn").hidden = false;
      renderResults(clean);
      loadCounts(clean.map(function (n) { return n.name; }));
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

  /* The backend is a language model behind a Worker, so a malformed row is a
   * question of when, not whether. Sanitising once here means one bad entry
   * costs that entry rather than the whole response: without it a null in the
   * array threw into the generic catch and a family saw "something went wrong"
   * instead of the nineteen good names that came with it, and an object where
   * a name should be rendered as "[object Object]". */
  function cleanNames(raw) {
    if (!Array.isArray(raw)) return [];
    var str = function (v) { return typeof v === "string" ? v : ""; };
    return raw.map(function (n) {
      if (typeof n === "string") n = { name: n };
      if (!n || typeof n !== "object" || typeof n.name !== "string") return null;
      var name = n.name.trim();
      if (!name) return null;
      return { name: name, script: str(n.script), meaning: str(n.meaning),
        origin: str(n.origin), pronunciation: str(n.pronunciation),
        gender: str(n.gender), pairing: str(n.pairing) };
    }).filter(Boolean);
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
      /* encodeURIComponent, because an id carrying & or = would silently
       * truncate the link and the recipient would open an empty page. */
      $("shareLink").value = base.replace(/[?#].*$/, "") +
        "?list=" + encodeURIComponent(payload.id);
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
      if (!res.ok || !payload || !Array.isArray(payload.names) || !payload.names.length) return;
      var when = "";
      try { when = new Date(payload.createdAt).toLocaleDateString(state.lang === "en" ? "en-IN" : (state.lang + "-IN")); }
      catch (e) { when = String(payload.createdAt || "").slice(0, 10); }
      setText("sharedMeta", fill(t("sharedMeta"), { n: payload.names.length, d: when }) +
        (payload.nakshatra ? " " + payload.nakshatra : ""));
      $("sharedBanner").hidden = false;
      var sharedClean = cleanNames(payload.names);
      if (!sharedClean.length) return;
      state.shown = sharedClean;
      $("lblResults").hidden = false;
      $("publicNote").hidden = false;
      renderResults(sharedClean);
      loadCounts(sharedClean.map(function (n) { return n.name; }));
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

  // ---------- about ----------
  var AB = window.About;

  /* One renderer for both axes. The language comes from state.lang and the
   * shape from the tradition's engine, so a Marathi-speaking Christian family
   * gets Marathi copy with no pandit comparison, which is the point. */
  function renderAbout() {
    if (!AB) return;
    var L = state.lang;
    var tr = TR.byId(state.tradition);
    var eng = tr.engine;
    var S = AB.sections(eng);
    /* Every About string may carry {officiant}. Filling it here rather than
     * hardcoding "pandit" is what lets a Jain family read "priest or
     * astrologer" without a second copy of the whole section. */
    var who = TR.officiant(tr, L);
    var fillWho = function (v) {
      if (typeof v === "string") return v.replace(/\{officiant\}/g, who);
      if (Array.isArray(v)) return v.map(fillWho);
      if (v && typeof v === "object") {
        var o = {};
        for (var k in v) if (v.hasOwnProperty(k)) o[k] = fillWho(v[k]);
        return o;
      }
      return v;
    };
    var g = function (path) { return fillWho(AB.get(L, path)); };

    setText("aboutTitle", g("heading"));
    setText("aboutLead", g(S.intro + ".lead"));
    setText("aboutBody", g(S.intro + ".body"));
    setText("aboutVsH", g("vsHeading"));
    setText("aboutMethodH", g("methodHeading"));
    setText("aboutHonestH", g("honestHeading"));
    setText("aboutPanditH", g("panditHeading"));

    var sp = g(S.split);
    function col(cls, c) {
      return '<div class="sp ' + cls + '"><h4>' + esc(c.title) + '</h4><p class="why">' +
        esc(c.note) + "</p><ul>" +
        c.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    $("aboutSplit").innerHTML = col("calc", sp.left) + col("gen", sp.right);

    // the tradition-specific points first, then the ones that hold for everyone
    var vs = (g("vs." + S.vs) || []).concat(g("vs.universal") || []);
    $("aboutVs").innerHTML = vs.map(function (v) {
      return '<div class="vs-item"><h4>' + esc(v[0]) + "</h4><p>" + esc(v[1]) + "</p></div>";
    }).join("");

    /* Only a tradition that reckons from the birth moment gets the pandit
     * comparison. Showing it to a Christian or Parsi family would describe work
     * this page did not do for them. */
    var showPandit = S.pandit;
    $("aboutPanditH").hidden = !showPandit;
    $("aboutPanditSub").hidden = !showPandit;
    $("aboutStepsWrap").hidden = !showPandit;
    if (showPandit) {
      var pd = g("pandit");
      setText("aboutPanditSub", pd.intro);
      $("aboutSteps").innerHTML =
        "<thead><tr><th>" + esc(pd.him) + "</th><th>" + esc(pd.us) + "</th><th></th></tr></thead><tbody>" +
        pd.rows.map(function (r) {
          return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) +
            '</td><td><span class="tag ' + r[2] + '">' + esc(pd.tags[r[2]]) + "</span></td></tr>";
        }).join("") + "</tbody>";
    }

    $("aboutHonest").innerHTML = (g(S.honest) || []).map(function (l) {
      return '<div class="limit"><h4>' + esc(l[0]) + "</h4><p>" + esc(l[1]) + "</p></div>";
    }).join("");

    var blocks = (S.detail ? (g("detail.blocks." + S.detail) || []) : [])
      .concat(g("detail.blocks.universal") || []);
    setText("aboutDetailSummary", g("detail.title"));
    $("aboutDetailBody").innerHTML = '<div class="db">' + blocks.map(function (b) {
      return "<h4>" + esc(b[0]) + "</h4><p>" + esc(b[1]) + "</p>";
    }).join("") + "</div>";

    renderAboutMethod();
  }

  function renderAboutMethod() {
    if (!AB) return;
    var tr = TR.byId(state.tradition);
    var m = AB.get(state.lang, "method." + state.tradition) ||
      AB.get("en", "method." + state.tradition);
    var h = '<div class="method"><p class="who">' + esc(TR.labelFor(tr, state.lang)) + "</p>";
    h += '<p class="lead">' + esc(TR.blurbFor(tr, state.lang)) + "</p>";
    if (m) {
      h += "<p>" + esc(m.body) + "</p>";
      h += '<div class="mgrid"><div><h5>' + esc(AB.get(state.lang, "asks")) + "</h5><ul>" +
        m.asks.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      h += "<div><h5>" + esc(AB.get(state.lang, "gives")) + "</h5><ul>" +
        m.gives.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>";
      if (m.caveat) h += '<div class="mnote">' + esc(m.caveat) + "</div>";
      if (m.planned) h += '<div class="mnote plan">' + esc(m.planned) + "</div>";
    }
    h += "</div>";
    $("aboutMethod").innerHTML = h;
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
    $("whereChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-where]");
      if (!b) return;
      state.where = b.dataset.where;
      renderWhere();
    });
    ["village", "pin"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        if (id === "pin") {
          // keep the field to digits as it is typed, but never truncate silently
          var d = $("pin").value.replace(/\D/g, "").slice(0, 7);
          if ($("pin").value !== d) $("pin").value = d;
        }
        resolveIndia();
      });
    });
    $("stateSel").addEventListener("change", resolveIndia);
    ["place", "nearby"].forEach(function (which) {
      var a = AC[which];
      $(a.input).addEventListener("input", function () { acSearch(which); });
      $(a.input).addEventListener("focus", function () { if (a.items.length) acSearch(which); });
      $(a.input).addEventListener("keydown", function (e) {
        var open = !$(a.list).hidden;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!open) { acSearch(which); return; }
          a.index += e.key === "ArrowDown" ? 1 : -1;
          if (a.index < 0) a.index = a.items.length - 1;
          if (a.index >= a.items.length) a.index = 0;
          acRender(which);
          var opt = document.getElementById(which + "opt" + a.index);
          if (opt && opt.scrollIntoView) opt.scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          if (!open) return;
          e.preventDefault();
          if (a.index >= 0) acChoose(which, a.index);
          else if (a.items.length) acChoose(which, 0);
        } else if (e.key === "Escape") {
          acClose(which);
        }
      });
      $(a.list).addEventListener("mousedown", function (e) {
        var li = e.target.closest("[data-i]");
        if (!li) return;
        e.preventDefault();
        acChoose(which, +li.dataset.i);
      });
      $(a.input).addEventListener("blur", function () {
        setTimeout(function () { acClose(which); }, 120);
      });
    });
    /* Leaving the birthplace field with unrecognised text is not an error, it is
     * the village case. Ask for a nearby town instead of clearing their input. */
    $("place").addEventListener("blur", function () {
      setTimeout(function () {
        var q = $("place").value.trim();
        if (q.length >= 2 && !state.place && $("nearbyWrap").hidden) openNearby(q);
      }, 160);
    });
    // the offset depends on the date, so re-resolve whenever either changes
    $("dob").addEventListener("change", function () {
      if (state.where === "IN") resolveIndia(); else renderPlaceMeta();
    });
    $("tob").addEventListener("change", function () {
      if (state.where === "IN") resolveIndia(); else renderPlaceMeta();
    });
    $("calcBtn").addEventListener("click", calcStar);
    $("clearStarBtn").addEventListener("click", function () {
      state.star = null;
      renderStar();
      clearPatra();
      if (state.sky) state.sky.clear();
      say("");
    });
    $("famToggle").addEventListener("click", function () {
      var open = $("famPanel").hidden;
      $("famPanel").hidden = !open;
      $("famToggle").setAttribute("aria-expanded", String(open));
      setText("famToggleLabel", (open ? "\u2212 " : "\uFF0B ") + t("famToggle"));
    });
    $("eldestChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-eldest]");
      if (!b) return;
      state.family.eldest = b.dataset.eldest;
      renderFamily();
      if (state.star) renderPatra(currentCoords());
    });
    $("aksharaChips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-akshara]");
      if (!b) return;
      state.family.aksharaSource = b.dataset.akshara;
      renderFamily();
    });
    ["deity", "community", "subcommunity", "sutra"].forEach(function (id) {
      $(id).addEventListener("change", function () {
        readFamily();
        /* The community decides both what the lineage field is called and which
         * list is offered first, so it has to be relabelled the moment it
         * changes, and the sub-community list rebuilt for the new community. */
        if (id === "community") {
          setText("lblGotra", FM.lineageTerm(state.family.community));
          state.family.subcommunity = "";
          state.family.sutra = "";
          state.family.vedaTouched = false;
          state.family.sampradayaTouched = false;
          renderFamily();
        }
        applyRitualGuess();
        readFamily();
        if (state.star) renderPatra(currentCoords());
      });
    });
    [["vedaShakha", "vedaTouched"], ["sampradaya", "sampradayaTouched"]].forEach(function (pair) {
      $(pair[0]).addEventListener("change", function () {
        state.family[pair[1]] = true;   // stop overwriting a deliberate answer
        readFamily();
        if (state.star) renderPatra(currentCoords());
      });
    });
    ["gotra", "carryName", "fatherName", "motherName", "avoidNames"].forEach(function (id) {
      $(id).addEventListener("change", function () {
        readFamily();
        if (state.star) renderPatra(currentCoords());
      });
    });
    /* The lineage field. A dropdown was the obvious thing and it does not fit:
     * an Agarwal family has eighteen gotras, a Jat family over two thousand, and
     * a Maratha family would answer with a devak rather than a gotra at all. So
     * it is a typo-tolerant combobox that renames itself per community and still
     * takes free text, with the typed value always offered as a real choice. */
    var gotraItems = [], gotraIdx = -1;

    function gotraRender() {
      var ul = $("gotraList"), q = $("gotra").value.trim();
      var rows = gotraItems.map(function (it, i) {
        if (it.__typed) {
          return '<li role="option" class="use-typed" id="gopt' + i + '" data-i="' + i +
            '" aria-selected="' + (i === gotraIdx) + '"><span>' +
            esc(fill(t("useTyped"), { q: it.name })) + '</span><span class="where">' +
            esc(t("useTypedHint")) + "</span></li>";
        }
        return '<li role="option" id="gopt' + i + '" data-i="' + i + '" aria-selected="' +
          (i === gotraIdx) + '"><span>' + esc(it.name) + '</span><span class="where">' +
          esc(t("lin_" + it.group) || it.group) + "</span></li>";
      });
      ul.innerHTML = rows.join("");
      ul.hidden = !rows.length;
      $("gotra").setAttribute("aria-expanded", String(!!rows.length));
    }

    function gotraSearch() {
      var q = $("gotra").value.trim();
      if (q.length < 2) { $("gotraList").hidden = true; gotraItems = []; return; }
      gotraIdx = -1;
      gotraItems = FM.searchLineage(q, state.family.community, 7);
      var exact = gotraItems.some(function (x) {
        return FM.normLineage(x.name) === FM.normLineage(q);
      });
      if (!exact) gotraItems.push({ __typed: true, name: q, group: "" });
      gotraRender();
    }

    function gotraChoose(i) {
      var it = gotraItems[i];
      if (!it) return;
      // a devak is stored with its label for clarity; keep only what was named
      $("gotra").value = it.__typed ? it.name
        : (it.name.indexOf(":") >= 0 ? it.name.slice(it.name.indexOf(":") + 1).trim() : it.name);
      $("gotraList").hidden = true;
      readFamily();
      if (state.star) renderPatra(currentCoords());
    }

    $("gotra").addEventListener("input", gotraSearch);
    $("gotra").addEventListener("keydown", function (e) {
      var open = !$("gotraList").hidden;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!open) { gotraSearch(); return; }
        gotraIdx += e.key === "ArrowDown" ? 1 : -1;
        if (gotraIdx < 0) gotraIdx = gotraItems.length - 1;
        if (gotraIdx >= gotraItems.length) gotraIdx = 0;
        gotraRender();
      } else if (e.key === "Enter" && open) {
        e.preventDefault();
        gotraChoose(gotraIdx >= 0 ? gotraIdx : 0);
      } else if (e.key === "Escape") {
        $("gotraList").hidden = true;
      }
    });
    $("gotraList").addEventListener("mousedown", function (e) {
      var li = e.target.closest("[data-i]");
      if (!li) return;
      e.preventDefault();
      gotraChoose(+li.dataset.i);
    });
    $("gotra").addEventListener("blur", function () {
      setTimeout(function () { $("gotraList").hidden = true; }, 120);
    });
    $("printPatra").addEventListener("click", function () { window.print(); });
    $("muhurtaBtn").addEventListener("click", renderMuhurta);
    $("letter").addEventListener("blur", function () {
      $("letter").value = normaliseLetter($("letter").value);
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

  /* The ring turns to the birth moment and the nakshatra ignites. This is the
   * only large movement on the page and it fires only on a real result, never
   * on load, so it reads as the page answering rather than as decoration. */
  function skyShow(res) {
    if (!state.sky || !res) return;
    state.sky.showMoment(res.jd, res.index);
  }

  function init() {
    var params = new URLSearchParams(location.search);
    var lang = params.get("lang");
    if (lang && STR[lang]) state.lang = lang;
    loadList();
    applyLanguage();
    renderAbout();
    wire();
    if (window.Sky && document.getElementById("sky")) {
      try { state.sky = window.Sky.start(document.getElementById("sky")); }
      catch (e) { /* a canvas failure must never take the form down */ }
    }
    var listId = params.get("list");
    if (listId) openSharedList(listId.replace(/[^a-z0-9]/gi, "").slice(0, 12));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
