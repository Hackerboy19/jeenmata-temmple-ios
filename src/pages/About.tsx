import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, History, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import mataJiImage from "/images/home.jpeg";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center fade-in-up stagger-fade-in">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {t('about.hero.title')}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </section>

        
        {/* Temple History */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 fade-in-up stagger-fade-in">
                <h2 className="font-decorative text-3xl font-bold text-foreground">
                  {t('about.history.title')}
                </h2>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('about.history.p1')}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('about.history.p2')}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('about.history.p3')}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('about.history.p4')}
                </p>
              </div>
              <div className="fade-in-up">
                <img 
                  src={mataJiImage} 
                  alt="Maa Jeen Mata" 
                  className="rounded-lg divine-shadow w-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Jeen Mata — Story (only the <section> block) */}
<section className="py-20 bg-gradient-to-b from-rose-50 to-rose-100">
  <div className="container mx-auto px-4">
    {/* Title */}
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-amber-200 flex items-center justify-center shadow-md">
          <h2 className="text-2xl">श्री</h2>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-amber-700" fill="currentColor" aria-hidden>
            <path d="M12 2C9 6 6 7 6 11a6 6 0 0012 0c0-4-3-5-6-9z" />
          </svg> */}
        </div>

        <h2 className="font-decorative text-3xl sm:text-4xl font-extrabold text-foreground">
          {t('about.jeen.title')}
        </h2>
      </div>

      <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
        {t('about.jeen.p1').slice(0, 120)}{t('about.jeen.p1').length > 120 ? '...' : ''}
      </p>
    </div>

    {/* Card: image + story */}
    <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Illustration column */}
      <figure className="lg:col-span-4 p-4 rounded-2xl bg-gradient-to-b from-white to-amber-50 shadow-md flex flex-col items-center">
        <div className="w-full rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center p-6">
          {/* Replace below SVG with <img src='/path/to/jeen-mata.jpg' alt='Jeen Mata' /> */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-auto max-h-56" role="img" aria-label="Jeen Mata illustration placeholder">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#FDE68A" />
                <stop offset="1" stopColor="#FCA5A5" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="80" r="60" fill="url(#g)" />
            <path d="M60 150c15-25 65-25 80 0v6H60v-6z" fill="#fff" opacity="0.6" />
          </svg> */}
          <img src="/images/1613193401download.jpeg" alt="श्री जीण माता जी " />
        </div>

        <figcaption className="mt-4 text-center text-xs sm:text-sm text-foreground/70">
          {t('श्री जीण माता जी') || 'श्री जीण माता जी'}
        </figcaption>
      </figure>

      {/* Text column */}
      <div className="lg:col-span-8">
        <div className="prose prose-lg max-w-none mx-auto p-8 bg-white rounded-2xl shadow-md">
          {[
            'लोक काव्य, गीतों व कथाओं में श्री जीण माता को शक्ति और उनके बड़े भाई हर्ष को भगवान शिव का अवतार माना गया है। लोक कथाओं के अनुसार श्री जीण माता का जन्म राजस्थान के चूरू जिले के घां गांव के चौहान वंश के राजा घंघ के घर हुआ। राजा घाघू (घंघ) सिंह प्रजापालक व दयालु थे, पर वे निःसंतान थे और उदास रहते थे।',
            'एक बार राजा अरावली की वन-शृंखला में शिकार के समय एक समृद्ध परंतु पवित्र स्थान पर पहुँचे, जहाँ उन्होंने एक साधु को तपस्या करते देखा। राजा ने उस साधु की सेवा की; साधु प्रसन्न हुआ और राजा को पुत्र-पुत्री की प्राप्ति का वरदान दिया।',
            'वापस लौटते समय राजा ने पर्वतमाला में एक अप्सरा को जल-कुंड में डूबते देखा और उसे बचाया। उसने अप्सरा से विवाह किया, पर एक शर्त पर कि जब भी राजा बिना सूचना उनके कक्ष में प्रवेश करेगा तो वह वापस चली जाएगी। शीघ्र ही अप्सरा के गर्भ से एक पुत्र हर्ष और एक कन्या जीण का जन्म हुआ। चूँकि कन्या का वरदान एक निर्जन स्थान पर मिला था, उसे "जीण" नाम दिया गया जिसका अर्थ है एकांत या जंगल।',
            'एक दिन राजा ने बिना सूचना रानी के कक्ष में प्रवेश कर लिया। वहाँ रानी की स्वरूप में एक शेरनी बैठी मिली और उसने कहा कि राजा ने अपनी दी हुई शर्त भंग कर दी, इसलिए वह फिर इन्द्रलोक चली जा रही है। यह देखकर राजा और राजपरिवार बहुत दुःखी हुए; राजा का देहांत हो गया और हर्ष ने छोटे ही उम्र में विवाह कर लिया। हर्ष ने वचन दिया कि वह अपनी बहन जीण का सदा ध्यान रखेगा।',
            'समय के साथ जीण और हर्ष में गहरा स्नेह बढ़ा। किंतु एक कथा के अनुसार जल-उत्सव के दौरान एक प्रतियोगिता में हर्ष की पत्नी का मटका पहले निचोड़ा गया, जिसके कारण जीण को लगा कि हर्ष अपनी भाभी से अधिक प्रेम करते हैं। यह घटना जीण के हृदय में वैराग्य और विलग भाव पैदा करने वाली बनी और भाभी उसके समीप से चली गईं।',
            'लोक मान्यता बताती है कि देवताओं ने जीण को उसी स्थान पर तपस्या करने के लिए प्रेरित किया जहाँ राजा को वरदान मिला था — जयन्ती शक्ति पीठ। जीण अरावली की "काजल शिखर" पर पहुंची और वहाँ गहन तपस्या में लीन हो गई। हर्ष ने भी पास की चोटी पर भैरव की साधना की और बाद में हर्षनाथ भैरव के रूप में प्रतिष्ठित हुए। माँ भगवती ने जीण की भक्ति से प्रसन्न होकर वरदान दिया कि इस स्थान पर उन्हें "जीण" के नाम से ही पूजा जाएगा। आज भी शेखावाटी अंचल में माँ जीण तथा हर्षनाथ भैरव के दर्शन व आशीर्वाद के लिए देश-विदेश से लाखों श्रद्धालु आते हैं।'
          ].map((text, idx) => {
            const firstChar = text.charAt(0);
            const rest = text.slice(1);

            if (idx === 0) {
              return (
                <div key={idx} className="mb-6">
                  <p className="text-base leading-relaxed text-justify">
                    <span className="float-left mr-3 text-5xl font-serif leading-none text-amber-600">{firstChar}</span>
                    <span className="align-top">{rest}</span>
                  </p>
                </div>
              );
            }

            return (
              <div key={idx} className="mb-6">
                <p className="text-base leading-relaxed text-justify">{text}</p>
              </div>
            );
          })}

          {/* Footer / blessing */}
          <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
            <div className="text-sm text-red">{t('सत्यमेव जयते') || 'सत्यमेव जयते'}</div>
            <div className="text-sm font-medium text-amber-700">✶ आशीर्वाद ✶</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5"
            aria-label={t('about.jeen.moreStories')}
          >
            {t('about.jeen.moreStories')}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Key Features */}
        <section className="py-20 bg-muted lotus-pattern">
          <div className="container mx-auto px-4">
            <h2 className="font-decorative text-3xl font-bold text-center mb-12 fade-in-up">
              {t('about.highlights.title')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade-in">
              <Card className="divine-shadow hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <Building className="w-12 h-12 text-accent mx-auto mb-4 diya-glow" />
                  <h3 className="font-decorative text-xl font-bold mb-2">
                    {t('about.highlights.architecture.title')}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground">
                    {t('about.highlights.architecture.desc')}
                  </p>
                </CardContent>
              </Card>

              <Card className="divine-shadow hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-accent mx-auto mb-4 diya-glow" />
                  <h3 className="font-decorative text-xl font-bold mb-2">
                    {t('about.highlights.devotees.title')}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground">
                    {t('about.highlights.devotees.desc')}
                  </p>
                </CardContent>
              </Card>

              <Card className="divine-shadow hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <History className="w-12 h-12 text-accent mx-auto mb-4 diya-glow" />
                  <h3 className="font-decorative text-xl font-bold mb-2">
                    {t('about.highlights.heritage.title')}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground">
                    {t('about.highlights.heritage.desc')}
                  </p>
                </CardContent>
              </Card>

              <Card className="divine-shadow hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-accent mx-auto mb-4 diya-glow" />
                  <h3 className="font-decorative text-xl font-bold mb-2">
                    {t('about.highlights.peeth.title')}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground">
                    {t('about.highlights.peeth.desc')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Information */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto fade-in-up">
              <h2 className="font-decorative text-3xl font-bold text-center mb-8">
                {t('about.trust.title')}
              </h2>
              <Card className="divine-shadow golden-border pulse-glow-border">
                <CardContent className="p-8 space-y-4 stagger-fade-in">
                  <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                    {t('about.trust.intro')}
                  </p>
                  <ul className="space-y-3 font-serif text-muted-foreground ml-6">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point4')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point5')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>{t('about.trust.point6')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
