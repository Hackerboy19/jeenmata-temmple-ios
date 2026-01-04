import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Building, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const donationOptions = [
  {
    icon: Building,
    title: "Temple Development",
    description: "Support infrastructure development and maintenance of the sacred temple premises",
    suggested: "₹5,000"
  },
  {
    icon: Users,
    title: "Annadan / Prasad Seva",
    description: "Sponsor meals and prasad distribution for devotees visiting the temple",
    suggested: "₹2,100"
  },
  {
    icon: Sparkles,
    title: "Festival Sponsorship",
    description: "Support grand celebrations of Navratri, Chaitra Mela, and other festivals",
    suggested: "₹11,000"
  },
  {
    icon: Heart,
    title: "General Donation",
    description: "Contribute towards daily temple operations and devotee services",
    suggested: "₹1,000"
  }
];

const Donation = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donationType, setDonationType] = useState("General Donation");
  const [isSecretDonation, setIsSecretDonation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuickAmount = (amount: string) => {
    // Remove ₹ and comma from amount string (e.g., "₹1,000" -> "1000")
    const numericAmount = amount.replace(/[₹,]/g, '');
    setDonationAmount(numericAmount);
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!isSecretDonation && (!donorName || !donorEmail || !donorPhone)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!donationAmount) {
      toast({
        title: "Validation Error",
        description: "Please enter donation amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(donationAmount);
    if (amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum donation amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    
    setIsProcessing(true);

    try {
      await initiatePayment({
        amount,
        paymentFor: 'donation',
        userDetails: {
          name: isSecretDonation ? 'Anonymous Donor' : donorName,
          email: isSecretDonation ? 'anonymous@temple.com' : donorEmail,
          phone: isSecretDonation ? '0000000000' : donorPhone,
        },
        metadata: {
          donationType,
          isSecretDonation,
        },
        onSuccess: (response) => {
          setIsProcessing(false);
          // Reset form
          setDonationAmount("");
          setDonorName("");
          setDonorEmail("");
          setDonorPhone("");
          // Redirect or show success message
          setTimeout(() => {
            navigate("/");
          }, 2000);
        },
        onFailure: (error) => {
          setIsProcessing(false);
        },
      });
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Heart className="w-16 h-16 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              🙏 Offer Your Seva to Mata Rani
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              Your generous contribution helps preserve this sacred heritage and serve millions of devotees
            </p>
          </div>
        </section>

        {/* Donation Options */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-decorative text-3xl font-bold text-foreground mb-4">
                Ways to Contribute
              </h2>
              <p className="font-serif text-lg text-muted-foreground">
                Choose a seva that resonates with your devotion
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {donationOptions.map((option, index) => (
                <Card
                  key={index}
                  className={`divine-shadow transition-all cursor-pointer ${
                    selectedOption === index ? "golden-border" : "hover:golden-border"
                  }`}
                  onClick={() => {
                    setSelectedOption(index);
                    setDonationType(option.title);
                    handleQuickAmount(option.suggested);
                  }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20">
                      <option.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-decorative text-xl font-bold">{option.title}</h3>
                    <p className="font-serif text-sm text-muted-foreground">{option.description}</p>
                    <p className="font-serif text-lg text-accent font-bold">
                      Suggested: {option.suggested}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Donation Form */}
            <div className="max-w-2xl mx-auto">
              <Card className="divine-shadow golden-border">
                <CardContent className="p-8">
                  <h3 className="font-decorative text-2xl font-bold mb-6 text-center">
                    Make Your Donation
                  </h3>
                  <form onSubmit={handleDonation} className="space-y-6">
                    <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                      <Checkbox 
                        id="secret-donation" 
                        checked={isSecretDonation}
                        onCheckedChange={(checked) => setIsSecretDonation(checked as boolean)}
                      />
                      <Label 
                        htmlFor="secret-donation" 
                        className="font-serif text-sm cursor-pointer"
                      >
                        Make this a secret donation (your name will remain anonymous)
                      </Label>
                    </div>
                    {!isSecretDonation && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="donor-name" className="font-serif">Full Name *</Label>
                          <Input 
                            id="donor-name" 
                            placeholder="Enter your name" 
                            className="font-serif" 
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            required={!isSecretDonation}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="donor-phone" className="font-serif">Phone Number *</Label>
                            <Input 
                              id="donor-phone" 
                              type="tel" 
                              placeholder="Enter phone number" 
                              className="font-serif"
                              value={donorPhone}
                              onChange={(e) => setDonorPhone(e.target.value)}
                              required={!isSecretDonation}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="donor-email" className="font-serif">Email Address *</Label>
                            <Input 
                              id="donor-email" 
                              type="email" 
                              placeholder="Enter email" 
                          className="font-serif"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          required={!isSecretDonation}
                        />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="donation-type" className="font-serif">Donation Purpose *</Label>
                          <select 
                            id="donation-type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
                            value={donationType}
                            onChange={(e) => setDonationType(e.target.value)}
                          >
                            <option>Temple Development</option>
                            <option>Annadan / Prasad Seva</option>
                            <option>Festival Sponsorship</option>
                            <option>General Donation</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="font-serif">Donation Amount (₹) *</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        min="100" 
                        placeholder="Enter amount" 
                        className="font-serif text-lg"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <p className="font-serif text-sm text-muted-foreground">
                        Quick amount selection:
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {['₹500', '₹1,000', '₹2,100', '₹5,000'].map((amt) => (
                          <Button 
                            key={amt} 
                            type="button" 
                            variant="outline" 
                            className="font-serif"
                            onClick={() => handleQuickAmount(amt)}
                          >
                            {amt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {!isSecretDonation && (
                      <div className="space-y-2">
                        <Label htmlFor="pan" className="font-serif">PAN Number (for 80G receipt)</Label>
                        <Input id="pan" placeholder="ABCDE1234F" className="font-serif uppercase" />
                        <p className="text-xs text-muted-foreground font-serif">
                          Optional: Required only if you need a tax exemption certificate under section 80G
                        </p>
                      </div>
                    )}

                    <Button 
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                      disabled={isProcessing}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      {isProcessing ? "Processing..." : "Proceed to Payment"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground font-serif">
                      You will receive an auto-generated receipt via email after successful payment
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Thank You Message */}
        <section className="py-16 bg-muted lotus-pattern">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <Sparkles className="w-12 h-12 text-accent mx-auto diya-glow" />
              <h2 className="font-decorative text-3xl font-bold text-foreground">
                Your Contribution Matters
              </h2>
              <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                Every donation, big or small, helps us maintain this sacred temple, serve devotees 
                with prasad and accommodation, organize grand festivals, and preserve our spiritual heritage. 
                May Maa Jeen Mata Ji bless you and your family with health, prosperity, and happiness.
              </p>
              <p className="font-decorative text-xl text-accent">
                जय श्री जीण माता जी 🙏
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Donation;
