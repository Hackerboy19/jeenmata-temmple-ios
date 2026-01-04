import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStoryById } from "@/data/stories";
import api, { Story as ApiStory, getImageUrl } from "@/services/api";
import { Loader2, User, MapPin } from "lucide-react";

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [backendStory, setBackendStory] = useState<ApiStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Always use Hindi for story content
  const contentLanguage = 'hi';
  
  // Check if this is a backend story (URL pattern: /stories/backend/:id)
  const isBackendStory = window.location.pathname.includes('/backend/');

  const storyId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const mockStory = !isBackendStory && storyId ? getStoryById(storyId) : null;

  useEffect(() => {
    if (isBackendStory && id) {
      const fetchStory = async () => {
        setIsLoading(true);
        try {
          const response = await api.stories.getById(id);
          if (response.success && response.data) {
            setBackendStory(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch story:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStory();
    }
  }, [id, isBackendStory]);

  const story = isBackendStory ? backendStory : mockStory;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !story ? (
          <div className="text-center py-24">
            <p className="font-serif text-xl text-muted-foreground mb-6">
              क्षमा करें, आपकी मांगी हुई कहानी नहीं मिल सकी।
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate(-1)}>
                वापस जाएं
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/stories">
                  सभी कहानियां देखें
                </Link>
              </Button>
            </div>
          </div>
        ) : isBackendStory && backendStory ? (
          // Backend Story Display
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <Button variant="ghost" className="px-0 hover:text-accent hover:bg-transparent" asChild>
                <Link to="/stories">
                  ← कहानियों पर वापस जाएं
                </Link>
              </Button>
            </div>

            {backendStory.image && (
              <div className="overflow-hidden rounded-3xl divine-shadow mb-10">
                <img
                  src={getImageUrl(backendStory.image)}
                  alt={backendStory.title?.hi || backendStory.title?.en || 'Story image'}
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-6">
              <h1 className="font-decorative text-4xl md:text-5xl font-bold text-foreground">
                {backendStory.title?.hi || backendStory.title?.en || 'Title not available'}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-serif border-l-4 border-accent pl-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  <span className="font-medium">{backendStory.author?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{backendStory.author?.location?.hi || backendStory.author?.location?.en || 'Unknown location'}</span>
                </div>
                {backendStory.featured && (
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                    ⭐ विशेष कहानी
                  </div>
                )}
              </div>

              <div className="font-serif text-lg text-foreground leading-relaxed text-justify space-y-4 mt-8">
                {(backendStory.content?.hi || backendStory.content?.en || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ) : (
                    <div key={index} className="h-2"></div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : mockStory ? (
          // Mock Story Display (existing code)
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <Button variant="ghost" className="px-0 hover:text-accent hover:bg-transparent" asChild>
                <Link to="/stories">
                  ← कहानियों पर वापस जाएं
                </Link>
              </Button>
            </div>

            <div className="overflow-hidden rounded-3xl divine-shadow">
              <img
                src={mockStory.coverImage}
                alt={mockStory.title.hi}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-10 space-y-6">
              <h1 className="font-decorative text-4xl md:text-5xl font-bold text-foreground">
                {mockStory.title.hi}
              </h1>
              <div className="font-serif text-lg text-muted-foreground leading-relaxed text-justify space-y-4">
                {mockStory.content.hi.split('\n').map((line, index) => {
                  // Check if line is a main heading (ends with specific patterns or is all caps)
                  if (line.trim() && (
                    line.includes('–') && line.length < 100 ||
                    line.match(/^[A-Z\s]+$/) ||
                    line.match(/^[\u0900-\u097F\s]+$/) && line.length < 80
                  )) {
                    return (
                      <h2 key={index} className="font-decorative text-2xl font-bold text-foreground mt-6 mb-3">
                        {line}
                      </h2>
                    );
                  }
                  // Check if line starts with a number (numbered list)
                  else if (line.trim().match(/^\d+\./)) {
                    return (
                      <p key={index} className="font-bold text-foreground mt-4">
                        {line}
                      </p>
                    );
                  }
                  // Regular paragraph
                  else if (line.trim()) {
                    return (
                      <p key={index} className="leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                  // Empty line for spacing
                  return <div key={index} className="h-2"></div>;
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default StoryDetail;

