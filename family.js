/* Naamkaran — family
 *
 * The things a pandit asks that a birth chart cannot tell him.
 *
 * Three rows of the comparison table used to say "only he can do this". Two of
 * them said that because we never asked, not because it was unknowable:
 *
 *   The devata-nama comes from the kula devata. Ask which deity, and it can be
 *   given like any other name in the traditional set.
 *
 *   "What your elders will accept" is not a form field, but the constraints
 *   behind it are: a grandfather's name that has to be carried forward, names
 *   already used, names the family avoids. Those are askable and usable.
 *
 * The third row stays his. We name the shanti that is commonly prescribed for a
 * dosha and when it is usually done, because a family that knows the word can
 * raise it with him early. We do not describe the vidhi. The remedy varies with
 * sampradaya and veda-shakha, and a confidently wrong instruction about a rite
 * is worse than saying nothing.
 *
 * Everything here is optional. A family in a city may not know their gotra, and
 * a form that demands it turns them away at the door.
 */
(function () {
  "use strict";

  /* Kula devata, grouped by where the family is likely to be from, each with
   * the names a devata-nama is actually drawn from. The devata-nama is a name
   * OF the deity, so these are epithets rather than related words: a child whose
   * kula devata is Khandoba is named Khanderao or Martand, not "brave". */
  var DEVATA = [
    // ---- Maharashtra
    ["Khandoba", "Maharashtra", ["Khanderao", "Martand", "Malhari", "Mailar", "Khandu"],
      ["Mhalsa", "Malhari"]],
    ["Tuljapur Bhavani", "Maharashtra", ["Bhavanishankar", "Tulja"],
      ["Bhavani", "Tulja", "Ambika", "Tuljabhavani"]],
    ["Vitthal (Pandharpur)", "Maharashtra", ["Vitthal", "Panduranga", "Vithoba", "Vithal", "Hari"],
      ["Rakhumai", "Rukmini"]],
    ["Renuka (Mahur)", "Maharashtra", ["Renukanandan"], ["Renuka", "Ekvira", "Yellamma"]],
    ["Mahalaxmi (Kolhapur)", "Maharashtra", ["Laxmikant", "Mahalaxmikant"],
      ["Mahalaxmi", "Ambabai", "Laxmi"]],
    ["Jyotiba", "Maharashtra", ["Jyotiba", "Kedarnath", "Kedarling"], ["Jyoti"]],
    ["Saptashrungi", "Maharashtra", ["Saptashrung"], ["Saptashrungi", "Bhagavati"]],
    ["Ekvira", "Maharashtra", [], ["Ekvira", "Renuka"]],
    ["Datta (Ganagapur)", "Maharashtra", ["Dattatreya", "Datta", "Digambar", "Avadhut"], ["Dattaprabha"]],
    ["Ganpati (Ashtavinayak)", "Maharashtra", ["Ganesh", "Ganpat", "Vinayak", "Siddhesh", "Gajanan", "Moreshwar"],
      ["Ganeshi", "Vinayaki"]],
    ["Bhairavnath", "Maharashtra", ["Bhairav", "Bhairavnath", "Kalbhairav"], []],
    ["Kalubai", "Maharashtra", [], ["Kalu", "Kalika", "Kalubai"]],

    // ---- Karnataka
    ["Manjunatha (Dharmasthala)", "Karnataka", ["Manjunath", "Manju", "Shiva"], ["Manjula"]],
    ["Chamundeshwari", "Karnataka", [], ["Chamundi", "Chamundeshwari", "Durga"]],
    ["Banashankari", "Karnataka", [], ["Banashankari", "Shankari"]],
    ["Durgaparameshwari (Kateel)", "Karnataka", [], ["Durga", "Parameshwari"]],
    ["Yellamma (Saundatti)", "Karnataka", [], ["Yellamma", "Renuka"]],
    ["Anjaneya", "Karnataka", ["Anjaneya", "Hanumanth", "Maruti", "Bajrang"], ["Anjana"]],

    // ---- Andhra Pradesh and Telangana
    ["Venkateshwara (Tirumala)", "Andhra Pradesh", ["Venkatesh", "Srinivas", "Balaji", "Govinda", "Venkat", "Srinivasa"],
      ["Venkatalakshmi", "Padmavathi", "Alamelu"]],
    ["Kanaka Durga (Vijayawada)", "Telangana", [], ["Durga", "Kanakadurga", "Kanaka"]],
    ["Narasimha (Ahobilam)", "Andhra Pradesh", ["Narasimha", "Narasimhulu", "Simha"], ["Chenchulakshmi"]],
    ["Ankamma", "Andhra Pradesh", [], ["Ankamma", "Ankalamma"]],

    // ---- Tamil Nadu
    ["Murugan (Palani)", "Tamil Nadu", ["Murugan", "Kartikeyan", "Skandan", "Shanmugam", "Velan", "Arumugam", "Saravanan"],
      ["Valli", "Devasena"]],
    ["Meenakshi (Madurai)", "Tamil Nadu", ["Sundareshwar"], ["Meenakshi", "Meena", "Angayarkanni"]],
    ["Kamakshi (Kanchi)", "Tamil Nadu", [], ["Kamakshi", "Kamu"]],
    ["Ayyappan (Sabarimala)", "Tamil Nadu", ["Ayyappan", "Manikandan", "Sastha", "Dharmasastha"], []],
    ["Perumal (Srirangam)", "Tamil Nadu", ["Ranganathan", "Rangan", "Azhagiya", "Namperumal"], ["Ranganayaki"]],
    ["Nataraja (Chidambaram)", "Tamil Nadu", ["Nataraj", "Sabesan", "Thillai"], ["Sivakami"]],
    ["Mariamman", "Tamil Nadu", [], ["Mariamma", "Mari"]],

    // ---- Kerala
    ["Guruvayurappan", "Kerala", ["Guruvayurappan", "Unnikrishnan", "Krishnan", "Kannan"], ["Radha"]],
    ["Ayyappan", "Kerala", ["Ayyappan", "Manikandan", "Sastha"], []],
    ["Bhagavathi", "Kerala", [], ["Bhagavathi", "Devi", "Bhadra"]],
    ["Subrahmanya", "Kerala", ["Subrahmanyan", "Skandan", "Muruka"], []],

    // ---- Gujarat
    ["Ambaji", "Gujarat", ["Ambalal"], ["Amba", "Ambika", "Jagadamba", "Ambaben"]],
    ["Khodiyar", "Gujarat", [], ["Khodiyar", "Khodal"]],
    ["Bahuchara", "Gujarat", [], ["Bahuchara", "Bala"]],
    ["Ashapura", "Gujarat", [], ["Ashapura", "Asha"]],
    ["Dwarkadhish", "Gujarat", ["Dwarkesh", "Ranchhod", "Krishna", "Kanha"], ["Rukmini"]],
    ["Umiya", "Gujarat", [], ["Umiya", "Uma", "Parvati"]],

    // ---- Rajasthan
    ["Shrinathji (Nathdwara)", "Rajasthan", ["Shrinath", "Nathji", "Krishna", "Giridhari"], ["Yashoda"]],
    ["Karni Mata", "Rajasthan", [], ["Karni", "Karnima"]],
    ["Eklingji", "Rajasthan", ["Eklingnath", "Eklavya", "Shiva"], []],
    ["Salasar Balaji", "Rajasthan", ["Balaji", "Hanuman", "Bajrang"], []],
    ["Jeen Mata", "Rajasthan", [], ["Jeen", "Jayanti"]],

    // ---- North India
    ["Vaishno Devi", "North India", [], ["Vaishnavi", "Vaishno", "Trikuta"]],
    ["Vindhyavasini", "North India", [], ["Vindhya", "Vindhyavasini"]],
    ["Ram (Ayodhya)", "North India", ["Ram", "Raghav", "Raghunath", "Sitaram", "Ramchandra"], ["Sita", "Janaki"]],
    ["Krishna (Mathura)", "North India", ["Krishna", "Kanha", "Madhav", "Murari", "Banke Bihari"], ["Radha", "Radhika"]],
    ["Hanuman", "North India", ["Hanuman", "Bajrang", "Maruti", "Pavanputra"], []],
    ["Shiv (Kashi Vishwanath)", "North India", ["Vishwanath", "Shiv", "Shankar", "Kashinath"], ["Annapurna"]],
    ["Sheetla Mata", "North India", [], ["Sheetal", "Sheetla"]],

    // ---- East India
    ["Kali (Kalighat)", "West Bengal", [], ["Kali", "Kalika", "Shyama"]],
    ["Durga", "West Bengal", ["Durgadas"], ["Durga", "Uma", "Parvati"]],
    ["Jagannath (Puri)", "Odisha", ["Jagannath", "Jagadish", "Balabhadra"], ["Subhadra"]],
    ["Samaleswari", "Odisha", [], ["Samaleswari", "Samalei"]],
    ["Tarini", "Odisha", [], ["Tarini", "Tara"]],

    ["Other / not sure", "", [], []]
  ];

  /* Lineage names, grouped by the system a community actually uses.
   *
   * A closed dropdown was the obvious idea here and it does not survive contact
   * with the facts. There is no single list. An Agarwal family has eighteen
   * gotras and would be well served by a dropdown; a Jat family has over two
   * thousand; a Maratha family does not use rishi gotras at all and would
   * answer a question about "gotra" with a devak, which is a totem rather than
   * a lineage. A closed list would exclude most families and ask several of them
   * the wrong question.
   *
   * So this is a large grouped list with typo-tolerant matching, and free text
   * is still accepted. The community answer decides which group is offered
   * first and what the field is called.
   *
   * Worth keeping in proportion: for naming, this matters much less than the
   * birth details. Its jobs are being recited in the sankalpa and, in some
   * traditions, keeping the child off the gotra rishi's own name. A slight
   * misspelling costs almost nothing, unlike an hour of timezone. */
  var LINEAGE = {
    brahmin: { term: "Gotra", names: [
      "Bharadwaj", "Kashyap", "Vasishtha", "Vishwamitra", "Gautam", "Jamadagni",
      "Atri", "Agastya", "Angirasa", "Bhrigu", "Shandilya", "Kaushik", "Garg",
      "Parashara", "Sankhyayana", "Upamanyu", "Harita", "Kutsa", "Mudgala",
      "Vatsa", "Dhananjaya", "Kapi", "Kanva", "Maitreya", "Naidhruva",
      "Rathitara", "Shakti", "Somaraja", "Vishnuvriddha", "Yaska", "Sanaka",
      "Sanandana", "Moudgalya", "Gargya", "Lohita", "Kaundinya", "Srivatsa",
      "Badarayana", "Devarata", "Galava", "Jatukarnya", "Katyayana", "Paulastya",
      "Sadamarshana", "Shatamarshana", "Suryadhwaja", "Vadhula", "Aupagahani",
      "Pulastya", "Dalbhya", "Shaunaka", "Bhargava", "Ashvalayana", "Kapila",
      "Markandeya", "Pippalada", "Sankrithi", "Shalankayana", "Yajnavalkya",
      "Chikitasa", "Kaushitaki", "Maunas", "Savarna", "Uddalaka"
    ]},
    maratha: { term: "Kul or devak", names: [
      // the 96 kuls, and the devaks families more often name
      "Bhosale", "Jadhav", "Shinde", "Pawar", "More", "Shirke", "Kadam",
      "Salunkhe", "Chavan", "Gaikwad", "Ghatge", "Ghorpade", "Mane", "Nimbalkar",
      "Rane", "Sawant", "Surve", "Dalvi", "Mohite", "Bhapkar", "Dhumal",
      "Kokate", "Thorat", "Jagtap", "Nikam", "Palkar", "Raut", "Shelke",
      "Waghmare", "Ingle", "Kale", "Khedkar", "Mahadik", "Malusare", "Patankar",
      "Sankpal", "Bandal", "Deshmukh", "Kanhoji", "Phalke", "Yadav",
      "Devak: Kalamb", "Devak: Rui", "Devak: Umbar", "Devak: Panchpalvi",
      "Devak: Shankh", "Devak: Halad", "Devak: Nagvel", "Devak: Vasanvel",
      "Devak: Kavath", "Devak: Sonchapha", "Devak: Mor", "Devak: Garud",
      "Devak: Kasav", "Devak: Surya", "Devak: Bel", "Devak: Nandi"
    ]},
    agarwal: { term: "Gotra", names: [
      // the eighteen; this is the one community a dropdown would suit exactly
      "Garg", "Goyal", "Goenka", "Kansal", "Bansal", "Kuchhal", "Bindal",
      "Dharan", "Singhal", "Jindal", "Mittal", "Tingal", "Airan", "Tayal",
      "Bhandal", "Nangal", "Mangal", "Madhukul"
    ]},
    oswal: { term: "Gotra", names: [
      "Bafna", "Bhandari", "Chopra", "Golecha", "Kothari", "Lodha", "Mehta",
      "Nahar", "Parekh", "Sancheti", "Singhvi", "Surana", "Bothra", "Doshi",
      "Kasliwal", "Pagariya", "Ranka", "Sethi", "Shah", "Jhaveri", "Munot",
      "Patni", "Baid", "Chhajed", "Gadiya", "Jain", "Kataria", "Sisodia"
    ]},
    rajput: { term: "Clan", names: [
      "Chauhan", "Solanki", "Parmar", "Rathore", "Sisodia", "Tomar", "Bhati",
      "Kachwaha", "Gehlot", "Chandel", "Baghela", "Jadeja", "Jhala", "Gohil",
      "Dodiya", "Hada", "Khichi", "Dahiya", "Deora", "Mertia", "Bhadauria",
      "Nikumbh", "Pundir", "Katoch", "Bais", "Bundela", "Chudasama", "Vaghela",
      "Shekhawat", "Ranawat", "Sodha", "Jethwa"
    ]},
    jat: { term: "Gotra", names: [
      "Malik", "Chahal", "Dhillon", "Sidhu", "Gill", "Randhawa", "Sandhu",
      "Grewal", "Sekhon", "Brar", "Deol", "Bal", "Kang", "Mann", "Virk",
      "Beniwal", "Godara", "Dahiya", "Kadyan", "Sheoran", "Poonia", "Sihag",
      "Jakhar", "Bishnoi", "Tanwar", "Nain", "Lamba", "Bhukar", "Kaswan",
      "Dhaka", "Saharan", "Chhillar"
    ]},
    telugu: { term: "Intiperu (house name)", names: [
      "Marri", "Kandukuri", "Gundlapalli", "Nallamothu", "Pothuraju",
      "Yerragunta", "Chintalapudi", "Mallavarapu", "Vemuri", "Kolli",
      "Bhimavarapu", "Devarakonda", "Peddireddy", "Nallapaneni", "Kotamreddy"
    ]},
    kannada: { term: "Gotra or bedagu", names: [
      "Bharadwaj", "Kashyap", "Vishwamitra", "Gautam", "Hoysala", "Ganga",
      "Kadamba", "Nonaba", "Reddy", "Morasu", "Gangatkar", "Halumatha"
    ]},
    other: { term: "Gotra, kul or clan", names: [] }
  };

  /* Which lineage group to offer first, from the community answer. */
  var COMMUNITY_LINEAGE = {
    "Marathi": "maratha", "Konkani": "maratha",
    "Telugu": "telugu", "Kannada": "kannada",
    "Tamil": "brahmin", "Malayali": "brahmin",
    "Gujarati": "oswal", "Rajasthani": "rajput",
    "Punjabi": "jat", "Hindi belt": "agarwal",
    "Bengali": "brahmin", "Odia": "brahmin", "Sindhi": "other"
  };

  var ALL_LINEAGE = (function () {
    var seen = {}, out = [];
    Object.keys(LINEAGE).forEach(function (k) {
      LINEAGE[k].names.forEach(function (n) {
        var key = n.toLowerCase();
        if (seen[key]) return;
        seen[key] = 1;
        /* Devaks are stored with their label so the list reads clearly, but the
         * label must not be part of what is matched, or typing "Shankh" prefix-
         * matches nothing and loses to an unrelated gotra. */
        var match = n.indexOf(":") >= 0 ? n.slice(n.indexOf(":") + 1).trim() : n;
        out.push({ name: n, match: match, group: k });
      });
    });
    return out;
  })();

  /* Typo tolerance, which is the actual point of the request.
   *
   * Indian names romanise many ways, so the same lineage arrives as Bharadwaj,
   * Bhardwaj, Bharadwaja, Bhaaradwaaj or Bhardwaz. Two passes: a normalised
   * form that folds the usual transliteration variants, then a consonant
   * skeleton that ignores vowels entirely and catches the rest. */
  function norm(s) {
    return String(s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "")
      // diphthongs first, before w becomes v, or Gowtam never reaches Gautam
      .replace(/ow|ou|aw/g, "au")
      .replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u")
      .replace(/ii/g, "i").replace(/uu/g, "u")
      .replace(/w/g, "v").replace(/z/g, "j")
      .replace(/ksh/g, "x").replace(/sh/g, "s").replace(/th/g, "t")
      .replace(/ph/g, "f").replace(/ck/g, "k")
      .replace(/y$/, "i")
      .replace(/a$/, "");            // Bharadwaja and Bharadwaj are one name
  }
  /* The looser second pass. Drops aspiration as well as vowels, because
   * Jadhav and Jhadav are the same name with the h on the other consonant, and
   * no amount of vowel folding will connect them. Too aggressive to use for the
   * exact and prefix passes, exactly right as a fallback. */
  function skeleton(s) {
    return norm(s)
      .replace(/([bcdgjkptv])h/g, "$1")
      /* y counts as a vowel here. Goel and Goyal are both accepted spellings of
       * the same Agarwal gotra rather than one being a typo, and without this
       * they reduce to gl and gyl and never meet. */
      .replace(/[aeiouy]/g, "");
  }

  /* Pairs that are both standard spellings rather than one being a misspelling,
   * and that no folding rule can connect because a consonant genuinely differs.
   * Rathod and Rathore are the same Rajput clan; nothing about vowels or
   * aspiration gets you from rtd to rtr. */
  var LINEAGE_ALIASES = {
    rathod: "Rathore", rathaur: "Rathore", rathour: "Rathore",
    sisodiya: "Sisodia", gaekwad: "Gaikwad", gayakwad: "Gaikwad",
    bhonsle: "Bhosale", bhonsale: "Bhosale",
    scindia: "Shinde", sindhia: "Shinde",
    kacchwaha: "Kachwaha", kachhawa: "Kachwaha",
    getlot: "Gehlot", guhilot: "Gehlot",
    parmaar: "Parmar", pramar: "Parmar",
    chowhan: "Chauhan", chauhaan: "Chauhan",
    goenka: "Goyan", singhania: "Singhal",
    vashishth: "Vasishtha", vashishtha: "Vasishtha",
    aatreya: "Atreya", bhaardwaj: "Bharadwaj"
  };

  function isSubseq(a, b) {
    var i = 0;
    for (var j = 0; j < b.length && i < a.length; j++) if (b[j] === a[i]) i++;
    return i === a.length;
  }

  /* Ranked matches. The community's own group first, then everything else.
   * Always leaves room for the caller to offer the typed text as-is, because no
   * list of these can ever be complete. */
  function searchLineage(q, community, limit) {
    var nq = norm(q);
    if (!nq) return [];
    var sq = skeleton(q);
    var preferred = COMMUNITY_LINEAGE[community] || null;
    var out = [];

    // an explicit alias wins outright
    var alias = LINEAGE_ALIASES[norm(q)] || LINEAGE_ALIASES[String(q).toLowerCase().replace(/[^a-z]/g, "")];
    if (alias) {
      var hit = ALL_LINEAGE.filter(function (e) { return e.name === alias; })[0];
      if (hit) out.push({ name: hit.name, group: hit.group, rank: -1 });
    }

    ALL_LINEAGE.forEach(function (e) {
      var n = norm(e.match), sk = skeleton(e.match);
      var rank = null;
      if (n === nq) rank = 0;
      else if (n.indexOf(nq) === 0) rank = 1;
      else if (sk === sq) rank = 2;             // same consonants, different vowels
      else if (n.indexOf(nq) > 0) rank = 3;
      else if (sq.length >= 3 && sk.indexOf(sq) === 0) rank = 4;
      /* Last resort, for a dropped syllable rather than a misspelling: is the
       * typed skeleton a subsequence of the entry's? Badwaj reaches Bharadwaj
       * this way, which substring matching cannot do. Guarded to three or more
       * consonants and at most two missing, or it starts matching everything. */
      else if (sq.length >= 3 && sk.length - sq.length <= 2 && isSubseq(sq, sk)) rank = 5;
      /* And the other direction, for an inserted letter rather than a dropped
       * one. Kanshyap has a consonant Kashyap does not, so the entry's skeleton
       * is the subsequence here, not the query's. */
      else if (sk.length >= 3 && sq.length - sk.length <= 2 && isSubseq(sk, sq)) rank = 6;
      if (rank === null) return;
      if (alias && e.name === alias) return;          // already added above
      if (preferred && e.group === preferred) rank -= 0.5;
      out.push({ name: e.name, group: e.group, rank: rank });
    });

    /* Ties on the skeleton pass are common, because dropping vowels makes
     * Shinde and Sandhu identical. Break them on how much of the front of the
     * word actually agrees, which puts Shinday on Shinde rather than on an
     * unrelated Jat gotra that happens to share three consonants. */
    function shared(a) {
      var n = norm(a), i = 0;
      while (i < n.length && i < nq.length && n[i] === nq[i]) i++;
      return i;
    }
    out.forEach(function (o) { o.pre = shared(o.name.indexOf(":") >= 0
      ? o.name.slice(o.name.indexOf(":") + 1).trim() : o.name); });
    out.sort(function (a, b) {
      return a.rank - b.rank || b.pre - a.pre ||
        a.name.length - b.name.length || a.name.localeCompare(b.name);
    });
    return out.slice(0, limit || 8);
  }

  // what to call the field, given the community
  function lineageTerm(community) {
    var g = COMMUNITY_LINEAGE[community];
    return (g && LINEAGE[g]) ? LINEAGE[g].term : LINEAGE.other.term;
  }
  function lineageCount() { return ALL_LINEAGE.length; }

  /* The shanti commonly prescribed for each dosha, and when it is usually done.
   *
   * This is deliberately informational. Naming the rite lets a family raise it
   * with their priest early, which is the whole point of flagging a dosha at
   * all. What it does not do is describe the vidhi, fix the sankalpa or say the
   * rite is required, because those depend on the family's sampradaya and veda
   * shakha and are genuinely his to decide. */
  var SHANTI = {
    mula: {
      name: "Mula shanti",
      when: "Usually on the 27th day, when the Moon returns to Mula, or at a " +
        "muhurta your priest chooses before the naming.",
      note: "Many families perform it only for a birth in the first pada. Ask him " +
        "which reading yours follows."
    },
    gandanta: {
      name: "Gandanta shanti",
      when: "Before the naming rite, commonly with an abhisheka.",
      note: "Practice at the water-fire junction varies more than for the other " +
        "cases, so this is worth raising early rather than on the day."
    },
    ashlesha: {
      name: "Ashlesha shanti",
      when: "Before the naming rite. Some traditions combine it with a Naga " +
        "puja.",
      note: "More often prescribed for the later padas than the earlier ones."
    },
    jyeshtha: {
      name: "Jyeshtha shanti",
      when: "Before the naming rite.",
      note: "In most traditions this is only considered for an eldest child, " +
        "which is why we ask."
    },
    abhukta: {
      name: "Abhukta Mula shanti",
      when: "Before the naming rite, and treated more seriously than Mula alone.",
      note: "The junction of Jyeshtha into Mula. Raise this with your priest as " +
        "soon as you can."
    }
  };

  /* Where a name-carrying convention is the norm rather than the exception. A
   * Maharashtrian or Telugu family may have no choice about the grandfather's
   * name, and a site that suggests freely without asking wastes their time. */
  var COMMUNITY = [
    ["Marathi", "Grandparent's name is often carried forward, sometimes modernised."],
    ["Tamil", "Father's and village initials commonly precede the given name."],
    ["Telugu", "Grandparent's name is often repeated exactly."],
    ["Kannada", "Grandparent's name is common; initials sometimes used."],
    ["Malayali", "Family name follows; grandparent's name often carried."],
    ["Gujarati", "Father's name is used as the middle name."],
    ["Rajasthani", "Grandparent's name sometimes carried."],
    ["Punjabi", "Given name plus Singh or Kaur; carrying is less common."],
    ["Bengali", "A formal name and a household daak-naam are both given."],
    ["Odia", "Grandparent's name sometimes carried."],
    ["Hindi belt", "No strong carrying convention."],
    ["Sindhi", "Grandparent's name sometimes carried."],
    ["Konkani", "Grandparent's name often carried."],
    ["Other / not sure", ""]
  ];

  function byName(list, name) {
    var f = String(name || "").toLowerCase().trim();
    for (var i = 0; i < list.length; i++) {
      if (String(list[i][0]).toLowerCase() === f) return list[i];
    }
    return null;
  }

  /* The devata-nama for a chosen deity and gender. This is the row of the
   * traditional set that used to read "we cannot know". */
  function devataNama(deityName, gender) {
    var d = byName(DEVATA, deityName);
    if (!d) return null;
    var boys = d[2] || [], girls = d[3] || [];
    var pool = gender === "girl" ? girls : gender === "boy" ? boys
      : boys.concat(girls);
    if (!pool.length) {
      // a deity we hold but have no epithet list for: say so rather than guess
      return { deity: d[0], region: d[1], names: [], note: "unlisted" };
    }
    return { deity: d[0], region: d[1], names: pool.slice(), note: null };
  }

  /* Which shanti entries apply to the doshas panchang.js flagged, filtered by
   * whether this is the eldest child where that matters. */
  function shantiFor(doshas, isEldest) {
    if (!doshas || !doshas.length) return [];
    var out = [];
    doshas.forEach(function (d) {
      var s = SHANTI[d.key];
      if (!s) return;
      if (d.key === "jyeshtha" && isEldest === false) return;
      out.push({
        key: d.key, label: d.label, shanti: s.name,
        when: s.when, note: s.note
      });
    });
    return out;
  }

  /* Turns the answers into constraints the name generator can actually use, and
   * says which of them came from the family rather than from the sky. */
  function constraints(f) {
    var c = { hard: [], soft: [], avoid: [] };
    if (!f) return c;

    if (f.carryName) {
      c.hard.push({
        kind: "carry",
        text: "Must honour the name " + f.carryName +
          " — the same name, a modern form of it, or a name of the same deity."
      });
    }
    if (f.aksharaSource === "rashi") {
      c.hard.push({ kind: "akshara", text: "Use the rashi akshara, not the pada syllable." });
    } else if (f.aksharaSource === "either") {
      c.soft.push({ kind: "akshara", text: "Either the pada syllable or the rashi akshara is acceptable." });
    }
    if (f.deity && f.deity !== "Other / not sure") {
      c.soft.push({ kind: "deity", text: "Names of " + f.deity + " are welcome." });
    }
    if (f.community && f.community !== "Other / not sure") {
      var com = byName(COMMUNITY, f.community);
      c.soft.push({
        kind: "community",
        text: f.community + " naming conventions." + (com && com[1] ? " " + com[1] : "")
      });
    }
    if (f.avoidNames) {
      String(f.avoidNames).split(/[,;\n]/).forEach(function (n) {
        var t = n.trim();
        if (t) c.avoid.push(t);
      });
    }
    if (f.gotra) {
      // some traditions avoid giving the child the name of the gotra rishi
      c.avoid.push(f.gotra);
      c.soft.push({
        kind: "gotra",
        text: "Gotra " + f.gotra + ", so the rishi's own name is usually not given."
      });
    }
    if (f.initials) {
      c.soft.push({ kind: "initials", text: "Initials convention: " + f.initials });
    }
    return c;
  }

  /* What goes on the printed sheet for the sankalpa. He recites the lineage, so
   * having it written down saves him asking on the day. */
  function sankalpa(f) {
    if (!f) return [];
    var rows = [];
    if (f.fatherName) rows.push(["Father", f.fatherName]);
    if (f.motherName) rows.push(["Mother", f.motherName]);
    if (f.gotra) rows.push(["Gotra", f.gotra]);
    if (f.deity && f.deity !== "Other / not sure") rows.push(["Kula devata", f.deity]);
    if (f.subcommunity && f.subcommunity !== "Other / not sure")
      rows.push(["Sub-community", f.subcommunity]);
    if (f.sutra) rows.push(["Sutra", f.sutra]);
    if (f.vedaShakha && f.vedaShakha !== "Not sure" && f.vedaShakha !== "Not applicable")
      rows.push(["Veda shakha", f.vedaShakha]);
    if (f.sampradaya && f.sampradaya !== "Not sure") rows.push(["Sampradaya", f.sampradaya]);
    if (f.community && f.community !== "Other / not sure") rows.push(["Community", f.community]);
    return rows;
  }

  /* Sub-community, and why it replaced two dropdowns nobody could answer.
   *
   * Asking a family for their veda shakha was a design mistake. Most people do
   * not know it: it lives in the sankalpa their priest recites and in their
   * grandparents' memory, not in anything they carry. Worse, many families do
   * not have one at all -- it is a ritual identity of dvija families, so a
   * Maratha or Jat family faced with that dropdown is being asked the wrong
   * question, and an empty select implies they ought to have an answer.
   *
   * The sub-community is the question people can actually answer, and it
   * usually implies the other two. "Deshastha Rigvedi" names the veda in its
   * own title. So the shakha and sampradaya are now derived and shown as
   * likely, for the family to confirm or overwrite.
   *
   * These correlations are real but not absolute, which is why nothing here is
   * ever presented as fact. And neither field changes a single name: they exist
   * so the sankalpa lines on the printed sheet are already filled in. Blank is
   * a perfectly good answer. */
  var SUBCOMMUNITY = {
    "Marathi": [
      ["Deshastha Rigvedi", "Rigveda", "Smarta"],
      ["Deshastha Yajurvedi", "Yajurveda (Krishna)", "Smarta"],
      ["Deshastha Madhwa", "Rigveda", "Madhwa"],
      ["Chitpavan / Konkanastha", "Rigveda", "Smarta"],
      ["Karhade", "Rigveda", "Smarta"],
      ["Devrukhe", "Rigveda", "Smarta"],
      ["Gaud Saraswat", "Rigveda", "Madhwa"],
      ["Maratha", "", "Warkari"],
      ["Kunbi", "", ""],
      ["CKP (Chandraseniya Kayastha Prabhu)", "", "Smarta"],
      ["Other / not sure", "", ""]
    ],
    "Konkani": [
      ["Gaud Saraswat", "Rigveda", "Madhwa"],
      ["Chitrapur Saraswat", "Rigveda", "Smarta"],
      ["Rajapur Saraswat", "Rigveda", "Smarta"],
      ["Other / not sure", "", ""]
    ],
    "Tamil": [
      ["Iyer (Vadama)", "Yajurveda (Krishna)", "Smarta"],
      ["Iyer (Brahacharanam)", "Yajurveda (Krishna)", "Smarta"],
      ["Iyer (Vathima)", "Yajurveda (Krishna)", "Smarta"],
      ["Iyengar (Vadakalai)", "Yajurveda (Krishna)", "Sri Vaishnava"],
      ["Iyengar (Thenkalai)", "Yajurveda (Krishna)", "Sri Vaishnava"],
      ["Other / not sure", "", ""]
    ],
    "Telugu": [
      ["Vaidiki", "Yajurveda (Krishna)", "Smarta"],
      ["Niyogi", "Yajurveda (Krishna)", "Smarta"],
      ["Telugu Vaishnava", "Yajurveda (Krishna)", "Sri Vaishnava"],
      ["Other / not sure", "", ""]
    ],
    "Kannada": [
      ["Madhwa (Deshastha)", "Rigveda", "Madhwa"],
      ["Smarta (Havyaka)", "Rigveda", "Smarta"],
      ["Sri Vaishnava", "Yajurveda (Krishna)", "Sri Vaishnava"],
      ["Lingayat", "", "Lingayat"],
      ["Other / not sure", "", ""]
    ],
    "Malayali": [
      ["Nambudiri", "Rigveda", "Smarta"],
      ["Nair", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Gujarati": [
      ["Nagar", "Yajurveda (Shukla)", "Smarta"],
      ["Audichya", "Yajurveda (Shukla)", "Smarta"],
      ["Pushtimarg / Vallabha", "", "Pushtimarg"],
      ["Swaminarayan", "", "Swaminarayan"],
      ["Jain", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Rajasthani": [
      ["Pushkarna", "Yajurveda (Shukla)", "Smarta"],
      ["Gaur", "Yajurveda (Shukla)", "Smarta"],
      ["Rajput", "", ""],
      ["Agarwal", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Hindi belt": [
      ["Kanyakubja", "Yajurveda (Shukla)", "Smarta"],
      ["Saryupareen", "Yajurveda (Shukla)", "Smarta"],
      ["Maithil", "Yajurveda (Shukla)", "Smarta"],
      ["Gaur", "Yajurveda (Shukla)", "Smarta"],
      ["Kayastha", "", ""],
      ["Agarwal", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Bengali": [
      ["Rarhi", "Yajurveda (Shukla)", "Shakta"],
      ["Barendra", "Yajurveda (Shukla)", "Shakta"],
      ["Vaidya", "", ""],
      ["Kayastha", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Odia": [
      ["Utkala", "Yajurveda (Shukla)", "Smarta"],
      ["Other / not sure", "", ""]
    ],
    "Punjabi": [
      ["Saraswat Brahmin", "Yajurveda (Shukla)", "Smarta"],
      ["Khatri", "", ""],
      ["Jat", "", ""],
      ["Other / not sure", "", ""]
    ],
    "Sindhi": [["Other / not sure", "", ""]]
  };

  /* The kula devata is a second, independent signal for the sampradaya, and
   * often a clearer one than sub-community: a family whose deity is Vitthal is
   * almost certainly Warkari whatever else they call themselves. */
  var DEITY_SAMPRADAYA = {
    // ---- Shaiva
    "Manjunatha (Dharmasthala)": "Shaiva", "Nataraja (Chidambaram)": "Shaiva",
    "Eklingji": "Shaiva", "Shiv (Kashi Vishwanath)": "Shaiva",
    "Jyotiba": "Shaiva", "Bhairavnath": "Shaiva",
    /* Khandoba is Martanda Bhairava, a form of Shiva, whatever the folk layer
     * around him at Jejuri. */
    "Khandoba": "Shaiva",
    "Ayyappan (Sabarimala)": "Shaiva", "Ayyappan": "Shaiva",

    // ---- Kaumaram, the Murugan tradition, which Tamil families do name
    "Murugan (Palani)": "Kaumaram", "Subrahmanya": "Kaumaram",

    // ---- Ganapatya
    "Ganpati (Ashtavinayak)": "Ganapatya",

    // ---- Shakta. Most kula devatas in India are goddesses, so this is the
    //      largest group by some distance.
    "Kali (Kalighat)": "Shakta", "Durga": "Shakta",
    "Tuljapur Bhavani": "Shakta", "Kanaka Durga (Vijayawada)": "Shakta",
    "Chamundeshwari": "Shakta", "Ambaji": "Shakta",
    "Renuka (Mahur)": "Shakta", "Mahalaxmi (Kolhapur)": "Shakta",
    "Saptashrungi": "Shakta", "Ekvira": "Shakta", "Kalubai": "Shakta",
    "Banashankari": "Shakta", "Durgaparameshwari (Kateel)": "Shakta",
    "Yellamma (Saundatti)": "Shakta", "Ankamma": "Shakta",
    "Meenakshi (Madurai)": "Shakta", "Kamakshi (Kanchi)": "Shakta",
    "Mariamman": "Shakta", "Bhagavathi": "Shakta",
    "Khodiyar": "Shakta", "Bahuchara": "Shakta", "Ashapura": "Shakta",
    "Umiya": "Shakta", "Karni Mata": "Shakta", "Jeen Mata": "Shakta",
    "Vaishno Devi": "Shakta", "Vindhyavasini": "Shakta",
    "Sheetla Mata": "Shakta", "Samaleswari": "Shakta", "Tarini": "Shakta",

    // ---- Sri Vaishnava
    "Venkateshwara (Tirumala)": "Sri Vaishnava",
    "Perumal (Srirangam)": "Sri Vaishnava",
    "Narasimha (Ahobilam)": "Sri Vaishnava",

    // ---- Pushtimarg
    "Shrinathji (Nathdwara)": "Pushtimarg", "Dwarkadhish": "Pushtimarg",

    // ---- Vaishnava more broadly
    "Jagannath (Puri)": "Vaishnava", "Guruvayurappan": "Vaishnava",
    "Krishna (Mathura)": "Vaishnava", "Vitthal (Pandharpur)": "Warkari",
    "Ram (Ayodhya)": "Ramanandi",
    "Hanuman": "Vaishnava", "Anjaneya": "Vaishnava",
    "Salasar Balaji": "Vaishnava",

    // ---- Datta
    "Datta (Ganagapur)": "Datta sampradaya"
  };

  /* Grihya sutra to Veda, and why this is asked instead of the shakha.
   *
   * A priest recites gotra, sutra and shakha in one breath -- "<gotra>
   * gotrotpannaha, <sutra> sutraha, <shakha> shakhadhyayi" -- so a family who
   * has heard their own sankalpa has heard the sutra as often as the shakha.
   * And each grihya sutra belongs to exactly one Veda, so the sutra settles the
   * shakha outright rather than merely suggesting it.
   *
   * That makes it a strictly better question: a shorter closed list, a
   * deterministic answer, and Apastamba is a word families recognise where
   * "Krishna Yajurveda" often is not.
   *
   * Note what does NOT help here. The kula devata predicts the sampradaya well
   * and the veda shakha not at all: the shakha is inherited through the paternal
   * line and has nothing to do with which deity a family worships. A Shaiva and
   * a Vaishnava family can both be Rigvedi. */
  var SUTRA_VEDA = {
    "Ashvalayana": "Rigveda",
    "Shankhayana": "Rigveda",
    "Apastamba": "Yajurveda (Krishna)",
    "Baudhayana": "Yajurveda (Krishna)",
    "Hiranyakeshi (Satyashadha)": "Yajurveda (Krishna)",
    "Bharadwaja (sutra)": "Yajurveda (Krishna)",
    "Vaikhanasa": "Yajurveda (Krishna)",
    "Katyayana": "Yajurveda (Shukla)",
    "Paraskara": "Yajurveda (Shukla)",
    "Gobhila": "Samaveda",
    "Drahyayana": "Samaveda",
    "Khadira": "Samaveda",
    "Jaimini": "Samaveda",
    "Kaushika": "Atharvaveda",
    "Vaitana": "Atharvaveda"
  };

  function sutras() { return Object.keys(SUTRA_VEDA); }

  var VEDA = ["Rigveda", "Yajurveda (Shukla)", "Yajurveda (Krishna)", "Samaveda",
    "Atharvaveda", "Not applicable", "Not sure"];
  var SAMPRADAYA = ["Smarta", "Sri Vaishnava", "Madhwa", "Vaishnava", "Shaiva",
    "Shakta", "Kaumaram", "Ganapatya", "Lingayat", "Warkari", "Ramanandi",
    "Pushtimarg", "Swaminarayan", "Gaudiya Vaishnava", "Nath",
    "Datta sampradaya", "Not sure"];

  function subcommunities(community) {
    return (SUBCOMMUNITY[community] || []).map(function (r) { return r[0]; });
  }

  /* What we think the shakha and sampradaya probably are, and how confident to
   * sound about it. Never written straight into the field as though known. */
  function inferLineageDetail(community, subcommunity, deity, sutra) {
    var out = { veda: "", vedaWhy: "", vedaCertain: false,
      sampradaya: "", sampradayaWhy: "", conflict: null };
    var rows = SUBCOMMUNITY[community] || [];
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] === subcommunity) {
        if (rows[i][1]) { out.veda = rows[i][1]; out.vedaWhy = subcommunity; }
        if (rows[i][2]) { out.sampradaya = rows[i][2]; out.sampradayaWhy = subcommunity; }
        break;
      }
    }
    /* A named deity beats a sub-community guess for the sampradaya, because
     * devotional practice is what the word describes. */
    if (deity && DEITY_SAMPRADAYA[deity]) {
      out.sampradaya = DEITY_SAMPRADAYA[deity];
      out.sampradayaWhy = deity;
    }

    /* The sutra beats everything for the veda, because it is not a correlation:
     * each grihya sutra belongs to one Veda and only one. If it disagrees with
     * what the sub-community implied, say so instead of quietly picking a side --
     * one of the two answers is wrong and the family can settle it. */
    if (sutra && SUTRA_VEDA[sutra]) {
      var fromSutra = SUTRA_VEDA[sutra];
      if (out.veda && out.veda !== fromSutra && out.veda !== "Not applicable") {
        out.conflict = { fromSub: out.veda, sub: out.vedaWhy, fromSutra: fromSutra, sutra: sutra };
      }
      out.veda = fromSutra;
      out.vedaWhy = sutra;
      out.vedaCertain = true;
    }
    /* Communities that do not use a veda shakha should be told so rather than
     * shown a blank dropdown they will feel obliged to fill. */
    if (!out.veda && subcommunity && subcommunity !== "Other / not sure") {
      out.veda = "Not applicable";
      out.vedaWhy = subcommunity;
    }
    return out;
  }

  var api = {
    DEVATA: DEVATA, COMMUNITY: COMMUNITY, SHANTI: SHANTI,
    LINEAGE: LINEAGE, LINEAGE_ALIASES: LINEAGE_ALIASES, searchLineage: searchLineage, lineageTerm: lineageTerm,
    lineageCount: lineageCount, normLineage: norm,
    VEDA: VEDA, SAMPRADAYA: SAMPRADAYA,
    SUBCOMMUNITY: SUBCOMMUNITY, DEITY_SAMPRADAYA: DEITY_SAMPRADAYA,
    subcommunities: subcommunities, inferLineageDetail: inferLineageDetail,
    SUTRA_VEDA: SUTRA_VEDA, sutras: sutras,
    deitySampradayaCount: Object.keys(DEITY_SAMPRADAYA).length,
    devataNama: devataNama, shantiFor: shantiFor,
    constraints: constraints, sankalpa: sankalpa,
    deityCount: DEVATA.length - 1
  };
  if (typeof globalThis !== "undefined") globalThis.Family = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
