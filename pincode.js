/* Naamkaran — Indian PIN codes
 *
 * The best single question to ask an Indian family about a birthplace, because
 * it is the one that removes the dangerous error rather than the harmless one.
 *
 * Getting the coordinates wrong by 50 km moves about one birth in a thousand by
 * a pada. Getting the timezone wrong by an hour moves one in six, and landing in
 * the wrong country moves all of them. A valid Indian PIN code cannot land in
 * the wrong country, so it closes off the failure that actually matters, and its
 * 5-25 km footprint is far finer than anything downstream can detect.
 *
 * It is also checkable. Six digits are either in the directory or not, which is
 * the opposite of asking a language model to guess at a village.
 *
 * Two things this file is careful about:
 *
 *   PIN codes began on 15 August 1972. A birth before then had no PIN code at
 *   the time. Today's PIN for the village is a perfectly good answer, but the
 *   field must never be required, or the families most likely to be looking up
 *   an elder's chart are the ones locked out.
 *
 *   Several two-digit ranges are shared between states -- Uttar Pradesh with
 *   Uttarakhand, Bihar with Jharkhand, Andhra Pradesh with Telangana -- and a
 *   few union territories sit inside a neighbour's range. Where a prefix is
 *   ambiguous this file says so instead of picking one.
 */
