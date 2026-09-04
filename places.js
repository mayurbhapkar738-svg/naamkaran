/* Naamkaran — places
 *
 * Replaces three fields (city dropdown, timezone dropdown, and two coordinate
 * boxes) with one: type a place, get coordinates and the correct historical UTC
 * offset. Nobody knows their latitude, and nobody should be asked.
 *
 * Why this is bundled rather than a geocoding API call:
 *
 *   Precision needed is very low. Moving the birthplace 50 km shifts the Moon's
 *   apparent longitude by 0.008 deg, which is 0.2% of a pada, or about 50
 *   seconds of birth-time error. Recorded birth times are rarely better than
 *   +/- 5 minutes, so a city centroid is already several times more precise than
 *   the dominant source of error. Street-level geocoding would be false
 *   precision, and a live API would add a key, a quota and a rate limit to the
 *   one part of this site that currently cannot fail.
 *
 *   The timezone is the field that actually matters. Choosing "US Eastern
 *   (-5:00)" for a July birth in New York is a one-hour error, which is 16.5%
 *   of a pada -- roughly 700x worse than being 50 km off. So the zone is never
 *   asked for; it is derived from the place and the date through the browser's
 *   own tz database, which knows that India ran on +6:30 in 1943-44 and that
 *   Bombay kept its own time until 1955.
 *
 * The seed list below covers the places most often given as a birthplace.
 * tools/build-places.js regenerates it with full GeoNames coverage; the runtime
 * below does not change when it does.
 */
