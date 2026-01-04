import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

const navLinks = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "services", path: "/services" },
  { name: "stories", path: "/stories" },
  { name: "membership", path: "/membership" },
  { name: "booking", path: "/booking" },
  { name: "donation", path: "/donation"},
  { name: "gallery", path: "/gallery" },
  // { name: "news", path: "/news" },
  { name: "projects", path: "/projects" },
  { name: "contact", path: "/contact" },
];

const mantraText = "॥ॐ जयंती मंगला काली भद्रकाली कपालिनी। दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोस्तुते॥";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Initialize user state from localStorage immediately to prevent flash
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      setIsProfileMenuOpen(false);
      toast({
        title: language === 'en' ? "Logged Out 🙏" : "लॉगआउट हो गया 🙏",
        description: language === 'en' ? "Visit again soon!" : "जल्द फिर से आएं!",
      });
      navigate("/");
    } catch (error) {
      // Even if API fails, clear local state
      setUser(null);
      setIsProfileMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/80 backdrop-blur-md shadow-lg shadow-primary/30">
      <div className="mx-auto w-full px-3 sm:px-6 py-3 space-y-3 lg:space-y-0">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-2 sm:gap-3 rounded-2xl px-2 sm:px-3 py-2 border border-accent/20 bg-primary/60 hover:bg-primary/80 transition-all"
          >
            <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/70 p-1 flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Shree Jeen Mata Mandir Trust"
                className="h-full w-full object-contain drop-shadow-sm"
                loading="lazy"
              />
            </div>
            <div className="text-primary-foreground max-w-[86px] sm:max-w-none">
              <h1 className="font-decorative text-sm sm:text-base font-bold tracking-wide leading-tight">
                {language === 'en' ? 'Shree Jeen Mata' : 'श्री जीण माता'}
              </h1>
              <p className="text-[10px] sm:text-xs text-accent font-serif uppercase tracking-tight sm:tracking-[0.15em]">
                {language === 'en' ? 'Mandir Trust' : 'मंदिर ट्रस्ट'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center overflow-x-auto">
            <div className="flex items-center rounded-2xl bg-primary/60 backdrop-blur px-2 py-1 border border-accent/10 shadow-sm max-w-full">
              <div className="flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "px-3 py-2 text-sm font-serif capitalize transition-all rounded-full shrink-0",
                        isActive
                          ? "bg-accent/20 text-accent font-semibold shadow-inner"
                          : "text-primary-foreground/80 hover:text-accent hover:bg-primary/40",
                        // link.accent && !isActive && "text-accent/80"
                      )}
                    >
                      {t(`nav.${link.name}`)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <Button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:text-accent hover:bg-primary/40 rounded-full px-2 sm:px-3"
              aria-label={language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
            >
              <Languages className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{language === 'en' ? 'हिं' : 'EN'}</span>
            </Button>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary/40 rounded-full border border-accent/30"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  aria-label="Open profile menu"
                >
                  <User className="w-4 h-4" />
                </Button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 z-50 rounded-3xl border border-accent/20 bg-primary/95 p-2 shadow-lg shadow-primary/30 backdrop-blur">
                    <div className="rounded-2xl border border-accent/10 bg-primary/70 px-4 py-3">
                      <p className="text-sm font-serif text-primary-foreground/90">{user.name}</p>
                      <p className="text-xs text-primary-foreground/60">{user.email}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full rounded-2xl px-4 py-2 text-left text-sm font-serif text-primary-foreground/90 hover:bg-primary/70 transition"
                      >
                        {language === 'en' ? 'Profile' : 'प्रोफाइल'}
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-left text-sm font-serif text-accent hover:bg-accent/10 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-accent/90 hover:bg-accent text-accent-foreground font-serif rounded-full shadow-[0_5px_15px_rgba(219,170,56,0.35)] px-2 sm:px-4 text-sm"
                size="sm"
              >
                <User className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground hover:bg-primary/40 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden space-y-4 rounded-3xl border border-accent/15 bg-primary/80 backdrop-blur px-4 py-5 shadow-lg shadow-primary/20 fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-2xl text-base font-serif capitalize transition-all",
                  location.pathname === link.path
                    ? "bg-accent/15 text-accent shadow-inner"
                    : "text-primary-foreground/90 hover:text-accent hover:bg-primary/60"
                )}
              >
                {t(`nav.${link.name}`)}
              </Link>
            ))}

            {/* Language Toggle Mobile */}
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
              <Button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                variant="outline"
                className="font-serif border-accent/40 text-accent hover:bg-accent/10 hover:text-accent rounded-2xl text-sm py-2 px-3"
              >
                <Languages className="w-4 h-4 mr-2" />
                <span className="truncate">
                  {language === 'en' ? 'हिन्दी में देखें' : 'View in English'}
                </span>
              </Button>
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="font-serif border-accent/40 text-accent hover:bg-accent/10 hover:text-accent rounded-2xl text-sm py-2 px-3"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="truncate">{t('nav.logout')}</span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/auth");
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-accent/90 hover:bg-accent text-accent-foreground font-serif rounded-2xl text-sm py-2 px-3"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="truncate">{t('nav.login')}</span>
                </Button>
              )}
            </div>

            {/* Mobile User Info */}
            {user && (
              <div className="rounded-2xl border border-accent/10 bg-primary/60 px-4 py-3 text-primary-foreground/90 font-serif text-sm">
                <p className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <User className="w-4 h-4" />
                  </span>
                  {user.name}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-red-300/40 bg-red-550/80 backdrop-blur-sm">
        <div className="mx-auto w-full px-3 sm:px-6 py-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative flex-1 overflow-hidden rounded-full border border-red-300/40 bg-red-900/40 px-4 py-2">
              <div className="mantra-marquee text-sm font-serif tracking-wide text-red-100/90">
                <span>{mantraText}</span>
                <span aria-hidden="true">{mantraText}</span>
                <span aria-hidden="true">{mantraText}</span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/darshan")}
              className="hidden md:flex bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8 pulse-glow-border"
            >
              Live Darshan
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
