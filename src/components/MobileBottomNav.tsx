import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Calendar, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MobileBottomNav = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const isEnglish = language === "en";

  const navItems = [
    {
      path: "/",
      icon: Home,
      labelEn: "Home",
      labelHi: "होम",
    },
    {
      path: "/services",
      icon: Sparkles,
      labelEn: "Services",
      labelHi: "सेवाएं",
    },
    {
      path: "/stories",
      icon: BookOpen,
      labelEn: "Stories",
      labelHi: "कहानियां",
    },
    {
      path: "/booking",
      icon: Calendar,
      labelEn: "Booking",
      labelHi: "बुकिंग",
    },
    {
      path: "/donation",
      icon: Heart,
      labelEn: "Donate",
      labelHi: "दान",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden !fixed !bottom-0 !left-0 !right-0 !z-[100] pointer-events-none">
      <div className="bg-gradient-to-t from-primary via-primary to-primary/95 backdrop-blur-lg border-t border-accent/20 shadow-2xl rounded-t-3xl mx-2  pointer-events-auto">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-all duration-300 ${
                  active
                    ? "text-accent scale-110"
                    : "text-primary-foreground/70 hover:text-accent hover:scale-105"
                }`}
              >
                <div className={`relative ${active ? "animate-pulse" : ""}`}>
                  <Icon className={`w-6 h-6 ${active ? "diya-glow drop-shadow-lg" : ""}`} />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
                  )}
                </div>
                <span className={`text-[10px] font-serif font-medium mt-0.5 ${active ? "font-bold" : ""}`}>
                  {isEnglish ? item.labelEn : item.labelHi}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
