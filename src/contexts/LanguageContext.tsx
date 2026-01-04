import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.darshan': 'Live Darshan',
    'nav.stories': 'Stories',
    'nav.membership': 'Membership',
    'nav.booking': 'Booking',
    'nav.donation': 'Donation',
    'nav.gallery': 'Gallery',
    'nav.news': 'News',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Home Page
    'home.hero.title': 'Jai Shree Jeen Mata Ji 🙏',
    'home.hero.subtitle': 'Welcome to Siddh Shakti Peeth',
    'home.hero.description': 'Experience divine blessings of Maa Jeen Mata Ji, the sacred goddess of strength and devotion',
    'home.hero.liveDarshan': 'Live Darshan',
    'home.hero.donate': 'Donate Now',
    
    'home.about.title': 'About Shree Jeen Mata Temple',
    'home.about.p1': 'Shree Jeen Mata Mandir is a revered Siddh Shakti Peeth located in the sacred Aravalli hills of Sikar district, Rajasthan. The temple is dedicated to Maa Jeen Mata Ji, an incarnation of Goddess Durga, who is the divine mother goddess blessing devotees with strength, prosperity, and spiritual fulfillment.',
    'home.about.p2': 'Established and managed by Shree Jeen Mata Mandir Trust since 1985, the temple has been a beacon of faith for millions of devotees from across India and worldwide. The temple complex showcases magnificent Rajasthani architecture with intricate carvings and spiritual ambiance.',
    'home.about.p3': 'Every year, millions of devotees undertake the sacred pilgrimage to seek Mata Rani\'s divine blessings, especially during the holy Navratri festival when the temple witnesses grand celebrations and spiritual fervor.',
  'home.about.readMore': 'Read Full Story',
  // Quick link/button labels
  'about.jeen.moreStories': 'More Stories',
    
    'home.darshan.title': 'Live Darshan & Aarti Timings',
    'home.darshan.subtitle': 'Experience the divine presence of Maa Jeen Mata Ji from anywhere',
    'home.darshan.morning': 'Morning Aarti',
    'home.darshan.evening': 'Evening Aarti',
    'home.darshan.morningDesc': 'Start your day with divine blessings',
    'home.darshan.eveningDesc': 'End your day in spiritual peace',
    
    'home.services.title': 'Online Services',
    'home.services.subtitle': 'Connect with divine grace through our digital offerings',
    'home.services.prasad.title': 'Online Prasad',
    'home.services.prasad.desc': 'Receive blessed prasad delivered to your doorstep',
    'home.services.room.title': 'Room Booking',
    'home.services.room.desc': 'Book comfortable accommodation at our dharamshala',
    'home.services.aarti.title': 'Aarti Participation',
    'home.services.aarti.desc': 'Book your participation in daily aarti ceremonies',
    'home.services.donation.title': 'Donation',
    'home.services.donation.desc': 'Contribute to temple development and seva',
    'home.services.gallery.title': 'Gallery',
    'home.services.gallery.desc': 'View temple photos and festival celebrations',
    'home.services.liveDarshan.title': 'Live Darshan',
    'home.services.liveDarshan.desc': 'Watch live darshan and aarti from home',
    
    // About Page
    'about.hero.title': 'About Shree Jeen Mata Temple',
    'about.hero.subtitle': 'A sacred Siddh Shakti Peeth where devotion meets divine grace',
    
    'about.history.title': 'Temple History & Significance',
    'about.history.p1': 'Shree Jeen Mata Temple is one of the most revered Shakti Peeths in Rajasthan, dedicated to Goddess Jeen Mata, an incarnation of Goddess Durga. The temple is situated in the majestic Aravalli hills near Sikar district and attracts millions of devotees annually who come to seek the divine mother\'s blessings.',
    'about.history.p2': 'According to ancient legends, Maa Jeen Mata Ji manifested herself to protect the righteous and vanquish evil forces. The temple has been a sacred place of worship for centuries, with devotees experiencing miraculous blessings and fulfillment of their heartfelt wishes. The goddess is known for her swift grace and compassionate nature.',
    'about.history.p3': 'The Shree Jeen Mata Mandir Trust was formally established in 1985 to manage the temple affairs, organize grand festivals, and serve the devotees with utmost devotion and dedication. The trust works tirelessly to maintain the temple\'s spiritual sanctity while providing modern amenities to pilgrims.',
    'about.history.p4': 'The temple complex features stunning traditional Rajasthani architecture with intricate marble carvings, golden domes, and beautifully painted walls depicting various forms of the goddess. The main sanctum houses the sacred idol of Maa Jeen Mata Ji, adorned with vibrant silk sarees, precious jewels, and fresh flowers offered by devoted followers.',
    
    'about.highlights.title': 'Temple Highlights',
    'about.highlights.architecture.title': 'Ancient Architecture',
    'about.highlights.architecture.desc': 'Traditional Rajasthani temple architecture with intricate carvings and divine aesthetics',
    'about.highlights.devotees.title': 'Million+ Devotees',
    'about.highlights.devotees.desc': 'Visited by devotees from across India and worldwide seeking divine blessings',
    'about.highlights.heritage.title': 'Rich Heritage',
    'about.highlights.heritage.desc': 'Centuries-old temple with profound spiritual significance and cultural importance',
    'about.highlights.peeth.title': 'Siddh Peeth',
    'about.highlights.peeth.desc': 'A sacred Shakti Peeth where wishes are fulfilled and prayers are answered',
    
    'about.trust.title': 'About The Trust',
    'about.trust.intro': 'The Shree Jeen Mata Mandir Trust was established in 1985 with the noble mission of preserving and promoting the spiritual heritage of this sacred temple. The trust is committed to:',
    'about.trust.point1': 'Maintaining and developing the temple infrastructure with modern facilities while preserving ancient traditions',
    'about.trust.point2': 'Organizing religious festivals, grand celebrations, and spiritual programs throughout the year',
    'about.trust.point3': 'Providing comfortable accommodation, prasad facilities, and darshan arrangements for devotees',
    'about.trust.point4': 'Supporting local community development initiatives, educational programs, and charitable activities',
    'about.trust.point5': 'Preserving the temple\'s ancient traditions, rituals, and ensuring proper conduct of daily puja and aarti ceremonies',
    'about.trust.point6': 'Managing the temple website and digital services to connect with devotees worldwide',
  // Jeen Mata Story (English)
  'about.jeen.title': 'Jeen Mata — The Immortal Tale',
  'about.jeen.p1': 'In folk poetry, songs and tales, Shri Jeen Mata is revered as a Shakti (divine power) and her elder brother Harsh is considered an incarnation of Lord Shiva. According to local legends, Jeen Mata was born to the Chauhan ruler Ghang of Ghan village in Churu district of Rajasthan. King Ghaghu (Ghang) Singh was a benevolent ruler but was childless and sorrowful.',
  'about.jeen.p2': 'Once, while hunting in the dense Aravalli forests, the king arrived at a sacred place where he found a sage deep in penance. The king served the sage respectfully; pleased, the sage blessed him with the boon of a son and a daughter.',
  'about.jeen.p3': 'On his return the king rescued a celestial nymph (apsara) from a holy tank and married her with a condition: if the king ever entered her chamber unannounced, she would leave him. Soon, the apsara bore him a son named Harsh and a daughter named Jeen — the latter named for the solitude of her place of blessing (jeen meaning solitude or wilderness).',
  'about.jeen.p4': 'One day the king entered the queen\'s chamber unannounced and found a lioness there — the queen revealed her true form and said she must return to the heavens since the vow had been broken. Grief followed; the king died and Harsh married young, promising to always care for his sister Jeen.',
  'about.jeen.p5': 'Over time a close affection grew between the siblings. A tale relates that a contest with water pots led to jealousy when Harsh first emptied his wife\'s pot; Jeen felt neglected and withdrew, which eventually caused the queen to leave.',
  'about.jeen.p6': 'Tradition says the gods guided Jeen to the very hill where the blessing had been given — the Jayanti Shakti Peeth. Jeen climbed to the Kajal Peak of the Aravallis and undertook severe penance. Harsh performed his penance on a neighboring peak and became venerated as Harshnath Bhairav. Pleased with Jeen\'s devotion, the goddess granted that she would be worshipped here by the name \"Jeen\". To this day, devotees from across the country and the world come to the Shekhawati region to seek the blessings of Mata Jeen and Harshnath Bhairav.',
    
    // Footer
    'footer.about': 'About Temple',
    'footer.aboutDesc': 'Shree Jeen Mata Temple is a sacred Siddh Shakti Peeth dedicated to Goddess Jeen Mata Ji.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.address': 'Jeen Mata Temple, Sikar, Rajasthan',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.rights': 'All rights reserved.',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.services': 'सेवाएं',
    'nav.darshan': 'लाइव दर्शन',
    'nav.stories': 'कहानियां',
    'nav.membership': 'सदस्यता',
    'nav.booking': 'बुकिंग',
    'nav.donation': 'दान',
    'nav.gallery': 'गैलरी',
    'nav.news': 'समाचार',
    'nav.projects': 'परियोजनाएं',
    'nav.contact': 'संपर्क',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    
    // Home Page
    'home.hero.title': 'जय श्री जीण माता जी 🙏',
    'home.hero.subtitle': 'सिद्ध शक्ति पीठ में आपका स्वागत है',
    'home.hero.description': 'माँ जीण माता जी के दिव्य आशीर्वाद का अनुभव करें, जो शक्ति और भक्ति की पवित्र देवी हैं',
    'home.hero.liveDarshan': 'लाइव दर्शन',
    'home.hero.donate': 'अभी दान करें',
    
    'home.about.title': 'श्री जीण माता मंदिर के बारे में',
    'home.about.p1': 'श्री जीण माता मंदिर राजस्थान के सीकर जिले की पवित्र अरावली पहाड़ियों में स्थित एक प्रतिष्ठित सिद्ध शक्तिपीठ है। यह मंदिर माँ जीण माता जी को समर्पित है, जो माँ दुर्गा का अवतार हैं और भक्तों को शक्ति, समृद्धि और आध्यात्मिक पूर्णता का आशीर्वाद देती हैं।',
    'home.about.p2': '1985 से श्री जीण माता मंदिर ट्रस्ट द्वारा स्थापित और प्रबंधित, यह मंदिर भारत और दुनिया भर से लाखों भक्तों के लिए आस्था का प्रतीक रहा है। मंदिर परिसर में भव्य राजस्थानी वास्तुकला और आध्यात्मिक वातावरण है।',
    'home.about.p3': 'हर साल, लाखों भक्त माता रानी के दिव्य आशीर्वाद पाने के लिए पवित्र तीर्थयात्रा करते हैं, विशेष रूप से पवित्र नवरात्रि उत्सव के दौरान जब मंदिर में भव्य उत्सव और आध्यात्मिक उत्साह देखने को मिलता है।',
  'home.about.readMore': 'पूरी कहानी पढ़ें',
  // Quick link/button labels
  'about.jeen.moreStories': 'और कहानियाँ',
    
    'home.darshan.title': 'लाइव दर्शन और आरती समय',
    'home.darshan.subtitle': 'कहीं से भी माँ जीण माता जी की दिव्य उपस्थिति का अनुभव करें',
    'home.darshan.morning': 'प्रातः आरती',
    'home.darshan.evening': 'संध्या आरती',
    'home.darshan.morningDesc': 'दिव्य आशीर्वाद के साथ अपने दिन की शुरुआत करें',
    'home.darshan.eveningDesc': 'आध्यात्मिक शांति में अपना दिन समाप्त करें',
    
    'home.services.title': 'ऑनलाइन सेवाएं',
    'home.services.subtitle': 'हमारी डिजिटल सेवाओं के माध्यम से दिव्य कृपा से जुड़ें',
    'home.services.prasad.title': 'ऑनलाइन प्रसाद',
    'home.services.prasad.desc': 'आपके घर तक पहुंचाया गया पवित्र प्रसाद प्राप्त करें',
    'home.services.room.title': 'कमरा बुकिंग',
    'home.services.room.desc': 'हमारे धर्मशाला में आरामदायक आवास बुक करें',
    'home.services.aarti.title': 'आरती में भागीदारी',
    'home.services.aarti.desc': 'दैनिक आरती समारोह में अपनी भागीदारी बुक करें',
    'home.services.donation.title': 'दान',
    'home.services.donation.desc': 'मंदिर विकास और सेवा में योगदान दें',
    'home.services.gallery.title': 'गैलरी',
    'home.services.gallery.desc': 'मंदिर की तस्वीरें और त्योहार उत्सव देखें',
    'home.services.liveDarshan.title': 'लाइव दर्शन',
    'home.services.liveDarshan.desc': 'घर से लाइव दर्शन और आरती देखें',
    
    // About Page
    'about.hero.title': 'श्री जीण माता मंदिर के बारे में',
    'about.hero.subtitle': 'एक पवित्र सिद्ध शक्ति पीठ जहां भक्ति दिव्य कृपा से मिलती है',
    
    'about.history.title': 'मंदिर का इतिहास और महत्व',
    'about.history.p1': 'श्री जीण माता मंदिर राजस्थान के सबसे प्रतिष्ठित शक्तिपीठों में से एक है, जो देवी जीण माता को समर्पित है, जो माँ दुर्गा का अवतार हैं। यह मंदिर सीकर जिले के पास भव्य अरावली पहाड़ियों में स्थित है और हर साल लाखों भक्तों को आकर्षित करता है जो दिव्य माता का आशीर्वाद पाने आते हैं।',
    'about.history.p2': 'प्राचीन किंवदंतियों के अनुसार, माँ जीण माता जी ने धर्मियों की रक्षा करने और बुरी शक्तियों को नष्ट करने के लिए खुद को प्रकट किया। मंदिर सदियों से पूजा का एक पवित्र स्थान रहा है, जहां भक्तों को चमत्कारी आशीर्वाद और उनकी हार्दिक इच्छाओं की पूर्ति का अनुभव होता है। देवी अपनी त्वरित कृपा और करुणामय स्वभाव के लिए जानी जाती हैं।',
    'about.history.p3': 'श्री जीण माता मंदिर ट्रस्ट की औपचारिक स्थापना 1985 में मंदिर के मामलों का प्रबंधन करने, भव्य त्योहारों का आयोजन करने और भक्तों की सेवा करने के लिए की गई थी। ट्रस्ट तीर्थयात्रियों को आधुनिक सुविधाएं प्रदान करते हुए मंदिर की आध्यात्मिक पवित्रता बनाए रखने के लिए अथक प्रयास करता है।',
    'about.history.p4': 'मंदिर परिसर में पारंपरिक राजस्थानी वास्तुकला की शानदार झलक मिलती है जिसमें जटिल संगमरमर की नक्काशी, सुनहरे गुंबद और देवी के विभिन्न रूपों को दर्शाने वाली खूबसूरत चित्रित दीवारें हैं। मुख्य गर्भगृह में माँ जीण माता जी की पवित्र मूर्ति है, जो भक्तों द्वारा चढ़ाई गई रंगीन रेशमी साड़ियों, कीमती आभूषणों और ताजे फूलों से सुशोभित है।',
    
    'about.highlights.title': 'मंदिर की विशेषताएं',
    'about.highlights.architecture.title': 'प्राचीन वास्तुकला',
    'about.highlights.architecture.desc': 'पारंपरिक राजस्थानी मंदिर वास्तुकला जटिल नक्काशी और दिव्य सौंदर्य के साथ',
    'about.highlights.devotees.title': '10 लाख+ भक्त',
    'about.highlights.devotees.desc': 'दिव्य आशीर्वाद की तलाश में भारत और दुनिया भर से भक्त आते हैं',
    'about.highlights.heritage.title': 'समृद्ध विरासत',
    'about.highlights.heritage.desc': 'सदियों पुराना मंदिर गहन आध्यात्मिक महत्व और सांस्कृतिक महत्व के साथ',
    'about.highlights.peeth.title': 'सिद्ध पीठ',
    'about.highlights.peeth.desc': 'एक पवित्र शक्ति पीठ जहां मन्नतें पूरी होती हैं और प्रार्थनाएं सुनी जाती हैं',
    
    'about.trust.title': 'ट्रस्ट के बारे में',
    'about.trust.intro': 'श्री जीण माता मंदिर ट्रस्ट की स्थापना 1985 में इस पवित्र मंदिर की आध्यात्मिक विरासत को संरक्षित और बढ़ावा देने के उद्देश्य से की गई थी। ट्रस्ट प्रतिबद्ध है:',
    'about.trust.point1': 'प्राचीन परंपराओं को संरक्षित करते हुए आधुनिक सुविधाओं के साथ मंदिर के बुनियादी ढांचे को बनाए रखना और विकसित करना',
    'about.trust.point2': 'साल भर धार्मिक त्योहारों, भव्य समारोहों और आध्यात्मिक कार्यक्रमों का आयोजन करना',
    'about.trust.point3': 'भक्तों के लिए आरामदायक आवास, प्रसाद सुविधाएं और दर्शन की व्यवस्था प्रदान करना',
    'about.trust.point4': 'स्थानीय समुदाय विकास पहल, शैक्षिक कार्यक्रम और धर्मार्थ गतिविधियों का समर्थन करना',
    'about.trust.point5': 'मंदिर की प्राचीन परंपराओं, अनुष्ठानों को संरक्षित करना और दैनिक पूजा और आरती समारोहों का उचित संचालन सुनिश्चित करना',
    'about.trust.point6': 'दुनिया भर के भक्तों से जुड़ने के लिए मंदिर की वेबसाइट और डिजिटल सेवाओं का प्रबंधन करना',
  // Jeen Mata Story (Hindi)
  'about.jeen.title': 'जीण माता — अमर कथा',
  'about.jeen.p1': 'लोक काव्य, गीतों व कथाओं में श्री जीण माता को शक्ति और उनके बड़े भाई हर्ष को भगवान शिव का अवतार माना गया है। लोक कथाओं के अनुसार श्री जीण माता का जन्म राजस्थान के चूरू जिले के घां गांव के चौहान वंश के राजा घंघ के घर हुआ। राजा घाघू (घंघ) सिंह प्रजापालक व दयालु थे, पर वे निःसंतान थे और उदास रहते थे।',
  'about.jeen.p2': 'एक बार राजा अरावली की वन-शृंखला में शिकार के समय एक समृद्ध परंतु पवित्र स्थान पर पहुँचे, जहाँ उन्होंने एक साधु को तपस्या करते देखा। राजा ने उस साधु की सेवा की; साधु प्रसन्न हुआ और राजा को पुत्र-पुत्री की प्राप्ति का वरदान दिया।',
  'about.jeen.p3': 'वापस लौटते समय राजा ने पर्वतमाला में एक अप्सरा को जल-कुंड में डूबते देखा और उसे बचाया। उसने अप्सरा से विवाह किया, पर एक शर्त पर कि जब भी राजा बिना सूचना उनके कक्ष में प्रवेश करेगा तो वह वापस चली जाएगी। शीघ्र ही अप्सरा के गर्भ से एक पुत्र हर्ष और एक कन्या जीण का जन्म हुआ। चूँकि कन्या का वरदान एक निर्जन स्थान पर मिला था, उसे "जीण" नाम दिया गया जिसका अर्थ है एकांत या जंगल।',
  'about.jeen.p4': 'एक दिन राजा ने बिना सूचना रानी के कक्ष में प्रवेश कर लिया। वहाँ रानी की स्वरूप में एक शेरनी बैठी मिली और उसने कहा कि राजा ने अपनी दी हुई शर्त भंग कर दी, इसलिए वह फिर इन्द्रलोक चली जा रही है। यह देखकर राजा और राजपरिवार बहुत दुःखी हुए; राजा का देहांत हो गया और हर्ष ने छोटे ही उम्र में विवाह कर लिया। हर्ष ने वचन दिया कि वह अपनी बहन जीण का सदा ध्यान रखेगा।',
  'about.jeen.p5': 'समय के साथ जीण और हर्ष में गहरा स्नेह बढ़ा। किंतु एक कथा के अनुसार जल-उत्सव के दौरान एक प्रतियोगिता में हर्ष की पत्नी का मटका पहले निचोड़ा गया, जिसके कारण जीण को लगा कि हर्ष अपनी भाभी से अधिक प्रेम करते हैं। यह घटना जीण के हृदय में वैराग्य और विलग भाव पैदा करने वाली बनी और भाभी उसके समीप से चली गईं।',
  'about.jeen.p6': 'लोक मान्यता बताती है कि देवताओं ने जीण को उसी स्थान पर तपस्या करने के लिए प्रेरित किया जहाँ राजा को वरदान मिला था — जयन्ती शक्ति पीठ। जीण अरावली की "काजल शिखर" पर पहुंची और वहाँ गहन तपस्या में लीन हो गई। हर्ष ने भी पास की चोटी पर भैरव की साधना की और बाद में हर्षनाथ भैरव के रूप में प्रतिष्ठित हुए। माँ भगवती ने जीण की भक्ति से प्रसन्न होकर वरदान दिया कि इस स्थान पर उन्हें "जीण" के नाम से ही पूजा जाएगा। आज भी शेखावाटी अंचल में माँ जीण तथा हर्षनाथ भैरव के दर्शन व आशीर्वाद के लिए देश-विदेश से लाखों श्रद्धालु आते हैं।',
    
    // Footer
    'footer.about': 'मंदिर के बारे में',
    'footer.aboutDesc': 'श्री जीण माता मंदिर देवी जीण माता जी को समर्पित एक पवित्र सिद्ध शक्ति पीठ है।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contact': 'संपर्क करें',
    'footer.address': 'जीण माता मंदिर, सीकर, राजस्थान',
    'footer.phone': 'फोन',
    'footer.email': 'ईमेल',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
