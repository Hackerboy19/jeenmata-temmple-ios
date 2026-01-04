import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted lotus-pattern">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="font-decorative text-6xl font-bold text-primary">404</h1>
        <p className="font-serif text-2xl text-foreground">Page Not Found</p>
        <p className="font-serif text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/" 
          className="inline-block px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-serif rounded-md transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