(function () {
  "use strict";

  /* Packed as "Name lat lon" triples, grouped by region so the state name and
   * timezone are stored once instead of per row. Coordinates are to 2dp, which
   * is 1.1 km -- far finer than anything downstream can detect. */
  var REGIONS = [
    ["Maharashtra", "IN", "Asia/Kolkata",
      "Mumbai 19.08 72.88|Pune 18.52 73.86|Nagpur 21.15 79.09|Nashik 20.00 73.79|" +
      "Chhatrapati Sambhajinagar 19.88 75.34|Solapur 17.66 75.91|Kolhapur 16.70 74.24|" +
      "Amravati 20.93 77.75|Nanded 19.15 77.32|Sangli 16.85 74.58|Jalgaon 21.01 75.56|" +
      "Akola 20.71 77.00|Latur 18.40 76.58|Ahmednagar 19.09 74.74|Dhule 20.90 74.77|" +
      "Chandrapur 19.95 79.30|Parbhani 19.27 76.77|Ichalkaranji 16.69 74.46|Jalna 19.84 75.89|" +
      "Bhusawal 21.04 75.79|Satara 17.69 73.99|Beed 18.99 75.76|Yavatmal 20.39 78.13|" +
      "Dharashiv 18.19 76.04|Nandurbar 21.37 74.24|Wardha 20.75 78.60|Ratnagiri 16.99 73.31|" +
      "Alibag 18.64 72.87|Panvel 18.99 73.11|Thane 19.22 72.98|Kalyan 19.24 73.13|" +
      "Vasai 19.39 72.83|Navi Mumbai 19.03 73.03|Pimpri-Chinchwad 18.63 73.80|" +
      "Bhiwandi 19.30 73.06|Malegaon 20.55 74.53|Sindhudurg 16.13 73.68|Gondia 21.46 80.20|" +
      "Wani 20.06 78.95|Shirdi 19.77 74.48|Pandharpur 17.68 75.33|Mahabaleshwar 17.92 73.66"],
    ["Uttar Pradesh", "IN", "Asia/Kolkata",
      "Lucknow 26.85 80.95|Kanpur 26.45 80.33|Ghaziabad 28.67 77.44|Agra 27.18 78.01|" +
      "Varanasi 25.32 82.97|Prayagraj 25.44 81.85|Meerut 28.98 77.71|Bareilly 28.37 79.43|" +
      "Aligarh 27.90 78.08|Moradabad 28.84 78.78|Saharanpur 29.97 77.55|Gorakhpur 26.76 83.37|" +
      "Noida 28.54 77.39|Firozabad 27.15 78.40|Jhansi 25.45 78.57|Muzaffarnagar 29.47 77.70|" +
      "Mathura 27.49 77.67|Rampur 28.81 79.03|Shahjahanpur 27.88 79.91|Farrukhabad 27.39 79.58|" +
      "Ayodhya 26.80 82.20|Mirzapur 25.15 82.57|Etawah 26.78 79.02|Sitapur 27.57 80.68|" +
      "Bulandshahr 28.40 77.85|Sultanpur 26.26 82.07|Rae Bareli 26.23 81.23|Unnao 26.55 80.49|" +
      "Jaunpur 25.75 82.68|Lakhimpur 27.95 80.78|Hathras 27.60 78.05|Banda 25.48 80.33|" +
      "Pilibhit 28.63 79.80|Basti 26.79 82.73|Deoria 26.50 83.78|Ghazipur 25.58 83.58|" +
      "Azamgarh 26.07 83.19|Mainpuri 27.23 79.03|Fatehpur 25.93 80.80|Barabanki 26.93 81.20|" +
      "Vrindavan 27.58 77.70|Chitrakoot 25.20 80.90|Hardoi 27.42 80.11|Ballia 25.76 84.15"],
    ["Bihar", "IN", "Asia/Kolkata",
      "Patna 25.59 85.14|Gaya 24.79 85.00|Bhagalpur 25.24 86.99|Muzaffarpur 26.12 85.39|" +
      "Darbhanga 26.15 85.90|Purnia 25.78 87.47|Arrah 25.56 84.66|Begusarai 25.42 86.13|" +
      "Katihar 25.54 87.57|Munger 25.38 86.47|Chhapra 25.78 84.73|Bettiah 26.80 84.50|" +
      "Saharsa 25.88 86.60|Sasaram 24.95 84.03|Hajipur 25.69 85.21|Dehri 24.90 84.18|" +
      "Siwan 26.22 84.36|Motihari 26.65 84.92|Nawada 24.88 85.53|Bagaha 27.10 84.09|" +
      "Buxar 25.56 83.98|Kishanganj 26.10 87.95|Jamui 24.92 86.22|Bodh Gaya 24.70 84.99"],
    ["West Bengal", "IN", "Asia/Kolkata",
      "Kolkata 22.57 88.36|Asansol 23.68 86.99|Siliguri 26.73 88.40|Durgapur 23.52 87.31|" +
      "Bardhaman 23.24 87.86|Malda 25.01 88.14|Baharampur 24.10 88.25|Habra 22.83 88.63|" +
      "Kharagpur 22.35 87.32|Shantipur 23.25 88.43|Dankuni 22.68 88.29|Darjeeling 27.04 88.26|" +
      "Howrah 22.59 88.31|Haldia 22.06 88.10|Krishnanagar 23.40 88.50|Medinipur 22.43 87.32|" +
      "Jalpaiguri 26.52 88.73|Balurghat 25.22 88.77|Basirhat 22.66 88.89|Bankura 23.23 87.07|" +
      "Purulia 23.33 86.36|Cooch Behar 26.32 89.45|Barrackpore 22.76 88.37|Serampore 22.75 88.34"],
    ["Tamil Nadu", "IN", "Asia/Kolkata",
      "Chennai 13.08 80.27|Coimbatore 11.02 76.96|Madurai 9.93 78.12|Tiruchirappalli 10.79 78.70|" +
      "Salem 11.66 78.15|Tirunelveli 8.71 77.76|Tiruppur 11.11 77.34|Vellore 12.92 79.13|" +
      "Erode 11.34 77.72|Thoothukudi 8.76 78.13|Dindigul 10.36 77.98|Thanjavur 10.79 79.14|" +
      "Nagercoil 8.18 77.43|Kanchipuram 12.84 79.70|Kumbakonam 10.96 79.38|Cuddalore 11.75 79.77|" +
      "Karur 10.96 78.08|Hosur 12.74 77.83|Neyveli 11.54 79.48|Rajapalayam 9.45 77.55|" +
      "Sivakasi 9.45 77.80|Pudukkottai 10.38 78.82|Namakkal 11.22 78.17|Udhagamandalam 11.41 76.70|" +
      "Virudhunagar 9.57 77.96|Tiruvannamalai 12.23 79.07|Ramanathapuram 9.37 78.83|" +
      "Krishnagiri 12.52 78.21|Chidambaram 11.40 79.69|Rameswaram 9.29 79.31|Kodaikanal 10.24 77.49"],
    ["Karnataka", "IN", "Asia/Kolkata",
      "Bengaluru 12.97 77.59|Mysuru 12.30 76.64|Hubballi 15.36 75.12|Mangaluru 12.91 74.86|" +
      "Belagavi 15.85 74.50|Kalaburagi 17.33 76.83|Davanagere 14.47 75.92|Ballari 15.14 76.92|" +
      "Vijayapura 16.83 75.71|Shivamogga 13.93 75.57|Tumakuru 13.34 77.10|Raichur 16.21 77.36|" +
      "Bidar 17.91 77.52|Hassan 13.01 76.10|Udupi 13.34 74.75|Chitradurga 14.23 76.40|" +
      "Kolar 13.14 78.13|Mandya 12.52 76.90|Chikkamagaluru 13.32 75.77|Bagalkot 16.19 75.70|" +
      "Gadag 15.42 75.63|Haveri 14.80 75.40|Karwar 14.81 74.13|Koppal 15.35 76.15|" +
      "Yadgir 16.77 77.14|Chikkaballapur 13.44 77.73|Ramanagara 12.72 77.28|Madikeri 12.42 75.74|" +
      "Sirsi 14.62 74.83|Bhadravati 13.85 75.71|Dharwad 15.46 75.01"],
    ["Andhra Pradesh", "IN", "Asia/Kolkata",
      "Visakhapatnam 17.69 83.22|Vijayawada 16.51 80.65|Guntur 16.31 80.44|Nellore 14.44 79.99|" +
      "Kurnool 15.83 78.04|Rajamahendravaram 17.00 81.78|Kakinada 16.99 82.25|Tirupati 13.63 79.42|" +
      "Anantapur 14.68 77.60|Kadapa 14.47 78.82|Eluru 16.71 81.10|Ongole 15.50 80.05|" +
      "Nandyal 15.48 78.48|Machilipatnam 16.19 81.14|Adoni 15.63 77.27|Tenali 16.24 80.65|" +
      "Chittoor 13.22 79.10|Hindupur 13.83 77.49|Bhimavaram 16.54 81.52|Guntakal 15.17 77.37|" +
      "Srikakulam 18.30 83.90|Vizianagaram 18.11 83.41|Chirala 15.82 80.35|Amaravati 16.51 80.52|" +
      "Anakapalle 17.69 83.00|Narasaraopet 16.24 80.05|Proddatur 14.75 78.55|Tadepalligudem 16.82 81.53"],
    ["Telangana", "IN", "Asia/Kolkata",
      "Hyderabad 17.39 78.49|Warangal 17.97 79.59|Nizamabad 18.67 78.09|Karimnagar 18.44 79.13|" +
      "Ramagundam 18.80 79.45|Khammam 17.25 80.15|Mahbubnagar 16.75 77.99|Nalgonda 17.05 79.27|" +
      "Adilabad 19.67 78.53|Suryapet 17.14 79.62|Miryalaguda 16.87 79.57|Jagtial 18.79 78.91|" +
      "Siddipet 18.10 78.85|Secunderabad 17.44 78.50|Medak 18.05 78.27|Sangareddy 17.63 78.09"],
    ["Kerala", "IN", "Asia/Kolkata",
      "Thiruvananthapuram 8.52 76.94|Kochi 9.93 76.27|Kozhikode 11.26 75.78|Kollam 8.89 76.61|" +
      "Thrissur 10.53 76.21|Alappuzha 9.50 76.34|Palakkad 10.78 76.65|Kannur 11.87 75.37|" +
      "Kottayam 9.59 76.52|Malappuram 11.07 76.07|Kasaragod 12.50 74.99|Pathanamthitta 9.26 76.79|" +
      "Idukki 9.85 76.97|Wayanad 11.61 76.08|Guruvayoor 10.59 76.04|Munnar 10.09 77.06|" +
      "Cherthala 9.68 76.34|Changanassery 9.44 76.54|Kayamkulam 9.18 76.50|Perinthalmanna 10.98 76.23"],
    ["Gujarat", "IN", "Asia/Kolkata",
      "Ahmedabad 23.02 72.57|Surat 21.17 72.83|Vadodara 22.31 73.18|Rajkot 22.30 70.80|" +
      "Bhavnagar 21.76 72.15|Jamnagar 22.47 70.06|Junagadh 21.52 70.46|Gandhinagar 23.22 72.68|" +
      "Anand 22.56 72.95|Nadiad 22.69 72.86|Bharuch 21.71 72.99|Navsari 20.95 72.93|" +
      "Morbi 22.82 70.83|Surendranagar 22.73 71.64|Mehsana 23.60 72.40|Bhuj 23.24 69.67|" +
      "Porbandar 21.64 69.61|Palanpur 24.17 72.43|Valsad 20.61 72.93|Veraval 20.90 70.37|" +
      "Godhra 22.78 73.61|Patan 23.85 72.13|Dwarka 22.24 68.97|Vapi 20.37 72.90|Amreli 21.60 71.22"],
    ["Rajasthan", "IN", "Asia/Kolkata",
      "Jaipur 26.91 75.79|Jodhpur 26.24 73.02|Kota 25.21 75.86|Bikaner 28.02 73.31|" +
      "Ajmer 26.45 74.64|Udaipur 24.58 73.71|Bhilwara 25.35 74.64|Alwar 27.55 76.63|" +
      "Sikar 27.61 75.14|Pali 25.77 73.33|Sri Ganganagar 29.92 73.88|Tonk 26.17 75.79|" +
      "Kishangarh 26.59 74.87|Beawar 26.10 74.32|Hanumangarh 29.58 74.32|Dhaulpur 26.70 77.89|" +
      "Gangapur 26.47 76.72|Sawai Madhopur 26.02 76.35|Churu 28.30 74.97|Jhunjhunu 28.13 75.40|" +
      "Bharatpur 27.22 77.49|Chittorgarh 24.88 74.63|Mount Abu 24.59 72.71|Pushkar 26.49 74.55|" +
      "Jaisalmer 26.92 70.92|Nagaur 27.20 73.73|Banswara 23.55 74.44"],
    ["Madhya Pradesh", "IN", "Asia/Kolkata",
      "Indore 22.72 75.86|Bhopal 23.26 77.41|Jabalpur 23.18 79.99|Gwalior 26.22 78.18|" +
      "Ujjain 23.18 75.78|Sagar 23.84 78.74|Dewas 22.96 76.06|Satna 24.58 80.83|" +
      "Ratlam 23.33 75.04|Rewa 24.53 81.30|Murwara 23.84 80.39|Singrauli 24.20 82.68|" +
      "Burhanpur 21.31 76.23|Khandwa 21.83 76.35|Bhind 26.56 78.79|Chhindwara 22.06 78.94|" +
      "Guna 24.65 77.31|Shivpuri 25.42 77.66|Vidisha 23.52 77.81|Chhatarpur 24.92 79.59|" +
      "Damoh 23.83 79.44|Mandsaur 24.07 75.07|Khargone 21.82 75.61|Neemuch 24.47 74.87|" +
      "Hoshangabad 22.75 77.72|Betul 21.90 77.90|Sehore 23.20 77.09|Maihar 24.27 80.76"],
    ["Punjab", "IN", "Asia/Kolkata",
      "Ludhiana 30.90 75.86|Amritsar 31.63 74.87|Jalandhar 31.33 75.58|Patiala 30.34 76.39|" +
      "Bathinda 30.21 74.95|Hoshiarpur 31.53 75.91|Batala 31.82 75.20|Pathankot 32.27 75.65|" +
      "Moga 30.82 75.17|Abohar 30.14 74.20|Malerkotla 30.53 75.88|Khanna 30.70 76.22|" +
      "Phagwara 31.22 75.77|Muktsar 30.47 74.52|Barnala 30.38 75.55|Firozpur 30.93 74.61|" +
      "Kapurthala 31.38 75.38|Sangrur 30.24 75.84|Fatehgarh Sahib 30.64 76.39|" +
      "Anandpur Sahib 31.24 76.50|Nawanshahr 31.12 76.12|Rupnagar 30.97 76.53|Faridkot 30.67 74.76"],
    ["Haryana", "IN", "Asia/Kolkata",
      "Faridabad 28.41 77.32|Gurugram 28.46 77.03|Panipat 29.39 76.97|Ambala 30.38 76.78|" +
      "Yamunanagar 30.13 77.28|Rohtak 28.90 76.61|Hisar 29.15 75.72|Karnal 29.69 76.99|" +
      "Sonipat 28.99 77.02|Panchkula 30.70 76.85|Bhiwani 28.79 76.13|Sirsa 29.53 75.03|" +
      "Bahadurgarh 28.69 76.93|Jind 29.32 76.32|Thanesar 29.97 76.84|Kaithal 29.80 76.40|" +
      "Rewari 28.20 76.62|Palwal 28.14 77.33|Narnaul 28.04 76.11|Kurukshetra 29.97 76.88"],
    ["Delhi NCR", "IN", "Asia/Kolkata",
      "Delhi 28.61 77.21|New Delhi 28.61 77.21|Dwarka Delhi 28.59 77.05|Rohini 28.74 77.07|" +
      "Saket 28.52 77.21|Pitampura 28.70 77.13|Janakpuri 28.62 77.08|Shahdara 28.67 77.29"],
    ["Odisha", "IN", "Asia/Kolkata",
      "Bhubaneswar 20.30 85.82|Cuttack 20.46 85.88|Rourkela 22.26 84.85|Berhampur 19.31 84.79|" +
      "Sambalpur 21.47 83.98|Puri 19.81 85.83|Balasore 21.49 86.93|Bhadrak 21.06 86.51|" +
      "Baripada 21.93 86.72|Jharsuguda 21.86 84.01|Jeypore 18.86 82.57|Angul 20.84 85.10|" +
      "Dhenkanal 20.66 85.60|Rayagada 19.17 83.42|Koraput 18.81 82.71|Paradip 20.32 86.61"],
    ["Assam", "IN", "Asia/Kolkata",
      "Guwahati 26.14 91.74|Silchar 24.83 92.80|Dibrugarh 27.47 94.91|Jorhat 26.75 94.22|" +
      "Nagaon 26.35 92.68|Tinsukia 27.49 95.36|Tezpur 26.63 92.80|Bongaigaon 26.48 90.55|" +
      "Dhubri 26.02 89.98|North Lakhimpur 27.24 94.10|Sivasagar 26.98 94.64|Goalpara 26.17 90.62|" +
      "Barpeta 26.32 91.00|Diphu 25.84 93.43|Karimganj 24.87 92.35"],
    ["Jharkhand", "IN", "Asia/Kolkata",
      "Ranchi 23.34 85.31|Jamshedpur 22.80 86.20|Dhanbad 23.80 86.43|Bokaro 23.67 86.15|" +
      "Deoghar 24.48 86.70|Hazaribagh 23.99 85.36|Giridih 24.19 86.30|Ramgarh 23.63 85.52|" +
      "Medininagar 24.03 84.07|Chaibasa 22.55 85.80|Dumka 24.27 87.25|Phusro 23.77 86.00"],
    ["Chhattisgarh", "IN", "Asia/Kolkata",
      "Raipur 21.25 81.63|Bhilai 21.19 81.38|Bilaspur 22.08 82.15|Korba 22.35 82.68|" +
      "Durg 21.19 81.28|Rajnandgaon 21.10 81.03|Jagdalpur 19.08 82.03|Raigarh 21.90 83.40|" +
      "Ambikapur 23.12 83.20|Dhamtari 20.71 81.55|Mahasamund 21.11 82.10"],
    ["Uttarakhand", "IN", "Asia/Kolkata",
      "Dehradun 30.32 78.03|Haridwar 29.95 78.16|Roorkee 29.87 77.89|Haldwani 29.22 79.52|" +
      "Rudrapur 28.98 79.40|Kashipur 29.21 78.96|Rishikesh 30.09 78.27|Nainital 29.38 79.45|" +
      "Almora 29.60 79.66|Pithoragarh 29.58 80.22|Mussoorie 30.46 78.07|Badrinath 30.74 79.49|" +
      "Kedarnath 30.73 79.07|Pauri 30.15 78.78"],
    ["Himachal Pradesh", "IN", "Asia/Kolkata",
      "Shimla 31.10 77.17|Solan 30.91 77.10|Dharamshala 32.22 76.32|Mandi 31.71 76.93|" +
      "Bilaspur HP 31.33 76.76|Kullu 31.96 77.11|Manali 32.24 77.19|Una 31.47 76.27|" +
      "Hamirpur HP 31.68 76.52|Chamba 32.56 76.13|Nahan 30.56 77.30|Palampur 32.11 76.54"],
    ["Jammu Kashmir Ladakh", "IN", "Asia/Kolkata",
      "Srinagar 34.08 74.80|Jammu 32.73 74.86|Anantnag 33.73 75.15|Baramulla 34.21 74.35|" +
      "Udhampur 32.93 75.13|Kathua 32.37 75.52|Sopore 34.28 74.47|Leh 34.16 77.58|" +
      "Kargil 34.56 76.13|Katra 32.99 74.95|Pulwama 33.87 74.90"],
    ["Northeast", "IN", "Asia/Kolkata",
      "Agartala 23.83 91.28|Imphal 24.82 93.94|Aizawl 23.73 92.72|Shillong 25.58 91.89|" +
      "Kohima 25.67 94.11|Dimapur 25.91 93.73|Itanagar 27.10 93.62|Gangtok 27.33 88.61|" +
      "Tura 25.51 90.20|Jowai 25.44 92.20|Namchi 27.17 88.35|Ukhrul 25.10 94.37"],
    ["Goa and UTs", "IN", "Asia/Kolkata",
      "Panaji 15.49 73.83|Margao 15.28 73.96|Vasco da Gama 15.40 73.81|Mapusa 15.59 73.81|" +
      "Ponda 15.40 74.01|Chandigarh 30.73 76.78|Puducherry 11.93 79.83|Karaikal 10.93 79.84|" +
      "Port Blair 11.62 92.73|Kavaratti 10.57 72.64|Daman 20.40 72.83|Silvassa 20.27 73.02|" +
      "Diu 20.71 70.98"],

    // ---- neighbouring countries, common for grandparents' birthplaces
    ["Pakistan", "PK", "Asia/Karachi",
      "Karachi 24.86 67.01|Lahore 31.55 74.34|Faisalabad 31.42 73.08|Rawalpindi 33.60 73.04|" +
      "Islamabad 33.68 73.05|Multan 30.20 71.47|Peshawar 34.01 71.58|Quetta 30.18 66.98|" +
      "Sialkot 32.49 74.53|Gujranwala 32.16 74.19|Hyderabad Sindh 25.40 68.37|Sukkur 27.71 68.86"],
    ["Bangladesh", "BD", "Asia/Dhaka",
      "Dhaka 23.81 90.41|Chattogram 22.36 91.78|Khulna 22.85 89.54|Rajshahi 24.37 88.60|" +
      "Sylhet 24.90 91.87|Barisal 22.70 90.37|Rangpur 25.75 89.24|Comilla 23.46 91.18|" +
      "Mymensingh 24.75 90.40|Jessore 23.17 89.21"],
    ["Nepal", "NP", "Asia/Kathmandu",
      "Kathmandu 27.72 85.32|Pokhara 28.21 83.99|Lalitpur 27.67 85.32|Biratnagar 26.45 87.28|" +
      "Bharatpur NP 27.68 84.43|Birgunj 27.02 84.88|Dharan 26.81 87.28|Janakpur 26.73 85.92|" +
      "Butwal 27.70 83.45|Nepalgunj 28.05 81.62|Lumbini 27.47 83.28"],
    ["Sri Lanka", "LK", "Asia/Colombo",
      "Colombo 6.93 79.86|Kandy 7.29 80.64|Galle 6.05 80.22|Jaffna 9.66 80.02|" +
      "Negombo 7.21 79.84|Batticaloa 7.71 81.69|Trincomalee 8.57 81.23|Matara 5.95 80.54|" +
      "Anuradhapura 8.31 80.40|Nuwara Eliya 6.97 80.79"],
    ["Myanmar and Bhutan", "XX", "Asia/Yangon",
      "Yangon 16.87 96.20|Mandalay 21.98 96.08|Naypyidaw 19.75 96.10"],
    ["Bhutan", "BT", "Asia/Thimphu",
      "Thimphu 27.47 89.64|Phuentsholing 26.86 89.39|Paro 27.43 89.42"],

    // ---- diaspora
    ["United Arab Emirates", "AE", "Asia/Dubai",
      "Dubai 25.20 55.27|Abu Dhabi 24.45 54.38|Sharjah 25.35 55.39|Ajman 25.40 55.44|" +
      "Al Ain 24.21 55.74|Ras Al Khaimah 25.79 55.94|Fujairah 25.13 56.33"],
    ["Gulf", "XX", "Asia/Riyadh",
      "Riyadh 24.71 46.68|Jeddah 21.49 39.19|Dammam 26.43 50.10|Mecca 21.39 39.86|Medina 24.47 39.61"],
    ["Qatar", "QA", "Asia/Qatar", "Doha 25.29 51.53|Al Rayyan 25.29 51.42"],
    ["Kuwait", "KW", "Asia/Kuwait", "Kuwait City 29.38 47.99|Salmiya 29.33 48.08"],
    ["Bahrain", "BH", "Asia/Bahrain", "Manama 26.23 50.59|Riffa 26.13 50.56"],
    ["Oman", "OM", "Asia/Muscat", "Muscat 23.59 58.41|Salalah 17.02 54.09|Sohar 24.34 56.71"],
    ["United Kingdom", "GB", "Europe/London",
      "London 51.51 -0.13|Birmingham 52.49 -1.89|Leicester 52.64 -1.13|Manchester 53.48 -2.24|" +
      "Bradford 53.80 -1.75|Glasgow 55.86 -4.25|Leeds 53.80 -1.55|Coventry 52.41 -1.51|" +
      "Wolverhampton 52.59 -2.13|Slough 51.51 -0.59|Edinburgh 55.95 -3.19|Nottingham 52.95 -1.15|" +
      "Cardiff 51.48 -3.18|Southall 51.51 -0.38|Harrow 51.58 -0.34|Luton 51.88 -0.42|Bristol 51.45 -2.59"],
    ["United States", "US", "America/New_York",
      "New York 40.71 -74.01|Newark 40.74 -74.17|Jersey City 40.73 -74.08|Edison 40.52 -74.41|" +
      "Philadelphia 39.95 -75.17|Boston 42.36 -71.06|Washington DC 38.91 -77.04|" +
      "Atlanta 33.75 -84.39|Miami 25.76 -80.19|Detroit 42.33 -83.05|Charlotte 35.23 -80.84|" +
      "Raleigh 35.78 -78.64|Tampa 27.95 -82.46|Pittsburgh 40.44 -79.996|Columbus 39.96 -83.00"],
    ["United States Central", "US", "America/Chicago",
      "Chicago 41.88 -87.63|Houston 29.76 -95.37|Dallas 32.78 -96.80|Austin 30.27 -97.74|" +
      "Minneapolis 44.98 -93.27|Kansas City 39.10 -94.58|Nashville 36.16 -86.78|" +
      "New Orleans 29.95 -90.07|Milwaukee 43.04 -87.91|St Louis 38.63 -90.20|" +
      "Oklahoma City 35.47 -97.52|Memphis 35.15 -90.05|San Antonio 29.42 -98.49"],
    ["United States Mountain", "US", "America/Denver",
      "Denver 39.74 -104.99|Salt Lake City 40.76 -111.89|Albuquerque 35.08 -106.65|" +
      "Boise 43.62 -116.20|Colorado Springs 38.83 -104.82"],
    ["Arizona", "US", "America/Phoenix", "Phoenix 33.45 -112.07|Tucson 32.22 -110.97|Mesa 33.42 -111.83"],
    ["United States Pacific", "US", "America/Los_Angeles",
      "San Francisco 37.77 -122.42|San Jose 37.34 -121.89|Los Angeles 34.05 -118.24|" +
      "Seattle 47.61 -122.33|San Diego 32.72 -117.16|Sacramento 38.58 -121.49|" +
      "Fremont 37.55 -121.99|Sunnyvale 37.37 -122.04|Irvine 33.68 -117.83|Portland 45.52 -122.68|" +
      "Bellevue 47.61 -122.20|Santa Clara 37.35 -121.96|Cupertino 37.32 -122.03"],
    ["Canada", "CA", "America/Toronto",
      "Toronto 43.65 -79.38|Brampton 43.68 -79.76|Mississauga 43.59 -79.64|Ottawa 45.42 -75.70|" +
      "Montreal 45.50 -73.57|Hamilton 43.26 -79.87|Windsor 42.32 -83.04|Kitchener 43.45 -80.49"],
    ["Canada West", "CA", "America/Vancouver",
      "Vancouver 49.28 -123.12|Surrey 49.19 -122.85|Burnaby 49.25 -122.98|Victoria 48.43 -123.37"],
    ["Canada Prairies", "CA", "America/Edmonton",
      "Calgary 51.05 -114.07|Edmonton 53.55 -113.49"],
    ["Canada Winnipeg", "CA", "America/Winnipeg", "Winnipeg 49.90 -97.14|Regina 50.45 -104.62"],
    ["Australia", "AU", "Australia/Sydney",
      "Sydney -33.87 151.21|Melbourne -37.81 144.96|Canberra -35.28 149.13|" +
      "Newcastle -32.93 151.78|Wollongong -34.42 150.89|Hobart -42.88 147.33"],
    ["Australia Brisbane", "AU", "Australia/Brisbane",
      "Brisbane -27.47 153.03|Gold Coast -28.02 153.40|Cairns -16.92 145.77|Townsville -19.26 146.82"],
    ["Australia Perth", "AU", "Australia/Perth", "Perth -31.95 115.86|Fremantle -32.06 115.75"],
    ["Australia Adelaide", "AU", "Australia/Adelaide", "Adelaide -34.93 138.60|Darwin -12.46 130.84"],
    ["New Zealand", "NZ", "Pacific/Auckland",
      "Auckland -36.85 174.76|Wellington -41.29 174.78|Christchurch -43.53 172.64|Hamilton NZ -37.79 175.28"],
    ["Singapore and Malaysia", "XX", "Asia/Singapore",
      "Singapore 1.35 103.82|Kuala Lumpur 3.14 101.69|Penang 5.41 100.34|Johor Bahru 1.49 103.74|" +
      "Ipoh 4.60 101.07|Klang 3.04 101.45"],
    ["Hong Kong and East Asia", "XX", "Asia/Hong_Kong",
      "Hong Kong 22.32 114.17|Macau 22.20 113.55"],
    ["Thailand", "TH", "Asia/Bangkok", "Bangkok 13.76 100.50|Chiang Mai 18.79 98.99|Phuket 7.88 98.39"],
    ["Europe", "XX", "Europe/Berlin",
      "Berlin 52.52 13.41|Frankfurt 50.11 8.68|Munich 48.14 11.58|Amsterdam 52.37 4.90|" +
      "Brussels 50.85 4.35|Paris 48.86 2.35|Zurich 47.38 8.54|Geneva 46.20 6.14|" +
      "Vienna 48.21 16.37|Stockholm 59.33 18.07|Oslo 59.91 10.75|Copenhagen 55.68 12.57|" +
      "Milan 45.46 9.19|Rome 41.90 12.50|Madrid 40.42 -3.70|Barcelona 41.39 2.17|" +
      "Warsaw 52.23 21.01|Prague 50.08 14.44|Dublin 53.35 -6.26|Lisbon 38.72 -9.14"],
    ["Africa", "XX", "Africa/Nairobi",
      "Nairobi -1.29 36.82|Mombasa -4.04 39.67|Kampala 0.35 32.58|Dar es Salaam -6.79 39.21|" +
      "Addis Ababa 9.03 38.74"],
    ["Southern Africa", "ZA", "Africa/Johannesburg",
      "Johannesburg -26.20 28.05|Durban -29.86 31.02|Cape Town -33.92 18.42|Pretoria -25.75 28.19"],
    ["West Africa", "NG", "Africa/Lagos", "Lagos 6.52 3.38|Accra 5.60 -0.19|Abuja 9.06 7.50"],
    ["Mauritius and Indian Ocean", "MU", "Indian/Mauritius",
      "Port Louis -20.16 57.50|Curepipe -20.32 57.53|Victoria Seychelles -4.62 55.45"],
    ["Fiji", "FJ", "Pacific/Fiji", "Suva -18.14 178.44|Nadi -17.80 177.42"],
    ["Caribbean", "TT", "America/Port_of_Spain",
      "Port of Spain 10.65 -61.52|Georgetown Guyana 6.80 -58.16|Paramaribo 5.85 -55.20"],
    ["Japan and Korea", "XX", "Asia/Tokyo",
      "Tokyo 35.68 139.69|Osaka 34.69 135.50|Yokohama 35.44 139.64|Seoul 37.57 126.98"],
    ["China", "CN", "Asia/Shanghai",
      "Shanghai 31.23 121.47|Beijing 39.90 116.41|Shenzhen 22.54 114.06|Guangzhou 23.13 113.26"]
  ];

  /* Names a family will actually type. Grandparents say Bombay, not Mumbai, and
   * a birth certificate from 1970 says Calcutta. Renames since 1990 are the
   * single biggest source of failed place lookups in India. */
  var ALIASES = {
    "bombay": "Mumbai", "poona": "Pune", "aurangabad": "Chhatrapati Sambhajinagar",
    "sambhajinagar": "Chhatrapati Sambhajinagar", "osmanabad": "Dharashiv",
    "calcutta": "Kolkata", "madras": "Chennai", "bangalore": "Bengaluru",
    "bangaluru": "Bengaluru", "mysore": "Mysuru", "mangalore": "Mangaluru",
    "belgaum": "Belagavi", "hubli": "Hubballi", "dharwar": "Dharwad",
    "gulbarga": "Kalaburagi", "bellary": "Ballari", "bijapur": "Vijayapura",
    "shimoga": "Shivamogga", "tumkur": "Tumakuru", "chikmagalur": "Chikkamagaluru",
    "coorg": "Madikeri", "mercara": "Madikeri", "sirsi": "Sirsi",
    "trivandrum": "Thiruvananthapuram", "cochin": "Kochi", "ernakulam": "Kochi",
    "calicut": "Kozhikode", "quilon": "Kollam", "alleppey": "Alappuzha",
    "trichur": "Thrissur", "cannanore": "Kannur", "palghat": "Palakkad",
    "trichy": "Tiruchirappalli", "trichinopoly": "Tiruchirappalli",
    "tanjore": "Thanjavur", "tuticorin": "Thoothukudi", "ootacamund": "Udhagamandalam",
    "ooty": "Udhagamandalam", "conjeevaram": "Kanchipuram", "negapatam": "Nagapattinam",
    "pondicherry": "Puducherry", "pondy": "Puducherry",
    "benares": "Varanasi", "banaras": "Varanasi", "kashi": "Varanasi",
    "allahabad": "Prayagraj", "faizabad": "Ayodhya", "cawnpore": "Kanpur",
    "jubbulpore": "Jabalpur", "vizag": "Visakhapatnam", "waltair": "Visakhapatnam",
    "rajahmundry": "Rajamahendravaram", "cuddapah": "Kadapa", "nellore": "Nellore",
    "gauhati": "Guwahati", "baroda": "Vadodara", "ahmedabad": "Ahmedabad",
    "ahmadabad": "Ahmedabad", "panjim": "Panaji", "simla": "Shimla",
    "gurgaon": "Gurugram", "sonepat": "Sonipat", "kurnool": "Kurnool",
    "hospet": "Ballari", "chittagong": "Chattogram", "dacca": "Dhaka",
    "rangoon": "Yangon", "peking": "Beijing", "bombay central": "Mumbai",
    "new bombay": "Navi Mumbai", "berhampore": "Baharampur", "midnapore": "Medinipur",
    "burdwan": "Bardhaman", "howrah": "Howrah", "kharagpore": "Kharagpur"
  };

  // ------------------------------------------------------------ index build

  var PLACES = [];      // { name, region, country, tz, lat, lon, key }
  function fold(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ").trim();
  }

  /* If tools/build-places.js has produced a full dataset and it loaded, use it.
   * Otherwise the seed list above carries the page. Keeping the fallback means a
   * failed or slow data fetch degrades to a smaller list rather than an empty
   * place field, which would block the whole birth panel. */
  var GEN = (typeof window !== "undefined" && window.NAAMKARAN_PLACE_DATA) || null;
  var SOURCE = GEN && GEN.regions && GEN.regions.length ? GEN.regions : REGIONS;
  if (GEN && GEN.aliases) {
    Object.keys(GEN.aliases).forEach(function (k) {
      if (!ALIASES[k]) ALIASES[k] = GEN.aliases[k];
    });
  }

  SOURCE.forEach(function (r) {
    r[3].split("|").forEach(function (row) {
      var m = /^(.+)\s(-?\d+(?:\.\d+)?)\s(-?\d+(?:\.\d+)?)$/.exec(row.trim());
      if (!m) return;
      PLACES.push({
        name: m[1].trim(), region: r[0], country: r[1], tz: r[2],
        lat: parseFloat(m[2]), lon: parseFloat(m[3]), key: fold(m[1])
      });
    });
  });

  // taken after any generated aliases have been merged in
  var ALIAS_KEYS = Object.keys(ALIASES);

  var BY_KEY = {};
  PLACES.forEach(function (p) { if (!BY_KEY[p.key]) BY_KEY[p.key] = p; });

  /* ------------------------------------------------------------- search
   * Prefix hits first, then word-start hits, then anything containing the
   * query. Indian places rank above the rest, since that is who this is for.
   *
   * Old names are matched by prefix too, not just in full. Someone typing
   * "bomb" is looking for Mumbai and should see it on the fourth keystroke;
   * requiring the whole word "bombay" defeats the point of a type-ahead. When a
   * result is reached through an old name, that name comes back on the result so
   * the UI can show "Mumbai — formerly Bombay" and the family knows it is the
   * right place. */

  function search(q, limit) {
    var f = fold(q);
    if (!f) return [];
    var out = [], seen = {};

    function push(p, rank, via) {
      var k = p.name + "|" + p.region;
      if (seen[k]) return;
      seen[k] = 1;
      out.push({
        place: p, via: via || null,
        rank: rank + (p.country === "IN" ? 0 : 0.5)
      });
    }

    // old names, matched by prefix; an exact old name outranks everything
    ALIAS_KEYS.forEach(function (ak) {
      if (ak.indexOf(f) !== 0) return;
      var target = BY_KEY[fold(ALIASES[ak])];
      if (target) push(target, ak === f ? -2 : -1, ALIASES[ak] === q ? null : ak);
    });

    PLACES.forEach(function (p) {
      var i = p.key.indexOf(f);
      if (i === 0) push(p, 0);
      else if (i > 0 && p.key.charAt(i - 1) === " ") push(p, 1);
      else if (i > 0) push(p, 2);
      else if (fold(p.region).indexOf(f) === 0) push(p, 3);
    });

    out.sort(function (a, b) {
      return a.rank - b.rank || a.place.name.length - b.place.name.length ||
        a.place.name.localeCompare(b.place.name);
    });
    return out.slice(0, limit || 8).map(function (x) {
      if (x.via) {
        // hand back a shallow copy so the caller can render the old name
        var c = {};
        for (var kk in x.place) if (x.place.hasOwnProperty(kk)) c[kk] = x.place[kk];
        c.formerly = x.via.replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
        return c;
      }
      return x.place;
    });
  }

  function aliasNote(q) {
    var f = fold(q), a = ALIASES[f];
    if (!a || fold(a) === f) return null;
    // only worth saying when the typed form differs as a word, not just spelling
    return { typed: String(q).trim(), now: a };
  }

  /* ------------------------------------------------------------ timezone
   * The offset that was actually in force at that place on that date. Two
   * passes, because the offset depends on the instant we are trying to find.
   * This is where the old dropdown went wrong: it made the family choose
   * between standard and daylight, and a wrong pick is a one-hour error. */
  function zoneOffsetAtInstant(tz, utcMs) {
    var f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    var p = {};
    f.formatToParts(new Date(utcMs)).forEach(function (x) { p[x.type] = x.value; });
    var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, (+p.hour) % 24, +p.minute, +p.second);
    return (asUTC - utcMs) / 3600000;
  }

  function offsetFor(tz, dateStr, timeStr) {
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || "").trim());
    var tm = /^(\d{1,2}):(\d{2})$/.exec(String(timeStr || "").trim());
    if (!dm) return null;
    var hh = tm ? +tm[1] : 12, mi = tm ? +tm[2] : 0;
    try {
      var guess = Date.UTC(+dm[1], +dm[2] - 1, +dm[3], hh, mi);
      var o1 = zoneOffsetAtInstant(tz, guess);
      var o2 = zoneOffsetAtInstant(tz, guess - o1 * 3600000);
      // a third pass catches the rare case of a reading inside a transition
      var o3 = zoneOffsetAtInstant(tz, guess - o2 * 3600000);
      return { hours: o3, ambiguous: o2 !== o3 || o1 !== o2 };
    } catch (e) {
      return null;
    }
  }

  function formatOffset(h) {
    if (h == null) return "";
    var sign = h < 0 ? "-" : "+", a = Math.abs(h);
    var hh = Math.floor(a), mm = Math.round((a - hh) * 60);
    return "UTC" + sign + String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  }

  function label(p) {
    if (!p) return "";
    return p.name + (p.region && p.region !== p.name ? ", " + p.region : "");
  }

  /* ------------------------------------------------- free-typed birthplaces
   * No list can hold every village, and a family born in one must never be
   * stuck. So the typed name is always accepted as the record of birthplace,
   * and the coordinates are borrowed from a town they name nearby.
   *
   * This costs almost nothing. Moving the birthplace 50 km shifts the moon's
   * apparent longitude by 0.008 degrees, under a minute of birth-time error,
   * against a recorded birth time that is rarely better than five minutes. A
   * district town is comfortably close enough, so the honest thing is to say so
   * rather than demand a precision that changes no answer.
   *
   * The sheet still reads "Kombhali", because that is where the child was born.
   * Where the numbers came from is stated separately. */
  function freePlace(typedName, nearby) {
    var nm = String(typedName || "").trim();
    if (!nm || !nearby) return null;
    return {
      name: nm,
      region: nearby.region,
      country: nearby.country,
      tz: nearby.tz,
      lat: nearby.lat,
      lon: nearby.lon,
      exact: false,
      nearbyLabel: label(nearby)
    };
  }

  /* Validates a suggested "nearest town" against our own data.
   *
   * A language model is genuinely good at the question "which district is this
   * village in", and genuinely unreliable at "what are its coordinates". So a
   * hint is only ever allowed to name a town; the latitude, longitude and
   * timezone are then read from our own entry for that town. If the named town
   * is not one we hold, the hint is discarded rather than trusted.
   *
   * This keeps the error bounded. The worst a bad hint can do is put the birth
   * in the wrong district, which moves about one birth in a hundred by a pada.
   * Letting a model supply the timezone instead would risk an hour, which moves
   * one birth in six, or a wrong country, which moves all of them. */
  function validateHint(town, region) {
    if (!town) return null;
    var f = fold(town);
    var cands = PLACES.filter(function (p) { return p.key === f; });
    if (!cands.length && ALIASES[f]) {
      var t = fold(ALIASES[f]);
      cands = PLACES.filter(function (p) { return p.key === t; });
    }
    if (!cands.length) return null;

    /* If the hint names a region, it has to agree with ours, and a disagreement
     * is a rejection rather than something to shrug off.
     *
     * This is the guard that matters most. "Hyderabad, Sindh" and "Hyderabad,
     * Telangana" are different cities in different countries on different
     * timezones. Falling through to whichever we happened to list first is how a
     * plausible-looking hint puts a birth in the wrong country, and a wrong
     * country changes the answer for every single birth rather than one in a
     * hundred. Better to ask the family. */
    if (region) {
      var rf = fold(region);
      var agree = cands.filter(function (p) {
        var pr = fold(p.region);
        return pr.indexOf(rf) !== -1 || rf.indexOf(pr) !== -1;
      });
      if (!agree.length) return null;
      cands = agree;
    }
    return cands[0];
  }

  /* A representative town for a state, used when a family knows the state but
   * not the PIN -- a pre-1972 birth, most often. The region blocks are ordered
   * largest first, so the head of the list is the state's biggest town, which
   * puts a state-only answer within a few hundred kilometres. That is coarser
   * than a PIN but still under about half a percent of births shifted. */
  function regionAnchor(regionName) {
    if (!regionName) return null;
    var rf = fold(regionName);
    for (var i = 0; i < PLACES.length; i++) {
      if (fold(PLACES[i].region) === rf) return PLACES[i];
    }
    return null;
  }

  function indianRegions() {
    var seen = {}, out = [];
    PLACES.forEach(function (p) {
      if (p.country !== "IN" || seen[p.region]) return;
      seen[p.region] = 1;
      out.push(p.region);
    });
    return out.sort();
  }

  /* True when the typed text is not a place we hold, so the caller knows to ask
   * for a nearby town instead of silently guessing one. */
  function isKnown(q) {
    var f = fold(q);
    if (!f) return false;
    if (BY_KEY[f]) return true;
    if (ALIASES[f] && BY_KEY[fold(ALIASES[f])]) return true;
    return false;
  }

  var api = {
    PLACES: PLACES, ALIASES: ALIASES,
    search: search, aliasNote: aliasNote,
    offsetFor: offsetFor, formatOffset: formatOffset, label: label,
    freePlace: freePlace, isKnown: isKnown, validateHint: validateHint,
    regionAnchor: regionAnchor, indianRegions: indianRegions,
    fold: fold, count: PLACES.length
  };
  if (typeof globalThis !== "undefined") globalThis.Places = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
