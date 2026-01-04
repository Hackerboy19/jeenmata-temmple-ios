import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Index from "./pages/Index";
import About from "./pages/About";
import LiveDarshan from "./pages/LiveDarshan";
import Booking from "./pages/Booking";
import Donation from "./pages/Donation";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Membership from "./pages/Membership";
import Services from "./pages/Services";
import ServiceBooking from "./pages/ServiceBooking";
import DivyaDarshan from "./pages/services/DivyaDarshan";
import SpecialPooja from "./pages/services/SpecialPooja";
import Bhog from "./pages/services/Bhog";
import Poshak from "./pages/services/Poshak";
import Accommodation from "./pages/services/Accommodation";
import SevaSatkar from "./pages/services/SevaSatkar";
import Sawamani from "./pages/services/Sawamani";
import Prasad from "./pages/services/Prasad";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PaymentCallback from "./pages/PaymentCallback";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/darshan" element={<LiveDarshan />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/backend/:id" element={<StoryDetail />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/divya-darshan" element={<DivyaDarshan />} />
              <Route path="/services/special-pooja" element={<SpecialPooja />} />
              <Route path="/services/bhog" element={<Bhog />} />
              <Route path="/services/poshak" element={<Poshak />} />
              <Route path="/services/accommodation" element={<Accommodation />} />
              <Route path="/services/seva-satkar" element={<SevaSatkar />} />
              <Route path="/services/sawamani" element={<Sawamani />} />
              <Route path="/services/prasad" element={<Prasad />} />
              <Route path="/service-booking" element={<ServiceBooking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/payment-callback" element={<PaymentCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <MobileBottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
