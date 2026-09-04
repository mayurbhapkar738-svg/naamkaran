/* Naamkaran — about
 *
 * Two axes. Language, and how the tradition actually works.
 *
 * The second matters more than it looks. A Christian family has no birth star
 * computed, so showing them a column headed "the birth star is calculated" and
 * a table comparing us to a pandit is not merely irrelevant, it misdescribes
 * what the site did for them. So the sections themselves switch on the
 * tradition's engine, not just the paragraph naming it:
 *
 *   panchang  Hindu, Jain, Buddhist   full birth-star reckoning
 *   hijri     Muslim                  Islamic date and the aqiqah day
 *   given     Sikh                    the family brings the letter
 *   none      Christian, Parsi, Jewish, and no tradition
 *
 * Every string a family reads is keyed by language. English is the fallback for
 * anything missing, and get() resolves it, so a partial translation degrades to
 * mixed language rather than to blanks.
 *
 * The Hindi and Marathi below is careful but was not written by a native
 * speaker. It should be read by one before this is put in front of families,
 * particularly the passages about religious practice, where a clumsy word
 * choice would be worse than English.
 */
(function () {
  "use strict";

  var L = {};

  // ------------------------------------------------------------------ ENGLISH
  L.en = {
    method: {
      "Hindu": {
            "body": "Give us the date, time and place of birth. We work out the nakshatra and the sound the name should start with, read the panchang for that moment, and check whether the birth is one of the few that traditionally needs a prayer before the naming.",
            "asks": [
                  "Date of birth",
                  "Time of birth",
                  "Place of birth"
            ],
            "gives": [
                  "Nakshatra and starting sound",
                  "Rashi and panchang",
                  "Anything that needs a prayer",
                  "Good days for the ceremony",
                  "A page to print"
            ]
      },
      "Jain": {
            "body": "The calculation is the same as the Hindu one. The names come from the Tirthankaras and the virtues rather than the Puranic deities.",
            "asks": [
                  "Date of birth",
                  "Time of birth",
                  "Place of birth"
            ],
            "gives": [
                  "Nakshatra and starting sound",
                  "Panchang",
                  "A page to print"
            ]
      },
      "Buddhist": {
      "body": "Names from Pali forms, the paramitas and the virtues, with their meanings. Buddhist families do not usually consult a Hindu pandit, so no birth star is worked out and we do not ask when your baby was born.",
      "asks": [
            "Nothing about the birth time"
      ],
      "gives": [
            "Names with meanings",
            "Pali and Sanskrit roots"
      ]
},
      "Sikh": {
            "body": "Tell us the letter you were given and we will find names on it. Most Sikh names suit a child of either sex, and Singh or Kaur goes after the name you choose.",
            "asks": [
                  "The letter from your Hukamnama"
            ],
            "gives": [
                  "Names on that letter",
                  "Meanings and Gurmukhi spelling"
            ]
      },
      "Muslim": {
            "body": "From the date of birth we work out the Islamic date and the aqiqah day. Names come from the Asma-ul-Husna and classical Arabic, with the Abd-al forms handled properly.",
            "asks": [
                  "Date of birth"
            ],
            "gives": [
                  "Islamic date of birth",
                  "Aqiqah days",
                  "Names with Arabic meanings"
            ],
            "caveat": "Our Islamic date comes from calendar arithmetic and can differ by a day from the local moon sighting. Please confirm with your mosque before fixing the aqiqah."
      },
      "Christian": {
            "body": "We give the meaning and origin of each name, and how it is usually said. Nothing is calculated from the birth time.",
            "asks": [
                  "Nothing about the birth time"
            ],
            "gives": [
                  "Names with meanings",
                  "Where each name comes from"
            ],
            "planned": "Naming for the saint whose feast day falls on the birthday is real practice in Goa and Kerala. It needs a properly checked calendar, so we would rather not guess at it yet."
      },
      "Parsi": {
            "body": "Names from the Amesha Spentas, the Yazatas and the Shahnameh, with their Avestan and Persian meanings.",
            "asks": [
                  "Nothing about the birth time"
            ],
            "gives": [
                  "Avestan and Persian names",
                  "Meanings"
            ]
      },
      "Jewish": {
            "body": "Hebrew names with their meanings, including the forms used by the Bene Israel and Cochin communities.",
            "asks": [
                  "Nothing about the birth time"
            ],
            "gives": [
                  "Hebrew names",
                  "Meanings"
            ],
            "planned": "Some families name a baby after a relative who has passed away, others after a living one. The two customs point opposite ways, so we plan to ask which yours follows."
      },
      "No tradition": {
            "body": "Names chosen for what they mean and how they sound, with a note on how each one travels.",
            "asks": [
                  "Nothing about the birth time"
            ],
            "gives": [
                  "Names with meanings",
                  "How the name travels"
            ]
      }
},
    heading: "How this works",

    intro: {
      panchang: {
        lead: "Tell us when and where your baby was born.",
        body: "We work out the birth star \u2014 where the moon was at that exact " +
          "moment \u2014 and the sound your baby's name should begin with. Then we " +
          "suggest names that fit, with their meanings. It takes about a minute and " +
          "costs nothing."
      },
      hijri: {
        lead: "Tell us the date your baby was born.",
        body: "We work out the Islamic date and when the aqiqah falls. Then we " +
          "suggest names from the Asma-ul-Husna and classical Arabic, with their " +
          "meanings. It takes about a minute and costs nothing."
      },
      given: {
        lead: "Tell us the letter you were given at the Gurdwara.",
        body: "We find names beginning with that letter, with their meanings and " +
          "Gurmukhi spelling. We do not calculate anything from the birth time, and " +
          "we do not pretend to take a Hukamnama."
      },
      none: {
        lead: "Tell us what you are looking for in a name.",
        body: "We suggest names with their meanings, where each one comes from, and " +
          "how it is likely to be said. Nothing is calculated from the birth time."
      }
    },

    split: {
      panchang: {
        left: {
          title: "The birth star is calculated",
          note: "This is maths, not guesswork. The same birth details always give " +
            "the same answer.",
          items: ["Which nakshatra your baby was born under",
            "The sound the name should start with",
            "Your baby's rashi, and the panchang for that day",
            "Whether the birth falls on one of the few days that needs a prayer first",
            "Good days for the naming ceremony",
            "A page you can print and show your {officiant}"]
        },
        right: {
          title: "The names are suggested",
          note: "These come from an AI. They are ideas to choose from, not the last " +
            "word. Do check the meaning of any name you fall in love with.",
          items: ["The names themselves", "What each name means",
            "How to say it, and how it sounds beside a sibling's name"]
        }
      },
      hijri: {
        left: {
          title: "The dates are calculated",
          note: "Calendar arithmetic, not guesswork. The same date of birth always " +
            "gives the same answer.",
          items: ["The Islamic date of your baby's birth",
            "The seventh day, for the aqiqah",
            "The fourteenth and twenty-first, if the seventh passes"]
        },
        right: {
          title: "The names are suggested",
          note: "These come from an AI. They are ideas to choose from, not the last " +
            "word. Do check the meaning of any name you fall in love with.",
          items: ["The names themselves", "The Arabic root and what it means",
            "Whether a name takes the Abd-al form correctly"]
        }
      },
      given: {
        left: {
          title: "Nothing is calculated",
          note: "The letter is yours. It comes from the Vak your family took at the " +
            "Gurdwara, and we would not presume to produce one.",
          items: ["We take the letter you give us and nothing else"]
        },
        right: {
          title: "The names are suggested",
          note: "These come from an AI. They are ideas to choose from, not the last " +
            "word. Do check the meaning of any name you fall in love with.",
          items: ["Names on your letter", "What each name means",
            "Gurmukhi spelling", "Singh or Kaur goes after the name you choose"]
        }
      },
      none: {
        left: {
          title: "Nothing is calculated",
          note: "This tradition does not tie a name to the birth moment, so we do " +
            "not ask for one and we do not work anything out from it.",
          items: ["Your baby's date and time of birth are not needed"]
        },
        right: {
          title: "The names are suggested",
          note: "These come from an AI. They are ideas to choose from, not the last " +
            "word. Do check the meaning of any name you fall in love with.",
          items: ["The names themselves", "What each name means",
            "Where the name comes from", "How it is likely to be said"]
        }
      }
    },

    vsHeading: "Why not just ask a chatbot",
    vs: {
      panchang: [
        ["A chatbot guesses. Ask it twice and you can get two different answers.",
          "It has not looked anything up \u2014 it writes the kind of reply that fits " +
          "the question. We actually calculate where the moon was, so the answer does " +
          "not change."],
        ["You get something you can show your {officiant}.",
          "We print one page with your baby's birth details and everything we worked " +
          "out from them. Hand it over and let him check it. A chat window just gives " +
          "you an answer and asks you to trust it."],
        ["We tell you when we are not certain.",
          "Sometimes a birth falls right on the line between two sounds. When that " +
          "happens we say so, and tell you to confirm with your {officiant}. A chatbot has " +
          "no idea it is near a line."]
      ],
      hijri: [
        ["A chatbot guesses at dates. Ask it twice and you can get two different ones.",
          "We work the Islamic date out by calendar arithmetic, so it does not change " +
          "between one asking and the next."],
        ["We tell you where our date can be wrong.",
          "Our calendar is arithmetic, and a local moon sighting can fall a day either " +
          "side of it. We say so, and tell you to confirm with your mosque. A chatbot " +
          "will simply give you a date."]
      ],
      given: [
        ["We will not produce a Hukamnama, and a chatbot will.",
          "Ask a chatbot for a letter for your baby and it will give you one. It has " +
          "not opened anything. That letter belongs to your family and the Gurdwara, " +
          "so we ask you for it instead of inventing it."]
      ],
      none: [
        ["A chatbot will invent an origin and sound sure of it.",
          "Made-up etymology is the most common thing they get wrong, because a " +
          "plausible root reads exactly like a real one. We can be wrong here too, " +
          "which is why we say so plainly rather than sounding certain."]
      ],
      universal: [
        ["Your baby's details stay on your phone.",
          "Nothing you enter is sent anywhere. It all happens right there in your " +
          "browser."],
        ["It is free, and it stays free.",
          "There is no account, no payment, and nothing is sold. Name suggestions are " +
          "limited some days because they cost us money to produce."]
      ]
    },

    panditHeading: "What a {officiant} does",
    pandit: {
      intro: "We do the same working a {officiant} does, in the same order. Here is what " +
        "we cover, and where you still need him.",
      him: "A {officiant}", us: "This page",
      tags: { done: "we do this", part: "mostly", no: "he does this" },
      rows: [
        ["Writes down the exact time and place of birth",
          "Same. We also work out the right timezone for you, even for older births.", "done"],
        ["Works out where the moon was at that moment",
          "Same, using astronomy software.", "done"],
        ["Finds the nakshatra and the starting sound",
          "Same. If your family uses the rashi instead, we show that too.", "done"],
        ["Reads the panchang for the day", "Same.", "done"],
        ["Checks whether the birth needs a prayer first",
          "We flag it clearly, so you can raise it with him early.", "done"],
        ["Picks a good day for the naming ceremony",
          "We suggest the clear days, and say why the others are not.", "done"],
        ["Gives the traditional set of names",
          "All four, once you tell us your kula devata.", "done"],
        ["Knows your family deity, your gotra, and what your elders will accept",
          "We ask for the deity, the gotra, the name you must carry forward and the names to avoid. Whether your elders agree is still theirs.", "part"],
        ["Decides which prayer to perform, and when",
          "We name the shanti usually prescribed and when it is done, so you can raise it early. What is actually performed is his.", "part"]
      ]
    },

    methodHeading: "What happens for your family",
    asks: "What we need from you",
    gives: "What you get",

    honestHeading: "Worth knowing",
    honest: {
      panchang: [
        ["We are not a replacement for your {officiant}",
          "We do his arithmetic quickly and hand you the working. He knows your " +
            "family, and we do not."],
        ["Meanings are the weakest part",
          "The names and their meanings come from an AI. Please check any name you are " +
            "serious about with someone who knows the language."],
        ["The birth time you were given matters most",
          "Everything rests on it. Being a few minutes out moves the answer more than " +
            "anything else on this page."]
      ],
      hijri: [
        ["Confirm the date with your mosque",
          "Our Islamic date comes from calendar arithmetic, and the moon sighting where " +
            "you are can differ by a day. Please check before fixing the aqiqah."],
        ["Meanings are the weakest part",
          "The names and their meanings come from an AI. Please check any name you are " +
            "serious about with someone who knows Arabic."]
      ],
      given: [
        ["The letter has to come from you",
          "We cannot and will not take a Vak for you. If you have not been to the " +
            "Gurdwara yet, come back afterwards."],
        ["Meanings are the weakest part",
          "The names and their meanings come from an AI. Please check any name you are " +
            "serious about with someone who reads Gurmukhi."]
      ],
      none: [
        ["Meanings are the weakest part",
          "The names and their meanings come from an AI. Please check any name you are " +
            "serious about with someone who knows the language."],
        ["Nothing here is a ruling",
          "These are suggestions to talk over with your family. Whatever your elders " +
            "and your own ear settle on is the right name."]
      ]
    },

    detail: {
      title: "For anyone who wants to check our method",
      blocks: {
        panchang: [
          ["What we compute, and how",
            "The moon's position comes from the ELP2000-82 lunar theory as set out in " +
              "Meeus, Astronomical Algorithms, chapter 47, and the sun's from chapter " +
              "25. Positions are converted to sidereal longitude with the Lahiri " +
              "(Chitrapaksha) ayanamsa, which is what Indian panchangs and the " +
              "government almanac use. Nakshatra and pada follow from the moon's " +
              "sidereal longitude, corrected for parallax at your birthplace. Tithi, " +
              "vaara, yoga and karana are derived geocentrically as published " +
              "panchangs do, and the vaara is reckoned sunrise to sunrise rather than " +
              "from midnight."],
          ["How accurate it is",
            "Solar longitude reproduces the 2024 equinoxes and solstices to better " +
              "than 0.006 degrees. Sun-moon elongation matches five published new and " +
              "full moons to better than 0.007 degrees. Sunrise matches published " +
              "times at six places from 13N to 51N within one to three minutes."],
          ["Where another method would disagree",
            "Within a few minutes of a pada boundary, a different ayanamsa \u2014 " +
              "Raman, Krishnamurti, True Chitra \u2014 can land on the neighbouring " +
              "pada. The sheet states how many minutes the birth sits from the nearest " +
              "boundary. Where this and your family priest differ, he has the last word."],
          ["Why we ask for a PIN code",
            "A valid Indian PIN code cannot land in the wrong country, which is the " +
              "only error worth fearing: a timezone wrong by an hour shifts about one " +
              "birth in six by a pada, a wrong country shifts all of them. Being 50 km " +
              "out shifts about one in a thousand, so a PIN's 5-25 km footprint is far " +
              "finer than anything downstream can detect. The timezone, including " +
              "historical offsets such as India's +6:30 during 1943-44, is derived from " +
              "the place and the date."]
        ],
        hijri: [
          ["The Islamic calendar",
            "Gregorian to Hijri conversion uses the tabular (civil) Islamic calendar. " +
              "It is arithmetic rather than observational, and can differ from a local " +
              "moon sighting by a day either way. The aqiqah days are counted from the " +
              "date of birth."]
        ],
        universal: [
          ["Where the names come from",
            "Name suggestions, meanings and pronunciation notes are generated by a " +
              "large language model. Nothing printed on the sheet depends on them. The " +
              "planets drawn in the background use mean orbital elements, accurate to " +
              "roughly a degree, and feed nothing but the picture."]
        ]
      }
    }
  };

  // -------------------------------------------------------------------- HINDI
  L.hi = {
    method: {
      "Hindu": {
            "body": "जन्म की तिथि, समय और स्थान बताइए। हम नक्षत्र और नाम की पहली ध्वनि निकालते हैं, उस क्षण का पंचांग देखते हैं, और जाँचते हैं कि जन्म उन कुछ स्थितियों में है या नहीं जिनमें नामकरण से पहले शांति की परंपरा है।",
            "asks": [
                  "जन्मतिथि",
                  "जन्म समय",
                  "जन्मस्थान"
            ],
            "gives": [
                  "नक्षत्र और पहली ध्वनि",
                  "राशि और पंचांग",
                  "जहाँ शांति आवश्यक हो",
                  "नामकरण के शुभ दिन",
                  "छापने योग्य पत्र"
            ]
      },
      "Jain": {
            "body": "गणना हिंदू परंपरा जैसी ही है। नाम पुराणों के देवताओं के बजाय तीर्थंकरों और गुणों से आते हैं।",
            "asks": [
                  "जन्मतिथि",
                  "जन्म समय",
                  "जन्मस्थान"
            ],
            "gives": [
                  "नक्षत्र और पहली ध्वनि",
                  "पंचांग",
                  "छापने योग्य पत्र"
            ]
      },
      "Buddhist": {
      "body": "पाली रूपों, पारमिताओं और गुणों से नाम, अर्थ के साथ। बौद्ध परिवार सामान्यतः हिंदू पंडित से परामर्श नहीं करते, इसलिए जन्म नक्षत्र नहीं निकाला जाता और हम जन्म का समय भी नहीं पूछते।",
      "asks": [
            "जन्म समय की आवश्यकता नहीं"
      ],
      "gives": [
            "अर्थ के साथ नाम",
            "पाली और संस्कृत मूल"
      ]
},
      "Sikh": {
            "body": "आपको मिला अक्षर बताइए और हम उसी से नाम खोजेंगे। अधिकांश सिख नाम किसी भी बच्चे के लिए उपयुक्त होते हैं, और सिंह या कौर आपके चुने नाम के बाद लगता है।",
            "asks": [
                  "हुक्मनामे से मिला अक्षर"
            ],
            "gives": [
                  "उस अक्षर से नाम",
                  "अर्थ और गुरमुखी वर्तनी"
            ]
      },
      "Muslim": {
            "body": "जन्मतिथि से हम इस्लामी तारीख और अक़ीक़ा का दिन निकालते हैं। नाम अस्मा-उल-हुस्ना और शास्त्रीय अरबी से आते हैं, अब्द-अल रूप सही ढंग से।",
            "asks": [
                  "जन्मतिथि"
            ],
            "gives": [
                  "जन्म की इस्लामी तारीख",
                  "अक़ीक़ा के दिन",
                  "अरबी अर्थ के साथ नाम"
            ],
            "caveat": "हमारी इस्लामी तारीख कैलेंडर के गणित से आती है और स्थानीय चाँद दिखने से एक दिन भिन्न हो सकती है। अक़ीक़ा तय करने से पहले मस्जिद से पुष्टि करें।"
      },
      "Christian": {
            "body": "हम प्रत्येक नाम का अर्थ, मूल और उच्चारण बताते हैं। जन्म समय से कुछ नहीं निकाला जाता।",
            "asks": [
                  "जन्म समय की आवश्यकता नहीं"
            ],
            "gives": [
                  "अर्थ के साथ नाम",
                  "नाम कहाँ से आता है"
            ],
            "planned": "जन्मदिन पर जिस संत का पर्व पड़े, उनके नाम पर नाम रखना गोवा और केरल में वास्तविक परंपरा है। इसके लिए जाँची हुई पंचांग सूची चाहिए, इसलिए हम अभी अनुमान नहीं लगाना चाहते।"
      },
      "Parsi": {
            "body": "अमेश स्पेंत, यज़त और शाहनामा से नाम, अवेस्ता और फ़ारसी अर्थ के साथ।",
            "asks": [
                  "जन्म समय की आवश्यकता नहीं"
            ],
            "gives": [
                  "अवेस्ता और फ़ारसी नाम",
                  "अर्थ"
            ]
      },
      "Jewish": {
            "body": "हिब्रू नाम, अर्थ के साथ, बेने इस्राइल और कोचीन समुदायों के रूपों सहित।",
            "asks": [
                  "जन्म समय की आवश्यकता नहीं"
            ],
            "gives": [
                  "हिब्रू नाम",
                  "अर्थ"
            ],
            "planned": "कुछ परिवार दिवंगत संबंधी के नाम पर नाम रखते हैं, कुछ जीवित के। दोनों परंपराएँ विपरीत हैं, इसलिए हम पूछना चाहेंगे कि आपकी कौन सी है।"
      },
      "No tradition": {
            "body": "अर्थ और ध्वनि के आधार पर चुने गए नाम, और यह भी कि नाम कहाँ कैसा चलेगा।",
            "asks": [
                  "जन्म समय की आवश्यकता नहीं"
            ],
            "gives": [
                  "अर्थ के साथ नाम",
                  "नाम कहाँ कैसा चलेगा"
            ]
      }
},
    heading: "यह कैसे काम करता है",
    intro: {
      panchang: {
        lead: "बताइए आपके बच्चे का जन्म कब और कहाँ हुआ।",
        body: "हम जन्म नक्षत्र निकालते हैं — उस ठीक क्षण पर चंद्रमा कहाँ था — और नाम " +
          "किस ध्वनि से शुरू होना चाहिए। फिर उसी के अनुसार नाम सुझाते हैं, अर्थ के साथ। " +
          "इसमें लगभग एक मिनट लगता है और कोई शुल्क नहीं है।"
      },
      hijri: {
        lead: "बताइए आपके बच्चे का जन्म किस तारीख को हुआ।",
        body: "हम इस्लामी तारीख और अक़ीक़ा का दिन निकालते हैं। फिर अस्मा-उल-हुस्ना और " +
          "शास्त्रीय अरबी से नाम सुझाते हैं, अर्थ के साथ। इसमें लगभग एक मिनट लगता है और " +
          "कोई शुल्क नहीं है।"
      },
      given: {
        lead: "बताइए गुरुद्वारे में आपको कौन सा अक्षर मिला।",
        body: "हम उस अक्षर से शुरू होने वाले नाम खोजते हैं, अर्थ और गुरमुखी वर्तनी के साथ। " +
          "जन्म समय से हम कुछ नहीं निकालते, और हुक्मनामा लेने का दिखावा भी नहीं करते।"
      },
      none: {
        lead: "बताइए आप नाम में क्या चाहते हैं।",
        body: "हम नाम सुझाते हैं — उनका अर्थ, वे कहाँ से आते हैं, और उन्हें कैसे बोला जाता " +
          "है। जन्म समय से कुछ नहीं निकाला जाता।"
      }
    },
    split: {
      panchang: {
        left: { title: "जन्म नक्षत्र गणना से निकलता है",
          note: "यह गणित है, अनुमान नहीं। एक ही जन्म विवरण से हर बार वही उत्तर आता है।",
          items: ["आपके बच्चे का जन्म किस नक्षत्र में हुआ",
            "नाम किस ध्वनि से शुरू होना चाहिए",
            "बच्चे की राशि, और उस दिन का पंचांग",
            "जन्म उन कुछ दिनों में पड़ता है या नहीं जिनमें पहले शांति की आवश्यकता होती है",
            "नामकरण के लिए शुभ दिन",
            "एक पृष्ठ जो आप छापकर {officiant} को दिखा सकें"] },
        right: { title: "नाम सुझाव हैं",
          note: "ये AI से आते हैं। ये चुनने के लिए विचार हैं, अंतिम निर्णय नहीं। जो नाम " +
            "आपको पसंद आए, उसका अर्थ अवश्य जाँच लें।",
          items: ["नाम स्वयं", "प्रत्येक नाम का अर्थ",
            "उच्चारण, और भाई-बहन के नाम के साथ कैसा लगता है"] }
      },
      hijri: {
        left: { title: "तारीखें गणना से निकलती हैं",
          note: "यह कैलेंडर का गणित है, अनुमान नहीं। एक ही जन्मतिथि से हर बार वही उत्तर आता है।",
          items: ["आपके बच्चे के जन्म की इस्लामी तारीख",
            "अक़ीक़ा के लिए सातवाँ दिन",
            "चौदहवाँ और इक्कीसवाँ दिन, यदि सातवाँ निकल जाए"] },
        right: { title: "नाम सुझाव हैं",
          note: "ये AI से आते हैं। ये चुनने के लिए विचार हैं, अंतिम निर्णय नहीं। जो नाम " +
            "आपको पसंद आए, उसका अर्थ अवश्य जाँच लें।",
          items: ["नाम स्वयं", "अरबी मूल और उसका अर्थ",
            "नाम में अब्द-अल रूप सही बनता है या नहीं"] }
      },
      given: {
        left: { title: "कोई गणना नहीं होती",
          note: "अक्षर आपका है। वह गुरुद्वारे में लिए गए वाक से आता है, और उसे बनाने का " +
            "अधिकार हमारा नहीं।",
          items: ["आप जो अक्षर देते हैं, हम केवल वही लेते हैं"] },
        right: { title: "नाम सुझाव हैं",
          note: "ये AI से आते हैं। ये चुनने के लिए विचार हैं, अंतिम निर्णय नहीं। जो नाम " +
            "आपको पसंद आए, उसका अर्थ अवश्य जाँच लें।",
          items: ["आपके अक्षर से शुरू होने वाले नाम", "प्रत्येक नाम का अर्थ",
            "गुरमुखी वर्तनी", "सिंह या कौर आपके चुने नाम के बाद लगता है"] }
      },
      none: {
        left: { title: "कोई गणना नहीं होती",
          note: "इस परंपरा में नाम को जन्म के क्षण से नहीं जोड़ा जाता, इसलिए हम वह पूछते " +
            "भी नहीं और उससे कुछ निकालते भी नहीं।",
          items: ["बच्चे की जन्मतिथि और समय की आवश्यकता नहीं"] },
        right: { title: "नाम सुझाव हैं",
          note: "ये AI से आते हैं। ये चुनने के लिए विचार हैं, अंतिम निर्णय नहीं। जो नाम " +
            "आपको पसंद आए, उसका अर्थ अवश्य जाँच लें।",
          items: ["नाम स्वयं", "प्रत्येक नाम का अर्थ", "नाम कहाँ से आता है",
            "उसे कैसे बोला जाता है"] }
      }
    },
    vsHeading: "चैटबॉट से क्यों न पूछें",
    vs: {
      panchang: [
        ["चैटबॉट अनुमान लगाता है। दो बार पूछिए, दो अलग उत्तर मिल सकते हैं।",
          "उसने कुछ देखा नहीं होता — वह वैसा उत्तर लिख देता है जैसा प्रश्न के साथ बैठता " +
          "है। हम वास्तव में गणना करते हैं कि चंद्रमा कहाँ था, इसलिए उत्तर बदलता नहीं।"],
        ["आपको कुछ मिलता है जो आप {officiant} को दिखा सकें।",
          "हम एक पृष्ठ छापते हैं जिसमें जन्म विवरण और हमारी पूरी गणना होती है। उन्हें दे " +
          "दीजिए और जाँचने दीजिए। चैट खिड़की केवल उत्तर देकर भरोसा करने को कहती है।"],
        ["जब हमें संदेह हो, हम बता देते हैं।",
          "कभी जन्म ठीक दो ध्वनियों की सीमा पर पड़ता है। ऐसा हो तो हम कह देते हैं, और " +
          "पंडितजी से पुष्टि करने को कहते हैं। चैटबॉट को यह पता ही नहीं होता।"]
      ],
      hijri: [
        ["चैटबॉट तारीख का अनुमान लगाता है। दो बार पूछिए, दो अलग तारीखें मिल सकती हैं।",
          "हम इस्लामी तारीख कैलेंडर के गणित से निकालते हैं, इसलिए वह हर बार वही रहती है।"],
        ["हमारी तारीख कहाँ गलत हो सकती है, यह हम बताते हैं।",
          "हमारा कैलेंडर गणित पर आधारित है, और आपके स्थान पर चाँद दिखने में एक दिन का " +
          "अंतर हो सकता है। हम यह कहते हैं और मस्जिद से पुष्टि करने को कहते हैं।"]
      ],
      given: [
        ["हम हुक्मनामा नहीं बनाएँगे, चैटबॉट बना देगा।",
          "चैटबॉट से बच्चे के लिए अक्षर पूछिए, वह दे देगा। उसने कुछ खोला नहीं होता। वह " +
          "अक्षर आपके परिवार और गुरुद्वारे का है, इसलिए हम उसे गढ़ने के बजाय आपसे पूछते हैं।"]
      ],
      none: [
        ["चैटबॉट मूल गढ़ लेता है और विश्वास से कहता है।",
          "गढ़ी हुई व्युत्पत्ति उनकी सबसे आम भूल है, क्योंकि गढ़ा हुआ मूल असली जैसा ही " +
          "पढ़ा जाता है। हम भी यहाँ गलत हो सकते हैं, इसलिए हम निश्चित दिखने के बजाय यह " +
          "साफ़ कह देते हैं।"]
      ],
      universal: [
        ["आपके बच्चे का विवरण आपके फ़ोन पर ही रहता है।",
          "आप जो भरते हैं वह कहीं नहीं भेजा जाता। सब कुछ आपके ब्राउज़र में ही होता है।"],
        ["यह निःशुल्क है, और निःशुल्क रहेगा।",
          "न खाता, न भुगतान, न कुछ बेचा जाता है। नाम सुझाव कुछ दिनों सीमित रहते हैं " +
          "क्योंकि उन्हें बनाने में हमारा ख़र्च होता है।"]
      ]
    },
    panditHeading: "{officiant} क्या करते हैं",
    pandit: {
      intro: "हम वही गणना उसी क्रम में करते हैं जो {officiant} करते हैं। नीचे देखिए हम क्या " +
        "करते हैं और कहाँ आपको उनकी आवश्यकता बनी रहती है।",
      him: "{officiant}", us: "यह पेज",
      tags: { done: "हम करते हैं", part: "अधिकांश", no: "वे करते हैं" },
      rows: [
        ["जन्म का ठीक समय और स्थान लिखते हैं",
          "वही। साथ ही सही टाइमज़ोन भी निकालते हैं, पुराने जन्मों के लिए भी।", "done"],
        ["उस क्षण चंद्रमा कहाँ था, यह निकालते हैं",
          "वही, खगोल सॉफ़्टवेयर से।", "done"],
        ["नक्षत्र और पहली ध्वनि निकालते हैं",
          "वही। आपका परिवार राशि से लेता हो तो वह भी दिखाते हैं।", "done"],
        ["उस दिन का पंचांग देखते हैं", "वही।", "done"],
        ["जन्म में पहले शांति चाहिए या नहीं, यह देखते हैं",
          "हम स्पष्ट रूप से बता देते हैं, जिससे आप उनसे पहले ही बात कर सकें।", "done"],
        ["नामकरण के लिए शुभ दिन चुनते हैं",
          "हम शुभ दिन सुझाते हैं, और बताते हैं बाकी क्यों नहीं।", "done"],
        ["परंपरागत नामों का समूह देते हैं",
          "चारों, बस आप अपने कुलदेवता बता दें।", "done"],
        ["आपके कुलदेवता, गोत्र और बड़ों की सहमति जानते हैं",
          "हम कुलदेवता, गोत्र, आगे बढ़ाने वाला नाम और बचाने वाले नाम पूछते हैं। बड़े सहमत होंगे या नहीं, वह उनका है।", "part"],
        ["कौन सी शांति कब करनी है, यह तय करते हैं",
          "हम सामान्यतः बताई जाने वाली शांति का नाम और समय बता देते हैं, जिससे आप पहले ही बात कर सकें। वास्तव में क्या करना है, वह उनका है।", "part"]
      ]
    },
    methodHeading: "आपके परिवार के लिए क्या होता है",
    asks: "हमें आपसे क्या चाहिए",
    gives: "आपको क्या मिलेगा",
    honestHeading: "जानना ज़रूरी है",
    honest: {
      panchang: [
        ["हम {officiant} का विकल्प नहीं हैं",
          "हम उनकी गणना जल्दी कर देते हैं और आपको हिसाब दे देते हैं। वे आपके परिवार को " +
            "जानते हैं, हम नहीं।"],
        ["अर्थ सबसे कमज़ोर हिस्सा है",
          "नाम और उनके अर्थ AI से आते हैं। जिस नाम पर आप गंभीर हों, उसे भाषा जानने वाले " +
            "किसी से जाँच लें।"],
        ["जो जन्म समय आपको बताया गया है, वही सबसे अधिक मायने रखता है",
          "सब कुछ उस पर टिका है। कुछ मिनट का अंतर इस पृष्ठ की किसी भी चीज़ से अधिक असर " +
            "डालता है।"]
      ],
      hijri: [
        ["तारीख मस्जिद से पुष्टि कर लें",
          "हमारी इस्लामी तारीख कैलेंडर के गणित से आती है, और आपके स्थान पर चाँद दिखने " +
            "में एक दिन का अंतर हो सकता है। अक़ीक़ा तय करने से पहले जाँच लें।"],
        ["अर्थ सबसे कमज़ोर हिस्सा है",
          "नाम और उनके अर्थ AI से आते हैं। जिस नाम पर आप गंभीर हों, उसे अरबी जानने वाले " +
            "किसी से जाँच लें।"]
      ],
      given: [
        ["अक्षर आपको ही देना होगा",
          "हम आपके लिए वाक नहीं ले सकते और न लेंगे। गुरुद्वारे जाना बाकी हो तो बाद में " +
            "आइए।"],
        ["अर्थ सबसे कमज़ोर हिस्सा है",
          "नाम और उनके अर्थ AI से आते हैं। जिस नाम पर आप गंभीर हों, उसे गुरमुखी पढ़ने " +
            "वाले किसी से जाँच लें।"]
      ],
      none: [
        ["अर्थ सबसे कमज़ोर हिस्सा है",
          "नाम और उनके अर्थ AI से आते हैं। जिस नाम पर आप गंभीर हों, उसे भाषा जानने वाले " +
            "किसी से जाँच लें।"],
        ["यहाँ कुछ भी अंतिम निर्णय नहीं है",
          "ये आपके परिवार से बात करने के लिए सुझाव हैं। आपके बड़े और आपका कान जो तय करें, " +
            "वही सही नाम है।"]
      ]
    },
    detail: {
      title: "जो हमारी विधि जाँचना चाहें उनके लिए",
      blocks: {
        panchang: [
          ["हम क्या और कैसे निकालते हैं",
            "चंद्रमा की स्थिति ELP2000-82 चंद्र सिद्धांत से आती है, जैसा Meeus की " +
              "Astronomical Algorithms के अध्याय 47 में है, और सूर्य की अध्याय 25 से। " +
              "स्थितियों को लाहिड़ी (चित्रपक्ष) अयनांश से निरयण देशांतर में बदला जाता " +
              "है, जो भारतीय पंचांग और सरकारी पंचांग उपयोग करते हैं। नक्षत्र और पाद " +
              "चंद्रमा के निरयण देशांतर से आते हैं, आपके जन्मस्थान के लंबन के सुधार के " +
              "साथ। तिथि, वार, योग और करण भूकेंद्रित रूप से निकाले जाते हैं जैसे प्रकाशित " +
              "पंचांग करते हैं, और वार सूर्योदय से सूर्योदय तक गिना जाता है।"],
          ["यह कितना सटीक है",
            "सौर देशांतर 2024 के विषुव और संक्रांति को 0.006 अंश से कम अंतर पर दोहराता " +
              "है। सूर्य-चंद्र अंतर पाँच प्रकाशित अमावस्या और पूर्णिमा से 0.007 अंश से " +
              "कम अंतर पर मिलता है। सूर्योदय 13N से 51N तक छह स्थानों पर प्रकाशित समय से " +
              "एक से तीन मिनट के भीतर मिलता है।"],
          ["दूसरी विधि कहाँ अलग उत्तर देगी",
            "पाद की सीमा के कुछ मिनटों के भीतर, दूसरा अयनांश — रमण, कृष्णमूर्ति, ट्रू " +
              "चित्रा — पड़ोसी पाद पर पहुँच सकता है। पत्र में लिखा होता है कि जन्म निकटतम " +
              "सीमा से कितने मिनट दूर है। जहाँ हमारा और आपके पंडितजी का मत भिन्न हो, " +
              "अंतिम शब्द उनका है।"],
          ["हम पिन कोड क्यों पूछते हैं",
            "वैध भारतीय पिन कोड गलत देश में नहीं पहुँच सकता, और डरने योग्य त्रुटि केवल " +
              "यही है: एक घंटे का गलत टाइमज़ोन छह में से लगभग एक जन्म का पाद बदल देता है, " +
              "गलत देश सबका। 50 किमी का अंतर हज़ार में लगभग एक का। इसलिए पिन का 5-25 किमी " +
              "क्षेत्र आवश्यकता से कहीं अधिक सटीक है। टाइमज़ोन, 1943-44 में भारत के +6:30 " +
              "जैसे पुराने मानों सहित, स्थान और तिथि से निकाला जाता है।"]
        ],
        hijri: [
          ["इस्लामी कैलेंडर",
            "ग्रेगोरियन से हिजरी रूपांतरण सारणीबद्ध (नागरिक) इस्लामी कैलेंडर से होता है। " +
              "यह गणना पर आधारित है, दर्शन पर नहीं, और स्थानीय चाँद दिखने से एक दिन इधर " +
              "या उधर हो सकता है। अक़ीक़ा के दिन जन्मतिथि से गिने जाते हैं।"]
        ],
        universal: [
          ["नाम कहाँ से आते हैं",
            "नाम सुझाव, अर्थ और उच्चारण AI से बनते हैं। पत्र पर छपी कोई भी चीज़ उन पर " +
              "निर्भर नहीं है। पृष्ठभूमि में दिखाए ग्रह माध्य कक्षीय तत्वों से आते हैं, " +
              "लगभग एक अंश तक सटीक, और केवल चित्र के लिए हैं।"]
        ]
      }
    }
  };

  // ------------------------------------------------------------------ MARATHI
  L.mr = {
    method: {
      "Hindu": {
            "body": "जन्माची तारीख, वेळ आणि ठिकाण सांगा. आम्ही नक्षत्र आणि नावाची पहिली ध्वनी काढतो, त्या क्षणाचे पंचांग पाहतो, आणि तपासतो की जन्म त्या थोड्या स्थितींत आहे का ज्यांत नामकरणापूर्वी शांतीची परंपरा आहे.",
            "asks": [
                  "जन्मतारीख",
                  "जन्मवेळ",
                  "जन्मस्थान"
            ],
            "gives": [
                  "नक्षत्र आणि पहिली ध्वनी",
                  "राशी आणि पंचांग",
                  "जिथे शांती आवश्यक",
                  "नामकरणाचे शुभ दिवस",
                  "छापण्यायोग्य पत्र"
            ]
      },
      "Jain": {
            "body": "गणना हिंदू परंपरेसारखीच आहे. नावे पुराणातील देवतांऐवजी तीर्थंकर आणि गुणांवरून येतात.",
            "asks": [
                  "जन्मतारीख",
                  "जन्मवेळ",
                  "जन्मस्थान"
            ],
            "gives": [
                  "नक्षत्र आणि पहिली ध्वनी",
                  "पंचांग",
                  "छापण्यायोग्य पत्र"
            ]
      },
      "Buddhist": {
      "body": "पाली रूपे, पारमिता आणि गुणांवरून नावे, अर्थासह. बौद्ध कुटुंबे सामान्यतः हिंदू पंडितांचा सल्ला घेत नाहीत, म्हणून जन्म नक्षत्र काढले जात नाही आणि आम्ही जन्मवेळ विचारतही नाही.",
      "asks": [
            "जन्मवेळेची गरज नाही"
      ],
      "gives": [
            "अर्थासह नावे",
            "पाली आणि संस्कृत मूळ"
      ]
},
      "Sikh": {
            "body": "तुम्हाला मिळालेले अक्षर सांगा आणि आम्ही त्यावरून नावे शोधू. बहुतेक शीख नावे कोणत्याही बाळाला शोभतात, आणि सिंग किंवा कौर तुम्ही निवडलेल्या नावानंतर येते.",
            "asks": [
                  "हुकुमनाम्यातून मिळालेले अक्षर"
            ],
            "gives": [
                  "त्या अक्षराने नावे",
                  "अर्थ आणि गुरुमुखी लेखन"
            ]
      },
      "Muslim": {
            "body": "जन्मतारखेवरून आम्ही इस्लामी तारीख आणि अकीका दिवस काढतो. नावे अस्मा-उल-हुस्ना आणि अभिजात अरबीतून येतात, अब्द-अल रूप योग्य पद्धतीने.",
            "asks": [
                  "जन्मतारीख"
            ],
            "gives": [
                  "जन्माची इस्लामी तारीख",
                  "अकीका दिवस",
                  "अरबी अर्थासह नावे"
            ],
            "caveat": "आमची इस्लामी तारीख कॅलेंडरच्या गणिताने येते आणि स्थानिक चंद्रदर्शनापासून एक दिवस भिन्न असू शकते. अकीका ठरवण्यापूर्वी मशिदीकडून खात्री करा."
      },
      "Christian": {
            "body": "आम्ही प्रत्येक नावाचा अर्थ, मूळ आणि उच्चार सांगतो. जन्मवेळेवरून काहीही काढले जात नाही.",
            "asks": [
                  "जन्मवेळेची गरज नाही"
            ],
            "gives": [
                  "अर्थासह नावे",
                  "नाव कुठून येते"
            ],
            "planned": "वाढदिवसाला ज्या संताचा सण येतो त्यांच्या नावावरून नाव ठेवणे गोवा आणि केरळात खरी परंपरा आहे. यासाठी तपासलेली सणसूची लागते, म्हणून आम्ही आत्ता अंदाज लावू इच्छित नाही."
      },
      "Parsi": {
            "body": "अमेश स्पेंत, यझत आणि शाहनामा यांतील नावे, अवेस्ता आणि पर्शियन अर्थासह.",
            "asks": [
                  "जन्मवेळेची गरज नाही"
            ],
            "gives": [
                  "अवेस्ता आणि पर्शियन नावे",
                  "अर्थ"
            ]
      },
      "Jewish": {
            "body": "हिब्रू नावे, अर्थासह, बेने इस्राइल आणि कोचीन समाजांतील रूपांसह.",
            "asks": [
                  "जन्मवेळेची गरज नाही"
            ],
            "gives": [
                  "हिब्रू नावे",
                  "अर्थ"
            ],
            "planned": "काही कुटुंबे दिवंगत नातेवाइकाच्या नावावरून नाव ठेवतात, काही जिवंत व्यक्तीच्या. दोन्ही प्रथा विरुद्ध दिशेला जातात, म्हणून आम्ही तुमची कोणती ते विचारू इच्छितो."
      },
      "No tradition": {
            "body": "अर्थ आणि ध्वनीवरून निवडलेली नावे, आणि नाव कुठे कसे चालेल याची नोंद.",
            "asks": [
                  "जन्मवेळेची गरज नाही"
            ],
            "gives": [
                  "अर्थासह नावे",
                  "नाव कुठे कसे चालेल"
            ]
      }
},
    heading: "हे कसे चालते",
    intro: {
      panchang: {
        lead: "सांगा तुमच्या बाळाचा जन्म कधी आणि कुठे झाला.",
        body: "आम्ही जन्म नक्षत्र काढतो — त्या नेमक्या क्षणी चंद्र कुठे होता — आणि नाव " +
          "कोणत्या ध्वनीने सुरू व्हावे. मग त्याप्रमाणे नावे सुचवतो, अर्थासह. यास सुमारे " +
          "एक मिनिट लागतो आणि काहीही शुल्क नाही."
      },
      hijri: {
        lead: "सांगा तुमच्या बाळाचा जन्म कोणत्या तारखेला झाला.",
        body: "आम्ही इस्लामी तारीख आणि अकीका दिवस काढतो. मग अस्मा-उल-हुस्ना आणि अभिजात " +
          "अरबीतून नावे सुचवतो, अर्थासह. यास सुमारे एक मिनिट लागतो आणि काहीही शुल्क नाही."
      },
      given: {
        lead: "सांगा गुरुद्वारात तुम्हाला कोणते अक्षर मिळाले.",
        body: "आम्ही त्या अक्षराने सुरू होणारी नावे शोधतो, अर्थ आणि गुरुमुखी लेखनासह. " +
          "जन्मवेळेवरून आम्ही काहीही काढत नाही, आणि हुकुमनामा घेण्याचे नाटकही करत नाही."
      },
      none: {
        lead: "सांगा तुम्हाला नावात काय हवे आहे.",
        body: "आम्ही नावे सुचवतो — त्यांचा अर्थ, ती कुठून येतात, आणि ती कशी उच्चारली " +
          "जातात. जन्मवेळेवरून काहीही काढले जात नाही."
      }
    },
    split: {
      panchang: {
        left: { title: "जन्म नक्षत्र गणनेने निघते",
          note: "हे गणित आहे, अंदाज नाही. तोच जन्म तपशील दरवेळी तेच उत्तर देतो.",
          items: ["तुमच्या बाळाचा जन्म कोणत्या नक्षत्रात झाला",
            "नाव कोणत्या ध्वनीने सुरू व्हावे",
            "बाळाची रास, आणि त्या दिवसाचे पंचांग",
            "जन्म त्या थोड्या दिवसांत येतो का ज्यांना आधी शांती लागते",
            "नामकरणासाठी शुभ दिवस",
            "एक पान जे छापून तुम्ही {officiant} दाखवू शकाल"] },
        right: { title: "नावे ही सुचवणी आहेत",
          note: "ही AI कडून येतात. ही निवडण्यासाठीचे विचार आहेत, अंतिम निर्णय नाही. जे " +
            "नाव आवडेल त्याचा अर्थ अवश्य तपासा.",
          items: ["नावे स्वतः", "प्रत्येक नावाचा अर्थ",
            "उच्चार, आणि भावंडाच्या नावाशेजारी कसे वाटते"] }
      },
      hijri: {
        left: { title: "तारखा गणनेने निघतात",
          note: "हे कॅलेंडरचे गणित आहे, अंदाज नाही. तीच जन्मतारीख दरवेळी तेच उत्तर देते.",
          items: ["तुमच्या बाळाच्या जन्माची इस्लामी तारीख",
            "अकीकासाठी सातवा दिवस",
            "चौदावा आणि एकविसावा, सातवा निघून गेल्यास"] },
        right: { title: "नावे ही सुचवणी आहेत",
          note: "ही AI कडून येतात. ही निवडण्यासाठीचे विचार आहेत, अंतिम निर्णय नाही. जे " +
            "नाव आवडेल त्याचा अर्थ अवश्य तपासा.",
          items: ["नावे स्वतः", "अरबी मूळ आणि त्याचा अर्थ",
            "नावात अब्द-अल रूप बरोबर बसते का"] }
      },
      given: {
        left: { title: "काहीही गणना होत नाही",
          note: "अक्षर तुमचे आहे. ते गुरुद्वारात घेतलेल्या वाकातून येते, आणि ते तयार " +
            "करण्याचा अधिकार आमचा नाही.",
          items: ["तुम्ही जे अक्षर देता, आम्ही केवळ तेच घेतो"] },
        right: { title: "नावे ही सुचवणी आहेत",
          note: "ही AI कडून येतात. ही निवडण्यासाठीचे विचार आहेत, अंतिम निर्णय नाही. जे " +
            "नाव आवडेल त्याचा अर्थ अवश्य तपासा.",
          items: ["तुमच्या अक्षराने सुरू होणारी नावे", "प्रत्येक नावाचा अर्थ",
            "गुरुमुखी लेखन", "सिंग किंवा कौर तुम्ही निवडलेल्या नावानंतर येते"] }
      },
      none: {
        left: { title: "काहीही गणना होत नाही",
          note: "या परंपरेत नाव जन्मक्षणाशी जोडले जात नाही, म्हणून आम्ही ते विचारतही " +
            "नाही आणि त्यावरून काहीही काढतही नाही.",
          items: ["बाळाची जन्मतारीख आणि वेळ लागत नाही"] },
        right: { title: "नावे ही सुचवणी आहेत",
          note: "ही AI कडून येतात. ही निवडण्यासाठीचे विचार आहेत, अंतिम निर्णय नाही. जे " +
            "नाव आवडेल त्याचा अर्थ अवश्य तपासा.",
          items: ["नावे स्वतः", "प्रत्येक नावाचा अर्थ", "नाव कुठून येते",
            "ते कसे उच्चारले जाते"] }
      }
    },
    vsHeading: "चॅटबॉटला का विचारू नये",
    vs: {
      panchang: [
        ["चॅटबॉट अंदाज लावतो. दोन वेळा विचारा, दोन वेगळी उत्तरे मिळू शकतात.",
          "त्याने काहीही पाहिलेले नसते — प्रश्नाशी जुळणारे उत्तर तो लिहून देतो. आम्ही " +
          "प्रत्यक्ष गणना करतो की चंद्र कुठे होता, म्हणून उत्तर बदलत नाही."],
        ["तुम्हाला {officiant} दाखवण्यासारखे काही मिळते.",
          "आम्ही एक पान छापतो ज्यात जन्म तपशील आणि आमची पूर्ण गणना असते. ते त्यांना द्या " +
          "आणि तपासू द्या. चॅट खिडकी फक्त उत्तर देऊन विश्वास ठेवायला सांगते."],
        ["आम्हाला शंका असेल तेव्हा आम्ही सांगतो.",
          "कधी जन्म नेमका दोन ध्वनींच्या सीमेवर येतो. तसे झाल्यास आम्ही सांगतो, आणि " +
          "गुरुजींकडून खात्री करायला सांगतो. चॅटबॉटला हे कळतच नाही."]
      ],
      hijri: [
        ["चॅटबॉट तारखेचा अंदाज लावतो. दोन वेळा विचारा, दोन वेगळ्या तारखा मिळू शकतात.",
          "आम्ही इस्लामी तारीख कॅलेंडरच्या गणिताने काढतो, म्हणून ती दरवेळी तीच राहते."],
        ["आमची तारीख कुठे चुकू शकते हे आम्ही सांगतो.",
          "आमचे कॅलेंडर गणितावर आधारित आहे, आणि तुमच्या ठिकाणी चंद्रदर्शनात एक दिवसाचा " +
          "फरक असू शकतो. आम्ही ते सांगतो आणि मशिदीकडून खात्री करायला सांगतो."]
      ],
      given: [
        ["आम्ही हुकुमनामा तयार करणार नाही, चॅटबॉट करेल.",
          "चॅटबॉटला बाळासाठी अक्षर विचारा, तो देईल. त्याने काहीही उघडलेले नसते. ते अक्षर " +
          "तुमच्या कुटुंबाचे आणि गुरुद्वाराचे आहे, म्हणून ते घडवण्याऐवजी आम्ही तुम्हाला " +
          "विचारतो."]
      ],
      none: [
        ["चॅटबॉट मूळ घडवतो आणि खात्रीने सांगतो.",
          "घडवलेली व्युत्पत्ती ही त्यांची सर्वात सामान्य चूक आहे, कारण घडवलेले मूळ खऱ्यासारखेच " +
          "वाचले जाते. आम्हीही येथे चुकू शकतो, म्हणून खात्रीचे दिसण्याऐवजी आम्ही ते स्पष्ट " +
          "सांगतो."]
      ],
      universal: [
        ["तुमच्या बाळाचा तपशील तुमच्या फोनवरच राहतो.",
          "तुम्ही जे भरता ते कुठेही पाठवले जात नाही. सर्व काही तुमच्या ब्राउझरमध्येच होते."],
        ["हे मोफत आहे, आणि मोफतच राहील.",
          "खाते नाही, पैसे नाहीत, काहीही विकले जात नाही. नाव सुचवणी काही दिवस मर्यादित " +
          "असतात कारण ती तयार करायला आमचा खर्च होतो."]
      ]
    },
    panditHeading: "{officiant} काय करतात",
    pandit: {
      intro: "{officiant} जी गणना करतात तीच आम्ही त्याच क्रमाने करतो. खाली पहा आम्ही काय करतो " +
        "आणि कुठे तुम्हाला त्यांची गरज राहते.",
      him: "{officiant}", us: "हे पान",
      tags: { done: "आम्ही करतो", part: "बहुतांश", no: "ते करतात" },
      rows: [
        ["जन्माची नेमकी वेळ आणि ठिकाण लिहून घेतात",
          "तेच. सोबत योग्य टाइमझोनही काढतो, जुन्या जन्मांसाठीही.", "done"],
        ["त्या क्षणी चंद्र कुठे होता ते काढतात",
          "तेच, खगोल सॉफ्टवेअरने.", "done"],
        ["नक्षत्र आणि पहिली ध्वनी काढतात",
          "तेच. तुमचे कुटुंब राशीवरून घेत असेल तर तेही दाखवतो.", "done"],
        ["त्या दिवसाचे पंचांग वाचतात", "तेच.", "done"],
        ["जन्माला आधी शांती लागते का ते पाहतात",
          "आम्ही स्पष्ट सांगतो, जेणेकरून तुम्ही त्यांच्याशी आधीच बोलू शकाल.", "done"],
        ["नामकरणासाठी शुभ दिवस निवडतात",
          "आम्ही शुभ दिवस सुचवतो, आणि बाकीचे का नाहीत ते सांगतो.", "done"],
        ["पारंपरिक नावांचा संच देतात",
          "चारही, फक्त तुमचे कुलदैवत सांगा.", "done"],
        ["तुमचे कुलदैवत, गोत्र आणि वडीलधाऱ्यांची पसंत जाणतात",
          "आम्ही कुलदैवत, गोत्र, पुढे न्यायचे नाव आणि टाळायची नावे विचारतो. वडीलधारे सहमत होतील का, ते त्यांचे.", "part"],
        ["कोणती शांती कधी करायची ते ठरवतात",
          "आम्ही सामान्यतः सांगितल्या जाणाऱ्या शांतीचे नाव आणि वेळ सांगतो, जेणेकरून तुम्ही आधीच बोलू शकाल. प्रत्यक्षात काय करायचे, ते त्यांचे.", "part"]
      ]
    },
    methodHeading: "तुमच्या कुटुंबासाठी काय होते",
    asks: "आम्हाला तुमच्याकडून काय हवे",
    gives: "तुम्हाला काय मिळेल",
    honestHeading: "माहीत असावे",
    honest: {
      panchang: [
        ["आम्ही {officiant} चा पर्याय नाही",
          "आम्ही त्यांची गणना पटकन करतो आणि तुम्हाला हिशेब देतो. ते तुमच्या कुटुंबाला " +
            "ओळखतात, आम्ही नाही."],
        ["अर्थ हा सर्वात कमकुवत भाग आहे",
          "नावे आणि त्यांचे अर्थ AI कडून येतात. जे नाव तुम्ही गंभीरपणे विचारात घेत असाल " +
            "ते भाषा जाणणाऱ्या कोणाकडून तपासा."],
        ["तुम्हाला सांगितलेली जन्मवेळ सर्वात महत्त्वाची",
          "सर्व काही त्यावर अवलंबून आहे. काही मिनिटांचा फरक या पानावरील कशाहीपेक्षा जास्त " +
            "परिणाम करतो."]
      ],
      hijri: [
        ["तारीख मशिदीकडून खात्री करा",
          "आमची इस्लामी तारीख कॅलेंडरच्या गणिताने येते, आणि तुमच्या ठिकाणी चंद्रदर्शनात " +
            "एक दिवसाचा फरक असू शकतो. अकीका ठरवण्यापूर्वी तपासा."],
        ["अर्थ हा सर्वात कमकुवत भाग आहे",
          "नावे आणि त्यांचे अर्थ AI कडून येतात. जे नाव गंभीरपणे विचारात असेल ते अरबी " +
            "जाणणाऱ्या कोणाकडून तपासा."]
      ],
      given: [
        ["अक्षर तुम्हीच द्यायचे आहे",
          "आम्ही तुमच्यासाठी वाक घेऊ शकत नाही आणि घेणारही नाही. गुरुद्वारात जायचे राहिले " +
            "असेल तर नंतर या."],
        ["अर्थ हा सर्वात कमकुवत भाग आहे",
          "नावे आणि त्यांचे अर्थ AI कडून येतात. जे नाव गंभीरपणे विचारात असेल ते गुरुमुखी " +
            "वाचणाऱ्या कोणाकडून तपासा."]
      ],
      none: [
        ["अर्थ हा सर्वात कमकुवत भाग आहे",
          "नावे आणि त्यांचे अर्थ AI कडून येतात. जे नाव गंभीरपणे विचारात असेल ते भाषा " +
            "जाणणाऱ्या कोणाकडून तपासा."],
        ["येथे काहीही अंतिम निर्णय नाही",
          "ही तुमच्या कुटुंबाशी बोलण्यासाठीची सुचवणी आहे. तुमचे वडीलधारे आणि तुमचा कान जे " +
            "ठरवेल तेच बरोबर नाव."]
      ]
    },
    detail: {
      title: "आमची पद्धत तपासू इच्छिणाऱ्यांसाठी",
      blocks: {
        panchang: [
          ["आम्ही काय आणि कसे काढतो",
            "चंद्राची स्थिती ELP2000-82 चंद्र सिद्धांतावरून येते, जसे Meeus च्या " +
              "Astronomical Algorithms च्या प्रकरण 47 मध्ये आहे, आणि सूर्याची प्रकरण 25 " +
              "वरून. स्थिती लाहिरी (चित्रपक्ष) अयनांशाने निरयन रेखांशात बदलली जाते, जे " +
              "भारतीय पंचांग आणि सरकारी पंचांग वापरतात. नक्षत्र आणि पाद चंद्राच्या निरयन " +
              "रेखांशावरून येतात, तुमच्या जन्मस्थानाच्या लंबन सुधारासह. तिथी, वार, योग " +
              "आणि करण भूकेंद्री पद्धतीने काढले जातात जसे प्रकाशित पंचांग करतात, आणि वार " +
              "सूर्योदयापासून सूर्योदयापर्यंत मोजला जातो."],
          ["हे किती अचूक आहे",
            "सौर रेखांश 2024 च्या संपात आणि संक्रांतीशी 0.006 अंशापेक्षा कमी फरकाने जुळतो. " +
              "सूर्य-चंद्र अंतर पाच प्रकाशित अमावास्या आणि पौर्णिमेशी 0.007 अंशापेक्षा " +
              "कमी फरकाने जुळते. सूर्योदय 13N ते 51N पर्यंत सहा ठिकाणी प्रकाशित वेळेशी एक " +
              "ते तीन मिनिटांत जुळतो."],
          ["दुसरी पद्धत कुठे वेगळे उत्तर देईल",
            "पादाच्या सीमेच्या काही मिनिटांत, दुसरा अयनांश — रमण, कृष्णमूर्ती, ट्रू " +
              "चित्रा — शेजारच्या पादावर पोहोचू शकतो. पत्रात लिहिलेले असते की जन्म जवळच्या " +
              "सीमेपासून किती मिनिटे दूर आहे. जिथे आमचे आणि तुमच्या गुरुजींचे मत भिन्न " +
              "असेल, शेवटचा शब्द त्यांचा."],
          ["आम्ही पिन कोड का विचारतो",
            "वैध भारतीय पिन कोड चुकीच्या देशात पोहोचू शकत नाही, आणि घाबरण्यासारखी चूक " +
              "केवळ तीच आहे: एक तासाचा चुकीचा टाइमझोन सहापैकी सुमारे एका जन्माचा पाद " +
              "बदलतो, चुकीचा देश सर्वांचा. 50 किमीचा फरक हजारात सुमारे एकाचा. म्हणून " +
              "पिनचे 5-25 किमी क्षेत्र गरजेपेक्षा कितीतरी अचूक आहे. टाइमझोन, 1943-44 " +
              "मध्ये भारताच्या +6:30 सारख्या जुन्या मूल्यांसह, ठिकाण आणि तारखेवरून काढला " +
              "जातो."]
        ],
        hijri: [
          ["इस्लामी कॅलेंडर",
            "ग्रेगोरियन ते हिजरी रूपांतर सारणीबद्ध (नागरी) इस्लामी कॅलेंडरने होते. ते " +
              "गणनेवर आधारित आहे, दर्शनावर नाही, आणि स्थानिक चंद्रदर्शनापासून एक दिवस " +
              "इकडे किंवा तिकडे असू शकते. अकीकाचे दिवस जन्मतारखेपासून मोजले जातात."]
        ],
        universal: [
          ["नावे कुठून येतात",
            "नाव सुचवणी, अर्थ आणि उच्चार AI ने तयार केले जातात. पत्रावर छापलेले काहीही " +
              "त्यांवर अवलंबून नाही. पार्श्वभूमीत दाखवलेले ग्रह मध्यम कक्षीय घटकांवरून " +
              "येतात, सुमारे एक अंशापर्यंत अचूक, आणि केवळ चित्रासाठी आहेत."]
        ]
      }
    }
  };

  /* Resolves a dotted path against the chosen language, falling back to English
   * so a gap shows as an English line rather than a blank. */
  function get(lang, path) {
    var parts = path.split(".");
    function walk(root) {
      var v = root;
      for (var i = 0; i < parts.length; i++) {
        if (v == null) return undefined;
        v = v[parts[i]];
      }
      return v;
    }
    var v = walk(L[lang] || {});
    return v === undefined ? walk(L.en) : v;
  }

  /* Which sections apply to a tradition's engine. A family whose tradition ties
   * nothing to the birth moment should not be shown a pandit comparison. */
  function sections(engine) {
    return {
      intro: "intro." + engine,
      split: "split." + engine,
      vs: engine,
      pandit: engine === "panchang",
      honest: "honest." + engine,
      detail: engine === "panchang" ? "panchang" : engine === "hijri" ? "hijri" : null
    };
  }

  var api = { L: L, get: get, sections: sections, languages: ["en", "hi", "mr"] };
  if (typeof globalThis !== "undefined") globalThis.About = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
