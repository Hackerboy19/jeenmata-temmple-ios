import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gift, Home, Heart, Camera, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, AartiTiming } from "@/services/api";
import heroImage from "/images/mandir front gate.jpg";
import mataJiImage from "/images/home.jpeg";
import diyaImage from "@/assets/diya-decoration.jpg";

const Index = () => {
  const { t, language } = useLanguage();
  const [aartiTimings, setAartiTimings] = useState<AartiTiming[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAartiTimings = async () => {
      try {
        const response = await api.aartiTimings.getAll();
        if (response.success && response.data) {
          setAartiTimings(response.data);
        }
      } catch (error) {
        console.error('Error fetching aarti timings:', error);
        // Fall back to default timings if API fails
        setAartiTimings([
          {
            _id: '1',
            name: 'morning',
            title: { en: 'Morning Aarti', hi: 'सुबह की आरती' },
            startTime: '7:10 AM',
            endTime: '7:30 AM',
            description: { en: 'Start your day with divine blessings', hi: 'दिव्य आशीर्वाद के साथ अपने दिन की शुरुआत करें' },
            image: diyaImage,
            isActive: true,
            order: 1
          },
          {
            _id: '2',
            name: 'evening',
            title: { en: 'Evening Aarti', hi: 'शाम की आरती' },
            startTime: '7:25 PM',
            endTime: '8:20 PM',
            description: { en: 'Experience divine grace in the evening', hi: 'शाम के समय दिव्य कृपा का अनुभव करें' },
            image: diyaImage,
            isActive: true,
            order: 2
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAartiTimings();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
            <div className="fade-in-up space-y-6 max-w-3xl stagger-fade-in">
              <div className="inline-block mb-4">
                <Sparkles className="w-12 h-12 text-accent diya-glow mx-auto" />
              </div>
              <h1 className="font-decorative text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="font-decorative text-2xl md:text-3xl text-accent ">
                {t('home.hero.subtitle')}
              </p>
              <p className="font-serif text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/darshan">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8 pulse-glow-border">
                    {t('home.hero.liveDarshan')}
                  </Button>
                </Link>
                <Link to="/donation">
                  <Button size="lg" variant="outline" className="border-2 border-accent hover:text-primary-foreground hover:bg-accent/20 font-serif text-lg px-8">
                    {t('home.hero.donate')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-muted lotus-pattern">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up">
                <img 
                  src={mataJiImage} 
                  alt="Maa Jeen Mata Ji" 
                  className="rounded-lg divine-shadow w-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="fade-in-up space-y-6 stagger-fade-in">
                <h2 className="font-decorative text-3xl md:text-4xl font-bold text-foreground">
                  {t('home.about.title')}
                </h2>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('home.about.p1')}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('home.about.p2')}
                </p>
                <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                  {t('home.about.p3')}
                </p>
                <Link to="/about">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif">
                    {t('home.about.readMore')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Darshan & Aarti */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 fade-in-up stagger-fade-in">
              <h2 className="font-decorative text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('home.darshan.title')}
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                {t('home.darshan.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-fade-in">
              {isLoading ? (
                // Loading skeleton
                <>
                  <Card className="divine-shadow golden-border">
                    <CardContent className="p-8 text-center">
                      <div className="animate-pulse space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-muted"></div>
                        <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="divine-shadow golden-border">
                    <CardContent className="p-8 text-center">
                      <div className="animate-pulse space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-muted"></div>
                        <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                aartiTimings.map((timing) => (
                  <Card key={timing._id} className="divine-shadow golden-border hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="mb-4">
                        <img 
                          src={timing.image || diyaImage} 
                          alt={timing.title[language === 'en' ? 'en' : 'hi']} 
                          className="w-24 h-24 mx-auto rounded-full object-cover diya-glow" 
                        />
                      </div>
                      <h3 className="font-decorative text-2xl font-bold text-foreground mb-3">
                        {timing.title[language === 'en' ? 'en' : 'hi']}
                      </h3>
                      <p className="font-serif text-3xl text-accent font-bold mb-2">
                        {timing.startTime} - {timing.endTime}
                      </p>
                      <p className="font-serif text-muted-foreground">
                        {timing.description?.[language === 'en' ? 'en' : 'hi'] || ''}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Online Services */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 fade-in-up stagger-fade-in">
              <h2 className="font-decorative text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('home.services.title')}
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                {t('home.services.subtitle')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto stagger-fade-in">
              <ServiceCard
                icon={Gift}
                title={t('home.services.prasad.title')}
                description={t('home.services.prasad.desc')}
                link="/booking?tab=prasad"
              />
              <ServiceCard
                icon={Home}
                title={t('home.services.room.title')}
                description={t('home.services.room.desc')}
                link="/booking"
              />
              <ServiceCard
                icon={Calendar}
                title={t('home.services.aarti.title')}
                description={t('home.services.aarti.desc')}
                link="/booking?tab=aarti"
              />
              <ServiceCard
                icon={Heart}
                title={t('home.services.donation.title')}
                description={t('home.services.donation.desc')}
                link="/donation"
              />
              <ServiceCard
                icon={Camera}
                title={t('home.services.gallery.title')}
                description={t('home.services.gallery.desc')}
                link="/gallery"
              />
              <ServiceCard
                icon={Sparkles}
                title={t('home.services.liveDarshan.title')}
                description={t('home.services.liveDarshan.desc')}
                link="/darshan"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
