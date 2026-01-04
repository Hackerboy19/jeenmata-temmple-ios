import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  className?: string;
}

export const ServiceCard = ({ icon: Icon, title, description, link, className }: ServiceCardProps) => {
  return (
    <Link to={link}>
      <Card className={cn(
        "group hover:scale-105 transition-all duration-300 divine-shadow hover:golden-border bg-card",
        className
      )}>
        <CardContent className="p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-decorative text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="font-serif text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
