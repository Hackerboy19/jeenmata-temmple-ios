import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface AartiTiming {
  _id: string;
  name: string;
  title: { en: string; hi: string };
  startTime: string;
  endTime: string;
}

export const Footer = () => {
  const { language, t } = useLanguage();
  const isEnglish = language === "en";
  const [aartiTimings, setAartiTimings] = useState<AartiTiming[]>([]);

  useEffect(() => {
    const fetchAartiTimings = async () => {
      try {
        const response = await api.aartiTimings.getAll();
        if (response.success) {
          setAartiTimings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch aarti timings:', error);
      }
    };
    fetchAartiTimings();
  }, []);

  const getMorning = () => aartiTimings.find(t => t.name === 'morning');
  const getEvening = () => aartiTimings.find(t => t.name === 'evening');

  return (
    <footer className="bg-primary text-primary-foreground lotus-pattern">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
            <img src="/images/logo.png" alt="Shree Jeen Mata Mandir Trust" className="w-16 h-16" />
              {/* <Flame className="w-6 h-6 text-accent diya-glow" /> */}
              <h3 className="font-decorative text-xl font-bold">
                {isEnglish ? "Shree Jeen Mata" : "श्री जीण माता"}
              </h3>
            </div>
            <p className="text-sm text-primary-foreground/80 font-serif leading-relaxed">
              {isEnglish
                ? "Siddh Shakti Peeth dedicated to Maa Jeen Mata Ji, serving devotees since 1985 with divine blessings and spiritual guidance."
                : "मां जीण माता जी को समर्पित सिद्ध शक्ति पीठ, 1985 से भक्तों की सेवा दिव्य आशीर्वाद और आध्यात्मिक मार्गदर्शन के साथ कर रहा है।"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-decorative text-lg font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 font-serif text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/darshan" className="hover:text-accent transition-colors">{t("nav.darshan")}</Link></li>
              <li><Link to="/booking" className="hover:text-accent transition-colors">{t("nav.booking")}</Link></li>
              <li><Link to="/donation" className="hover:text-accent transition-colors">{isEnglish ? "Donate Now" : "अभी दान करें"}</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">{t("nav.gallery")}</Link></li>
              <li><Link to="/news" className="hover:text-accent transition-colors">{t("nav.news")}</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">{isEnglish ? "Privacy Policy" : "गोपनीयता नीति"}</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-accent transition-colors">{isEnglish ? "Terms & Conditions" : "नियम व शर्तें"}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-decorative text-lg font-bold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3 font-serif text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">Shree Jeen Mata Ji Mandir, Sikar, Rajasthan</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/80"><a href="tel:01576227346">01576-227346</a></span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-primary-foreground/80"><a href="mailto:sjmmtrust@gmail.com">sjmmtrust@gmail.com</a></span>
              </li>
            </ul>
          </div>

          {/* Aarti Timings */}
          <div>
            <h3 className="font-decorative text-lg font-bold mb-4">
              {isEnglish ? "Aarti Timings" : "आरती समय"}
            </h3>
            <div className="space-y-3 font-serif text-sm">
              <div className="bg-primary-foreground/10 p-3 rounded-lg">
                <p className="text-accent font-semibold">
                  {getMorning() ? (isEnglish ? getMorning()!.title.en : getMorning()!.title.hi) : (isEnglish ? "Morning Aarti" : "प्रातः आरती")}
                </p>
                <p className="text-primary-foreground/80">
                  {getMorning() ? `${getMorning()!.startTime} - ${getMorning()!.endTime}` : "7:10 AM - 7:30 AM"}
                </p>
              </div>
              <div className="bg-primary-foreground/10 p-3 rounded-lg">
                <p className="text-accent font-semibold">
                  {getEvening() ? (isEnglish ? getEvening()!.title.en : getEvening()!.title.hi) : (isEnglish ? "Evening Aarti" : "संध्या आरती")}
                </p>
                <p className="text-primary-foreground/80">
                  {getEvening() ? `${getEvening()!.startTime} - ${getEvening()!.endTime}` : "7:25 PM - 8:20 PM"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm font-serif text-primary-foreground/70">
              © {new Date().getFullYear()} Shree Jeen Mata Mandir Trust. {t("footer.rights")}
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/shrijeenmata.trust/" target="_blank" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCi_llbNRYH0QNl0cLW5ubRQ" target="_blank" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/shrijeenmata" target="_blank" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
