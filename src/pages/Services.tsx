import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Sparkles, Gift, Shirt, Home, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const servicesData = [
  {
    icon: Eye,
    titleEn: "Divya Darshan",
    titleHi: "दिव्य दर्शन",
    descriptionEn: "Experience the divine presence of Maa Jeen Mata Ji through live streaming and in-person darshan.",
    descriptionHi: "माँ जीण माता जी की दिव्य उपस्थिति का अनुभव लाइव स्ट्रीमिंग और व्यक्तिगत दर्शन के माध्यम से करें।",
    link: "/services/divya-darshan"
  },
  {
    icon: Sparkles,
    titleEn: "Special Pooja",
    titleHi: "विशेष पूजा",
    descriptionEn: "Book special poojas and rituals for auspicious occasions and divine blessings from Mata Rani.",
    descriptionHi: "शुभ अवसरों और माता रानी से दिव्य आशीर्वाद के लिए विशेष पूजा और अनुष्ठान बुक करें।",
    link: "/services/special-pooja"
  },
  {
    icon: Gift,
    titleEn: "Bhog",
    titleHi: "भोग",
    descriptionEn: "Offer bhog and prasad to Mata Ji. Book online and receive blessed prasad at your doorstep.",
    descriptionHi: "माता जी को भोग और प्रसाद अर्पित करें। ऑनलाइन बुक करें और धन्य प्रसाद अपने घर पर प्राप्त करें।",
    link: "/services/bhog"
  },
  {
    icon: Shirt,
    titleEn: "Shree Jeen Mata Poshak",
    titleHi: "श्री जीण माता पोशाक",
    descriptionEn: "Donate sacred garments and poshak for the deity. Contribute to the divine adornment of Mata Rani.",
    descriptionHi: "देवी के लिए पवित्र वस्त्र और पोशाक दान करें। माता रानी के दिव्य श्रृंगार में योगदान करें।",
    link: "/services/poshak"
  },
  {
    icon: Home,
    titleEn: "Accommodation",
    titleHi: "आवास",
    descriptionEn: "Book comfortable rooms in our dharamshala for a peaceful stay during your spiritual journey.",
    descriptionHi: "अपनी आध्यात्मिक यात्रा के दौरान शांतिपूर्ण प्रवास के लिए हमारे धर्मशाला में आरामदायक कमरे बुक करें।",
    link: "/services/accommodation"
  },
  {
    icon: Heart,
    titleEn: "Seva-Satkar",
    titleHi: "सेवा-सहकार",
    descriptionEn: "Participate in temple seva and volunteer services. Serve devotees and contribute to temple activities.",
    descriptionHi: "मंदिर सेवा और स्वयंसेवी सेवाओं में भाग लें। भक्तों की सेवा करें और मंदिर गतिविधियों में योगदान करें।",
    link: "/services/seva-satkar"
  },
  {
    icon: Gift,
    titleEn: "Sawamani",
    titleHi: "सवामणि",
    descriptionEn: "Offer Sawamani to seek blessings and express gratitude to Maa Jeen Mata Ji.",
    descriptionHi: "माँ जीण माता जी से आशीर्वाद प्राप्त करने और कृतज्ञता व्यक्त करने के लिए सवामणि अर्पित करें।",
    link: "/services/sawamani"
  },
  {
    icon: Gift,
    titleEn: "Prasad",
    titleHi: "प्रशाद",
    descriptionEn: "Offer Prasad to seek blessings and express gratitude to Maa Jeen Mata Ji.",
    descriptionHi: "माँ जीण माता जी से आशीर्वाद प्राप्त करने और कृतज्ञता व्यक्त करने के लिए प्रसाद अर्पित करें।",
    link: "/services/prasad"
  }
];

const Services = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Our Services" : "हमारी सेवाएं"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Experience divine services and offerings at Shree Jeen Mata Dham"
                : "श्री जीण माता धाम में दिव्य सेवाओं और प्रसाद का अनुभव करें"}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {servicesData.map((service, index) => (
                <Card 
                  key={index} 
                  className="divine-shadow golden-border hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 flex flex-col overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-2"
                >
                  <CardContent className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6 flex flex-col flex-grow relative">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full group-hover:bg-accent/20 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-accent/5 rounded-tr-full group-hover:bg-accent/15 transition-colors duration-500" />
                    
                    <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 group-hover:from-accent/40 group-hover:to-accent/20 transition-all duration-500 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 border-2 border-accent/20">
                      <service.icon className="w-10 h-10 sm:w-12 sm:h-12 text-accent group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-decorative text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                        {isEnglish ? service.titleEn : service.titleHi}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto group-hover:w-24 transition-all duration-500" />
                    </div>
                    
                    <p className="font-serif text-muted-foreground leading-relaxed flex-grow text-sm sm:text-base">
                      {isEnglish ? service.descriptionEn : service.descriptionHi}
                    </p>
                    
                    <Link to={service.link} className="mt-auto">
                      <Button className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-accent hover:to-accent/90 text-secondary-foreground hover:text-accent-foreground font-serif shadow-lg hover:shadow-xl transition-all duration-300 py-5 sm:py-6 text-sm sm:text-base font-semibold group-hover:scale-105">
                        {isEnglish ? "Learn More" : "और जानें"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted lotus-pattern">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-decorative text-3xl md:text-4xl font-bold text-foreground">
                {isEnglish ? "Need Assistance?" : "सहायता चाहिए?"}
              </h2>
              <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                {isEnglish
                  ? "Our team is here to help you with any queries regarding temple services, bookings, or donations. Feel free to reach out to us."
                  : "हमारी टीम मंदिर सेवाओं, बुकिंग या दान से संबंधित किसी भी प्रश्न में आपकी सहायता के लिए यहां है। हमसे संपर्क करने में संकोच न करें।"}
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8">
                  {isEnglish ? "Contact Us" : "संपर्क करें"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
