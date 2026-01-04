import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Loader2, X } from "lucide-react";
import heroImage from "@/assets/hero-temple.jpg";
import diyaImage from "@/assets/diya-decoration.jpg";
import { useState, useEffect } from "react";
import api, { News as NewsItem, getImageUrl } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const defaultImage = heroImage;

const testimonials = [
  {
    quote: {
      en: "Visiting Jeen Mata Temple has been the most divine experience of my life. The peace and positive energy here is unmatched.",
      hi: "जीण माता मंदिर की यात्रा मेरे जीवन का सबसे दिव्य अनुभव रही है। यहां की शांति और सकारात्मक ऊर्जा अद्वितीय है।",
    },
    name: "Rajesh Kumar",
    location: {
      en: "Jaipur, Rajasthan",
      hi: "जयपुर, राजस्थान",
    },
  },
  {
    quote: {
      en: "The temple staff and trust members are so welcoming and helpful. The dharamshala facilities are excellent.",
      hi: "मंदिर के सेवादार और ट्रस्ट सदस्य बहुत सहायक हैं। धर्मशाला की सुविधाएं उत्कृष्ट हैं।",
    },
    name: "Priya Sharma",
    location: {
      en: "Delhi",
      hi: "दिल्ली",
    },
  },
  {
    quote: {
      en: "Maa Jeen Mata Ji fulfilled all my wishes. The live darshan feature keeps me connected even when I'm abroad.",
      hi: "मां जीण माता जी ने मेरी सभी मनोकामनाएं पूर्ण कीं। लाइव दर्शन फीचर से मैं विदेश में रहकर भी जुड़ा रहता हूं।",
    },
    name: "Suresh Patel",
    location: {
      en: "USA",
      hi: "अमेरिका",
    },
  },
];

const News = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.news.getAll();
        if (response.success && response.data) {
          // Filter only active news and sort by publishDate (newest first)
          const activeNews = response.data
            .filter(item => item.isActive)
            .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
          setNewsItems(activeNews);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "News & Updates" : "समाचार और अपडेट"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Stay informed about temple events, festivals, and developments"
                : "मंदिर से जुड़े कार्यक्रमों, त्योहारों और विकास कार्यों की जानकारी प्राप्त करें"}
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-serif">
                  {isEnglish ? "No news available at the moment" : "इस समय कोई समाचार उपलब्ध नहीं है"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsItems.map((item) => (
                  <Card key={item._id} className="divine-shadow hover:golden-border transition-all overflow-hidden group">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.image || defaultImage} 
                        alt={item.title[language]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground font-serif">
                        <Calendar className="w-4 h-4 text-accent mr-2" />
                        {new Date(item.publishDate).toLocaleDateString(isEnglish ? 'en-US' : 'hi-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="font-decorative text-xl font-bold text-foreground">
                        {item.title[language]}
                      </h3>
                      <p className="font-serif text-muted-foreground leading-relaxed line-clamp-3">
                        {item.excerpt[language]}
                      </p>
                      <Button 
                        variant="ghost" 
                        className="text-accent hover:text-accent/80 p-0 font-serif"
                        onClick={() => setSelectedNews(item)}
                      >
                        {isEnglish ? "Read More" : "और पढ़ें"} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-muted lotus-pattern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-decorative text-3xl font-bold text-foreground mb-4">
                {isEnglish ? "Devotee Testimonials" : "भक्तों के अनुभव"}
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                {isEnglish
                  ? "Hear from devotees whose lives have been touched by Maa Jeen Mata Ji"
                  : "उन भक्तों की आवाज सुनें जिनका जीवन माँ जीण माता जी ने संवार दिया"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((item) => (
                <Card key={item.name} className="divine-shadow">
                  <CardContent className="p-6 space-y-4">
                    <p className="font-serif text-muted-foreground italic leading-relaxed">
                      "{item.quote[language]}"
                    </p>
                    <div>
                      <p className="font-decorative font-bold text-foreground">{item.name}</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {item.location[language]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-decorative text-2xl text-foreground">
              {selectedNews?.title[language]}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              {selectedNews.image && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img 
                    src={getImageUrl(selectedNews.image)} 
                    alt={selectedNews.title[language]}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-serif">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-accent mr-2" />
                  {new Date(selectedNews.publishDate).toLocaleDateString(isEnglish ? 'en-US' : 'hi-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="px-2 py-1 bg-accent/10 text-accent rounded-md font-medium">
                  {selectedNews.category}
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="font-serif text-muted-foreground leading-relaxed text-base">
                  {selectedNews.excerpt[language]}
                </p>
                {selectedNews.content?.[language] && (
                  <div className="mt-4 font-serif text-foreground leading-relaxed text-base whitespace-pre-line">
                    {selectedNews.content[language]}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
