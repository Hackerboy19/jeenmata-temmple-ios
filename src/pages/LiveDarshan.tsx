import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Video } from "lucide-react";
import diyaImage from "@/assets/diya-decoration.jpg";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

const LiveDarshan = () => {
  const [aartiTimings, setAartiTimings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAartiTimings = async () => {
      try {
        const response = await api.aartiTimings.getAll();
        if (response.success) {
          setAartiTimings(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching aarti timings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAartiTimings();
  }, []);

  const morningTiming = aartiTimings.find(t => t.name === 'morning');
  const eveningTiming = aartiTimings.find(t => t.name === 'evening');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              Live Darshan
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              Experience the divine presence of Maa Jeen Mata Ji from anywhere in the world
            </p>
          </div>
        </section>

        {/* Live Stream Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="divine-shadow golden-border overflow-hidden">
                <CardContent className="p-0">
                  {/* Placeholder for live stream - would be replaced with actual embed */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-center space-y-4 mb-4">
                      <img src="/images/1621265219Maa_pic3.jpeg" alt="" />
                      <p className="font-decorative text-2xl text-foreground">Live Darshan Stream</p>
                      <p className="font-serif text-muted-foreground max-w-md px-4">
                        Live streaming is available during aarti timings. Subscribe to get notifications.
                      </p>
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground ">
                        <Bell className="w-4 h-4 mr-2 " />
                        Subscribe for Notifications
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Aarti Timings */}
        <section className="py-16 bg-muted lotus-pattern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-decorative text-3xl font-bold text-foreground mb-4">
                Daily Aarti Schedule
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                Join us for daily darshan and aarti ceremonies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {loading ? (
                <div className="col-span-2 text-center py-12">
                  <p className="font-serif text-muted-foreground">Loading aarti timings...</p>
                </div>
              ) : (
                <>
                  {morningTiming && (
                    <Card className="divine-shadow golden-border">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <img 
                            src={diyaImage} 
                            alt="Morning Aarti" 
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                          />
                          <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                        </div>
                        <h3 className="font-decorative text-2xl font-bold text-center text-foreground mb-4">
                          {morningTiming.title.en}
                        </h3>
                        <div className="text-center space-y-3">
                          <p className="font-serif text-4xl text-accent font-bold">
                            {morningTiming.startTime} - {morningTiming.endTime}
                          </p>
                          <p className="font-serif text-muted-foreground">
                            {morningTiming.description?.en || 'Begin your day with the divine blessings of Maa Jeen Mata Ji'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {eveningTiming && (
                    <Card className="divine-shadow golden-border">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <img 
                            src={diyaImage} 
                            alt="Evening Aarti" 
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                          />
                          <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                        </div>
                        <h3 className="font-decorative text-2xl font-bold text-center text-foreground mb-4">
                          {eveningTiming.title.en}
                        </h3>
                        <div className="text-center space-y-3">
                          <p className="font-serif text-4xl text-accent font-bold">
                            {eveningTiming.startTime} - {eveningTiming.endTime}
                          </p>
                          <p className="font-serif text-muted-foreground">
                            {eveningTiming.description?.en || 'Conclude your day in spiritual peace and divine grace'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="divine-shadow">
                <CardContent className="p-8">
                  <h3 className="font-decorative text-2xl font-bold text-center mb-6">
                    Guidelines for Virtual Darshan
                  </h3>
                  <ul className="space-y-4 font-serif text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-accent font-bold mr-3 mt-1">1.</span>
                      <span>Maintain a clean and peaceful environment before joining the live darshan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent font-bold mr-3 mt-1">2.</span>
                      <span>Light a diya or incense at your home altar if possible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent font-bold mr-3 mt-1">3.</span>
                      <span>Dress modestly and maintain respectful behavior during the stream</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent font-bold mr-3 mt-1">4.</span>
                      <span>Chant along with the aarti and offer your prayers with devotion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent font-bold mr-3 mt-1">5.</span>
                      <span>Subscribe to receive notifications before each aarti begins</span>
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

export default LiveDarshan;