(function () {
  "use strict";

  /* First two digits to state. The postal circle allocation. Where a range
   * covers more than one state the entry lists all of them, and validation
   * accepts any. */
  var PREFIX2 = {
    "11": ["Delhi NCR"],
    "12": ["Haryana"], "13": ["Haryana"],
    "14": ["Punjab"], "15": ["Punjab"], "16": ["Punjab", "Goa and UTs"],
    "17": ["Himachal Pradesh"],
    "18": ["Jammu Kashmir Ladakh"], "19": ["Jammu Kashmir Ladakh"],
    "20": ["Uttar Pradesh"], "21": ["Uttar Pradesh"], "22": ["Uttar Pradesh"],
    "23": ["Uttar Pradesh"], "24": ["Uttar Pradesh", "Uttarakhand"],
    "25": ["Uttar Pradesh", "Uttarakhand"], "26": ["Uttar Pradesh", "Uttarakhand"],
    "27": ["Uttar Pradesh"], "28": ["Uttar Pradesh"],
    "30": ["Rajasthan"], "31": ["Rajasthan"], "32": ["Rajasthan"],
    "33": ["Rajasthan"], "34": ["Rajasthan"],
    "36": ["Gujarat"], "37": ["Gujarat"], "38": ["Gujarat"],
    "39": ["Gujarat", "Goa and UTs"],
    "40": ["Maharashtra", "Goa and UTs"], "41": ["Maharashtra"], "42": ["Maharashtra"],
    "43": ["Maharashtra"], "44": ["Maharashtra"],
    "45": ["Madhya Pradesh"], "46": ["Madhya Pradesh"], "47": ["Madhya Pradesh"],
    "48": ["Madhya Pradesh"], "49": ["Chhattisgarh", "Madhya Pradesh"],
    "50": ["Telangana"], "51": ["Andhra Pradesh", "Telangana"],
    "52": ["Andhra Pradesh"], "53": ["Andhra Pradesh", "Goa and UTs"],
    "56": ["Karnataka"], "57": ["Karnataka"], "58": ["Karnataka"], "59": ["Karnataka"],
    "60": ["Tamil Nadu", "Goa and UTs"], "61": ["Tamil Nadu"], "62": ["Tamil Nadu"],
    "63": ["Tamil Nadu"], "64": ["Tamil Nadu"],
    "67": ["Kerala", "Goa and UTs"], "68": ["Kerala", "Goa and UTs"], "69": ["Kerala"],
    "70": ["West Bengal"], "71": ["West Bengal"], "72": ["West Bengal"],
    "73": ["West Bengal", "Northeast"], "74": ["West Bengal", "Goa and UTs"],
    "75": ["Odisha"], "76": ["Odisha"], "77": ["Odisha"],
    "78": ["Assam"], "79": ["Northeast"],
    "80": ["Bihar"], "81": ["Bihar", "Jharkhand"], "82": ["Jharkhand", "Bihar"],
    "83": ["Jharkhand"], "84": ["Bihar"], "85": ["Bihar"]
  };

  /* Three-digit prefixes with a confident anchor town. A three-digit prefix is a
   * sorting district, so the anchor sits within roughly 50-150 km of anywhere in
   * it -- under half a percent of births shifted, by the measurements above.
   *
   * This list is deliberately partial: only prefixes worth being confident about
   * are here. tools/build-places.js replaces it with the full India Post
   * directory, which resolves to the individual PIN and its own centroid. */
  var ANCHOR3 = {
    "110": "Delhi", "121": "Faridabad", "122": "Gurugram", "124": "Rohtak",
    "125": "Hisar", "131": "Sonipat", "132": "Karnal", "133": "Ambala",
    "134": "Panchkula", "135": "Yamunanagar", "136": "Kurukshetra",
    "140": "Rupnagar", "141": "Ludhiana", "142": "Moga", "143": "Amritsar",
    "144": "Jalandhar", "145": "Pathankot", "146": "Hoshiarpur", "147": "Patiala",
    "148": "Sangrur", "151": "Bathinda", "152": "Firozpur", "160": "Chandigarh",
    "171": "Shimla", "173": "Solan", "175": "Mandi", "176": "Dharamshala",
    "177": "Una", "180": "Jammu", "181": "Udhampur", "184": "Kathua",
    "190": "Srinagar", "192": "Anantnag", "193": "Baramulla", "194": "Leh",
    "201": "Ghaziabad", "203": "Bulandshahr", "204": "Hathras", "205": "Mainpuri",
    "206": "Etawah", "208": "Kanpur", "210": "Banda", "211": "Prayagraj",
    "221": "Varanasi", "222": "Jaunpur", "223": "Azamgarh", "224": "Ayodhya",
    "225": "Barabanki", "226": "Lucknow", "227": "Lucknow", "228": "Sultanpur",
    "229": "Rae Bareli", "231": "Mirzapur", "232": "Ghazipur", "241": "Hardoi",
    "242": "Shahjahanpur", "243": "Bareilly", "244": "Moradabad",
    "247": "Saharanpur", "248": "Dehradun", "249": "Haridwar", "250": "Meerut",
    "251": "Muzaffarnagar", "261": "Sitapur", "262": "Lakhimpur",
    "263": "Nainital", "272": "Basti", "273": "Gorakhpur", "274": "Deoria",
    "277": "Ballia", "281": "Mathura", "282": "Agra", "283": "Firozabad",
    "284": "Jhansi", "301": "Alwar", "302": "Jaipur", "303": "Jaipur",
    "304": "Tonk", "305": "Ajmer", "306": "Pali", "311": "Bhilwara",
    "312": "Chittorgarh", "313": "Udaipur", "321": "Bharatpur",
    "322": "Sawai Madhopur", "324": "Kota", "327": "Banswara", "331": "Churu",
    "332": "Sikar", "333": "Jhunjhunu", "334": "Bikaner", "335": "Sri Ganganagar",
    "341": "Nagaur", "342": "Jodhpur", "345": "Jaisalmer",
    "360": "Rajkot", "361": "Jamnagar", "362": "Junagadh", "363": "Surendranagar",
    "364": "Bhavnagar", "370": "Bhuj", "380": "Ahmedabad", "382": "Gandhinagar",
    "384": "Mehsana", "385": "Palanpur", "387": "Nadiad", "388": "Anand",
    "390": "Vadodara", "391": "Vadodara", "392": "Bharuch", "394": "Surat",
    "395": "Surat", "396": "Valsad", "403": "Panaji",
    "400": "Mumbai", "401": "Vasai", "410": "Panvel", "411": "Pune",
    "412": "Pune", "413": "Solapur", "414": "Ahmednagar", "415": "Satara",
    "416": "Kolhapur", "421": "Kalyan", "422": "Nashik", "423": "Malegaon",
    "424": "Dhule", "425": "Jalgaon", "431": "Chhatrapati Sambhajinagar",
    "440": "Nagpur", "441": "Nagpur", "442": "Wardha", "444": "Akola",
    "445": "Yavatmal", "450": "Khandwa", "451": "Khargone", "452": "Indore",
    "455": "Dewas", "456": "Ujjain", "457": "Ratlam", "458": "Neemuch",
    "460": "Betul", "461": "Hoshangabad", "462": "Bhopal", "464": "Vidisha",
    "470": "Sagar", "473": "Guna", "474": "Gwalior", "475": "Bhind",
    "480": "Chhindwara", "482": "Jabalpur", "483": "Murwara", "486": "Rewa",
    "485": "Satna", "490": "Durg", "491": "Rajnandgaon", "492": "Raipur",
    "495": "Bilaspur", "497": "Ambikapur", "500": "Hyderabad",
    "501": "Hyderabad", "502": "Sangareddy", "503": "Nizamabad",
    "504": "Adilabad", "505": "Karimnagar", "506": "Warangal", "507": "Khammam",
    "508": "Nalgonda", "509": "Mahbubnagar", "515": "Anantapur",
    "516": "Kadapa", "517": "Chittoor", "518": "Kurnool", "520": "Vijayawada",
    "521": "Machilipatnam", "522": "Guntur", "523": "Ongole", "524": "Nellore",
    "530": "Visakhapatnam", "531": "Anakapalle", "532": "Srikakulam",
    "533": "Kakinada", "534": "Eluru", "535": "Vizianagaram",
    "560": "Bengaluru", "561": "Chikkaballapur", "562": "Ramanagara",
    "563": "Kolar", "570": "Mysuru", "571": "Mandya", "572": "Tumakuru",
    "573": "Hassan", "574": "Mangaluru", "575": "Mangaluru", "576": "Udupi",
    "577": "Shivamogga", "580": "Hubballi", "581": "Gadag", "582": "Gadag",
    "583": "Ballari", "584": "Raichur", "585": "Kalaburagi", "586": "Vijayapura",
    "587": "Bagalkot", "590": "Belagavi", "591": "Belagavi",
    "600": "Chennai", "601": "Chennai", "602": "Kanchipuram",
    "603": "Kanchipuram", "604": "Tiruvannamalai", "605": "Puducherry",
    "606": "Cuddalore", "607": "Cuddalore", "608": "Chidambaram",
    "609": "Karaikal", "610": "Thanjavur", "612": "Kumbakonam",
    "613": "Thanjavur", "614": "Pudukkottai", "620": "Tiruchirappalli",
    "621": "Tiruchirappalli", "624": "Dindigul", "625": "Madurai",
    "626": "Virudhunagar", "627": "Tirunelveli", "628": "Thoothukudi",
    "629": "Nagercoil", "630": "Ramanathapuram", "635": "Krishnagiri",
    "636": "Salem", "637": "Namakkal", "638": "Erode", "639": "Karur",
    "641": "Coimbatore", "642": "Coimbatore", "643": "Udhagamandalam",
    "670": "Kannur", "671": "Kasaragod", "673": "Kozhikode",
    "676": "Malappuram", "678": "Palakkad", "679": "Palakkad",
    "680": "Thrissur", "682": "Kochi", "683": "Kochi", "686": "Kottayam",
    "688": "Alappuzha", "689": "Pathanamthitta", "690": "Kollam",
    "691": "Kollam", "695": "Thiruvananthapuram",
    "700": "Kolkata", "711": "Howrah", "712": "Serampore", "713": "Bardhaman",
    "721": "Medinipur", "722": "Bankura", "723": "Purulia", "731": "Baharampur",
    "732": "Malda", "733": "Balurghat", "734": "Siliguri", "735": "Jalpaiguri",
    "736": "Cooch Behar", "737": "Gangtok", "741": "Krishnanagar",
    "743": "Barrackpore", "744": "Port Blair", "751": "Bhubaneswar",
    "753": "Cuttack", "754": "Cuttack", "755": "Dhenkanal", "756": "Balasore",
    "757": "Baripada", "758": "Angul", "759": "Dhenkanal", "760": "Berhampur",
    "761": "Berhampur", "764": "Koraput", "765": "Rayagada", "766": "Jharsuguda",
    "768": "Sambalpur", "769": "Rourkela", "770": "Jharsuguda",
    "781": "Guwahati", "782": "Nagaon", "783": "Bongaigaon", "784": "Tezpur",
    "785": "Jorhat", "786": "Dibrugarh", "787": "North Lakhimpur",
    "788": "Silchar", "790": "Itanagar", "791": "Itanagar", "793": "Shillong",
    "794": "Tura", "795": "Imphal", "796": "Aizawl", "797": "Kohima",
    "798": "Dimapur", "799": "Agartala", "800": "Patna", "801": "Patna",
    "802": "Arrah", "803": "Hajipur", "804": "Patna", "811": "Munger",
    "812": "Bhagalpur", "813": "Deoghar", "814": "Dumka", "815": "Giridih",
    "816": "Dumka", "821": "Sasaram", "823": "Gaya", "824": "Gaya",
    "825": "Hazaribagh", "826": "Dhanbad", "827": "Bokaro", "828": "Dhanbad",
    "829": "Ramgarh", "831": "Jamshedpur", "832": "Chaibasa", "833": "Chaibasa",
    "834": "Ranchi", "835": "Ranchi", "841": "Chhapra", "842": "Muzaffarpur",
    "843": "Muzaffarpur", "845": "Motihari", "846": "Darbhanga",
    "847": "Darbhanga", "848": "Begusarai", "851": "Begusarai",
    "852": "Saharsa", "854": "Purnia", "855": "Kishanganj"
  };

  // set by tools/build-places.js when the full India Post directory is present
  var FULL = (typeof window !== "undefined" && window.NAAMKARAN_PIN_DATA) || null;

  function clean(pin) {
    return String(pin == null ? "" : pin).replace(/\D/g, "").slice(0, 6);
  }

  /* Format check only. A six-digit string starting 1-8 is the shape of a real
   * PIN; 9 is the Army Postal Service, which has no fixed geography, and 0 is
   * unallocated.
   *
   * Counts the digits before truncating. clean() slices to six so that typing
   * into the field behaves, but if someone pastes seven digits that is a typo,
   * not a PIN, and silently dropping the last one would resolve it confidently
   * to the wrong place. */
  function looksValid(pin) {
    var raw = String(pin == null ? "" : pin).replace(/\D/g, "");
    if (raw.length !== 6) return false;
    var d = raw.charAt(0);
    return d >= "1" && d <= "8";
  }

  function statesFor(pin) {
    var p = clean(pin);
    if (p.length < 2) return null;
    return PREFIX2[p.slice(0, 2)] || null;
  }

  /* Resolve a PIN to a place we can take coordinates and a timezone from.
   * `lookupTown` is supplied by places.js so this file holds no coordinates of
   * its own and the two can never drift apart. */
  function resolve(pin, lookupTown) {
    var p = clean(pin);
    if (!looksValid(p)) return { error: "format" };

    if (FULL && FULL[p]) {
      var f = FULL[p];
      return {
        pin: p, lat: f[0], lon: f[1], region: f[2], district: f[3] || "",
        tz: "Asia/Kolkata", precision: "pin"
      };
    }

    var anchorName = ANCHOR3[p.slice(0, 3)];
    var states = statesFor(p);
    if (!anchorName) {
      // shape is fine and the state is known, but we have no anchor for it yet
      return states ? { pin: p, states: states, precision: "state-only" }
        : { error: "unknown" };
    }
    var town = lookupTown ? lookupTown(anchorName) : null;
    if (!town) return states ? { pin: p, states: states, precision: "state-only" }
      : { error: "unknown" };

    return {
      pin: p, lat: town.lat, lon: town.lon, region: town.region,
      district: anchorName, tz: town.tz, precision: "district"
    };
  }

  /* Does the PIN agree with the state the family chose? Two independent inputs
   * that must match, which is the whole reason for asking both. A mismatch is
   * almost always a typo in one of them, and catching it here is worth more than
   * any amount of coordinate precision. */
  function agreesWithState(pin, regionName) {
    var states = statesFor(pin);
    if (!states || !regionName) return null;
    var want = String(regionName).toLowerCase();
    var hit = states.some(function (s) { return s.toLowerCase() === want; });
    return { ok: hit, expected: states };
  }

  // PIN codes were introduced on 15 August 1972
  function existedAt(dateStr) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || "").trim());
    if (!m) return true;
    var t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    return t >= Date.UTC(1972, 7, 15);
  }

  var api = {
    clean: clean, looksValid: looksValid, statesFor: statesFor,
    resolve: resolve, agreesWithState: agreesWithState, existedAt: existedAt,
    PREFIX2: PREFIX2, ANCHOR3: ANCHOR3,
    anchorCount: Object.keys(ANCHOR3).length,
    hasFullData: !!FULL
  };
  if (typeof globalThis !== "undefined") globalThis.Pincode = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
