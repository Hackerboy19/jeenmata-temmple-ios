import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-temple.jpg";
import api, { Project, getImageUrl } from "@/services/api";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.projects.getAll();
      if (response.success && response.data) {
        // Filter only active projects
        const activeProjects = response.data.filter((p) => p.isActive);
        setProjects(activeProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Building className="w-16 h-16 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              Temple Development Projects
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              Join us in building a better future for this sacred temple and its devotees
            </p>
          </div>
        </section>

        {/* Projects Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-decorative text-3xl font-bold text-foreground mb-4">
                Ongoing & Upcoming Projects
              </h2>
              <p className="font-serif text-lg text-muted-foreground max-w-3xl mx-auto">
                Your generous contributions help us maintain this sacred heritage and serve devotees better. 
                Every donation brings us closer to completing these important projects.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No projects available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-8 max-w-5xl mx-auto">
                {projects.map((project) => (
                  <Card key={project._id} className="divine-shadow hover:golden-border transition-all">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-decorative text-2xl font-bold text-foreground mb-2">
                                {project.name}
                              </h3>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-serif ${
                                project.status === 'Ongoing' 
                                  ? 'bg-accent/20 text-accent' 
                                  : project.status === 'Completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>

                          <p className="font-serif text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-serif">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-accent font-bold">{Math.round((project.achieved / project.goal) * 100)}%</span>
                            </div>
                            <Progress value={(project.achieved / project.goal) * 100} className="h-2" />
                            <div className="flex justify-between text-sm font-serif">
                              <span className="text-muted-foreground">
                                Raised: <strong className="text-foreground">{formatCurrency(project.achieved)}</strong>
                              </span>
                              <span className="text-muted-foreground">
                                Target: <strong className="text-foreground">{formatCurrency(project.goal)}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-4">
                          {project.image ? (
                            <div className="aspect-square rounded-lg overflow-hidden">
                              <img 
                                src={getImageUrl(project.image)} 
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square rounded-lg overflow-hidden">
                              <img 
                                src={heroImage} 
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <Link to="/donation">
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif">
                              <Heart className="w-4 h-4 mr-2" />
                              Contribute Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted lotus-pattern">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-decorative text-3xl font-bold text-foreground">
                Be Part of This Divine Mission
              </h2>
              <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                Your contribution, no matter how small, makes a significant difference in preserving 
                this sacred temple and serving thousands of devotees who visit seeking divine blessings. 
                Together, we can ensure that future generations continue to experience the spiritual 
                grace of Maa Jeen Mata Ji.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/donation">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8">
                    Make a Donation
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 font-serif text-lg px-8">
                  Contact Trust
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;

