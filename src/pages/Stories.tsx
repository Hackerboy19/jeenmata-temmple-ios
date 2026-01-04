import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, User, MapPin } from "lucide-react";
import { stories } from "@/data/stories";
import { useState, useEffect } from "react";
import api, { Story as ApiStory, getImageUrl } from "@/services/api";

const Stories = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [backendStories, setBackendStories] = useState<ApiStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Always use Hindi for story content
  const contentLanguage = 'hi';

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await api.stories.getAll();
        if (response.success && response.data) {
          // Filter only active stories and sort by publishDate
          const activeStories = response.data
            .filter(story => story.isActive)
            .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
          setBackendStories(activeStories);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12 animate-fade-in">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-accent animate-pulse-glow" />
          <h1 className="font-decorative text-5xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Divine Stories of Mata Ji' : 'माता जी की दिव्य कहानियां'}
          </h1>
          <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Miraculous tales of faith, devotion, and divine blessings'
              : 'विश्वास, भक्ति और दिव्य आशीर्वाद की चमत्कारी कहानियां'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Backend Stories */}
            {backendStories.map((story, index) => (
              <Card 
                key={story._id}
                className="group hover:scale-105 transition-all duration-300 divine-shadow hover:golden-border cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/stories/backend/${story._id}`)}
              >
                <CardContent className="p-0 pb-6">
                  {story.image && (
                    <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                      <img 
                        src={getImageUrl(story.image)} 
                        alt={story.title.hi} 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="px-6 pt-6">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-decorative text-xl font-bold text-foreground mb-3">
                      {story.title.hi}
                    </h3>
                    <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {story.content.hi}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{story.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{story.author.location.hi}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {story.featured && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          ⭐ विशेष
                        </div>
                      )}
                      <Button variant="link" className="p-0 h-auto font-serif text-accent hover:text-accent/80 ml-auto" asChild>
                        <Link to={`/stories/backend/${story._id}`}>
                          पूरी कहानी पढ़ें →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Mock Stories */}
            {stories.map((story, index) => (
              <Card 
                key={story.id}
                className="group hover:scale-105 transition-all duration-300 divine-shadow hover:golden-border cursor-pointer"
                style={{ animationDelay: `${(backendStories.length + index) * 0.1}s` }}
                onClick={() => navigate(`/stories/${story.id}`)}
              >
                <CardContent className="p-0 pb-6">
                  <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                    <img 
                      src={story.coverImage} 
                      alt={story.title.hi} 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy"
                    />
                  </div>
                  <div className="px-6 pt-6">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-decorative text-xl font-bold text-foreground mb-3">
                      {story.title.hi}
                    </h3>
                    <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">
                      {story.excerpt.hi}
                    </p>
                    <Button variant="link" className="p-0 h-auto font-serif text-accent hover:text-accent/80" asChild>
                      <Link to={`/stories/${story.id}`}>
                        पूरी कहानी पढ़ें →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Stories;
