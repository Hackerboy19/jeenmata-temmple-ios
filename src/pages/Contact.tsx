import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Contact Us" : "हमसे संपर्क करें"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "We're here to help you with any queries or information about the temple"
                : "मंदिर से संबंधित किसी भी जानकारी या प्रश्न के लिए हम सदैव उपलब्ध हैं"}
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-decorative text-3xl font-bold text-foreground mb-6">
                    {isEnglish ? "Get In Touch" : "संपर्क में रहें"}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                    {isEnglish
                      ? "Feel free to reach out to us for any information regarding darshan timings, bookings, donations, or general inquiries. We're always happy to assist you."
                      : "दर्शन समय, बुकिंग, दान या किसी सामान्य जानकारी के लिए हमसे बेझिझक संपर्क करें। आपकी सहायता करना हमारा सौभाग्य है।"}
                  </p>
                </div>

                <Card className="divine-shadow">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-decorative text-lg font-bold text-foreground mb-1">
                          {isEnglish ? "Temple Address" : "मंदिर का पता"}
                        </h3>
                        <p className="font-serif text-muted-foreground">
                          {isEnglish ? (
                            <>
                              Shree Jeen Mata Ji Mandir Trust<br />
                              Sikar District<br />
                              Rajasthan - 332001, India
                            </>
                          ) : (
                            <>
                              श्री जीण माता जी मंदिर ट्रस्ट<br />
                              सीकर जिला<br />
                              राजस्थान - 332001, भारत
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-decorative text-lg font-bold text-foreground mb-1">
                          {isEnglish ? "Phone Numbers" : "फोन नंबर"}
                        </h3>
                        <p className="font-serif text-muted-foreground">
                          <a href="tel:01576227346">01576-227346</a><br />
                          
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-decorative text-lg font-bold text-foreground mb-1">
                          {isEnglish ? "Email Address" : "ईमेल पता"}
                        </h3>
                        <p className="font-serif text-muted-foreground">
                          <a href="mailto:sjmmtrust@gmail.com">sjmmtrust@gmail.com</a><br />
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-decorative text-lg font-bold text-foreground mb-1">
                          {isEnglish ? "Aarti Timings" : "आरती के समय"}
                        </h3>
                        <p className="font-serif text-muted-foreground">
                          <strong>{isEnglish ? "Morning:" : "सुबह:"}</strong> 7:10 AM - 7:30 AM<br />
                          <strong>{isEnglish ? "Evening:" : "शाम:"}</strong> 7:25 PM - 8:20 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <div>
                  <h3 className="font-decorative text-xl font-bold text-foreground mb-4">
                    {isEnglish ? "Follow Us On Social Media" : "सोशल मीडिया पर हमें फॉलो करें"}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="https://www.facebook.com/shrijeenmata.trust/" target="_blank"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.youtube.com/channel/UCi_llbNRYH0QNl0cLW5ubRQ" target="_blank"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.instagram.com/shrijeenmata" target="_blank" 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="divine-shadow golden-border">
                <CardContent className="p-8">
                  <h3 className="font-decorative text-2xl font-bold mb-6 text-center">
                    {isEnglish ? "Send Us a Message" : "हमें संदेश भेजें"}
                  </h3>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="font-serif">
                          {isEnglish ? "Full Name *" : "पूरा नाम *"}
                        </Label>
                        <Input
                          id="contact-name"
                          placeholder={isEnglish ? "Enter your name" : "अपना नाम लिखें"}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="font-serif">
                          {isEnglish ? "Phone Number *" : "फोन नंबर *"}
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder={isEnglish ? "Enter phone" : "फोन नंबर दर्ज करें"}
                          className="font-serif"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="font-serif">
                        {isEnglish ? "Email Address *" : "ईमेल पता *"}
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder={isEnglish ? "Enter email" : "ईमेल दर्ज करें"}
                        className="font-serif"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-serif">
                        {isEnglish ? "Subject *" : "विषय *"}
                      </Label>
                      <Input
                        id="subject"
                        placeholder={isEnglish ? "What is your inquiry about?" : "आपका प्रश्न किस बारे में है?"}
                        className="font-serif"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-serif">
                        {isEnglish ? "Message *" : "संदेश *"}
                      </Label>
                      <Textarea 
                        id="message" 
                        placeholder={isEnglish ? "Write your message here..." : "अपना संदेश यहाँ लिखें..."} 
                        className="font-serif h-32"
                        required
                      />
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6">
                      {isEnglish ? "Submit Inquiry" : "अनुरोध भेजें"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground font-serif">
                      {isEnglish
                        ? "We'll respond to your inquiry within 24-48 hours"
                        : "हम 24-48 घंटों के भीतर आपके अनुरोध का उत्तर देंगे"}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-decorative text-3xl font-bold text-foreground mb-4">
                {isEnglish ? "Find Us On Map" : "मानचित्र पर हमें खोजें"}
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                {isEnglish
                  ? "Located in the serene Aravalli hills near Sikar, Rajasthan"
                  : "सीकर, राजस्थान के शांत अरावली पर्वत पर स्थित"}
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <Card className="divine-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full pb-[56.25%] bg-muted">
                    <iframe
                      title="Jeen Mata Mandir Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.804516398857!2d75.19298281453243!3d27.444202343614855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c97049200dce7%3A0x2f3ba57190eff5!2sJeen%20Mata%20Mandir!5e0!3m2!1sen!2sin!4v1589696563662!5m2!1sen!2sin"
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-6 bg-background flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                      <p className="font-decorative text-2xl text-foreground">
                        {isEnglish ? "Jeen Mata Mandir" : "जीण माता मंदिर"}
                      </p>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Sikar District, Rajasthan" : "सीकर जिला, राजस्थान"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="font-serif"
                      asChild
                    >
                      <a
                        href="https://maps.google.com/?q=Jeen+Mata+Mandir"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isEnglish ? "Open in Google Maps" : "गूगल मैप्स में खोलें"}
                      </a>
                    </Button>
                  </div>
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

export default Contact;
