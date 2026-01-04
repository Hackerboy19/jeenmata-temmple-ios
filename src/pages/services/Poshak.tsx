import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shirt, Heart, Sparkles, Gift, Upload, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useMembershipBenefits } from "@/hooks/useMembershipBenefits";
import { MembershipBenefitOption } from "@/components/MembershipBenefitOption";

const Poshak = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment } = useRazorpay();
  const [selectedPoshak, setSelectedPoshak] = useState<number | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  } = useMembershipBenefits('poshak', selectedPoshak !== null);
  
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    nationality: "Indian",
    mobile: "",
    email: "",
    membershipId: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    idProof: "Aadhaar Card",
    idNumber: "",
    bookingDate: "",
    amount: "1100"
  });

  const poshakOption = {
    name: "Mata Ji Poshak",
    nameHi: "माता जी पोशाक",
    price: "₹5100.00",
    description: "Sacred garment for divine adornment",
    descriptionHi: "दिव्य श्रृंगार के लिए पवित्र वस्त्र"
  };

  const handleCardClick = () => {
    setSelectedPoshak(0);
    // Extract numeric value from price string (e.g., "₹5100.00" -> "5100")
    const price = poshakOption.price.replace(/[₹,]/g, '').split('.')[0];
    setFormData({
      ...formData,
      amount: price
    });
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceType: 'poshak' as const,
        name: formData.name,
        gender: formData.gender,
        nationality: formData.nationality,
        mobile: formData.mobile,
        email: formData.email,
        membershipId: useMembershipBenefit ? selectedBenefit?.membershipId : (formData.membershipId || undefined),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        idProof: formData.idProof,
        idNumber: formData.idNumber,
        poshakType: poshakOption.name,
        poshakDate: formData.bookingDate,
        amount: useMembershipBenefit ? 0 : parseFloat(formData.amount),
        useMembershipBenefit: useMembershipBenefit,
        membershipBenefitDetails: useMembershipBenefit ? { membershipId: selectedBenefit.membershipId, benefitType: selectedBenefit.benefitType } : undefined
      };

      // If using membership benefit, create booking directly without payment
      if (useMembershipBenefit) {
        await api.serviceBookings.createBooking(bookingData);
        
        toast({
          title: "Booking Successful!",
          description: "Your Poshak booking has been confirmed using your membership benefit. Check your email for details.",
        });

        setFormData({
          name: "",
          gender: "",
          nationality: "Indian",
          mobile: "",
          email: "",
          membershipId: "",
          address: "",
          city: "",
          state: "",
          pinCode: "",
          idProof: "Aadhaar Card",
          idNumber: "",
          bookingDate: "",
          amount: "1100"
        });
        setSelectedPoshak(null);
        setUseMembershipBenefit(false);
        
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      const response = await api.serviceBookings.createBooking(bookingData);
      const bookingId = response.data._id;
      
      // Initiate Razorpay payment
      await initiatePayment({
        amount: parseFloat(formData.amount),
        paymentFor: 'service-booking',
        userDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile
        },
        metadata: {
          bookingId: bookingId,
          serviceType: 'poshak'
        },
        onSuccess: () => {
          toast({
            title: "Booking Successful!",
            description: "Your Poshak booking has been confirmed. Check your email for details.",
          });

          setFormData({
            name: "",
            gender: "",
            nationality: "Indian",
            mobile: "",
            email: "",
            membershipId: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            idProof: "Aadhaar Card",
            idNumber: "",
            bookingDate: "",
            amount: "1100"
          });
          setSelectedPoshak(null);
          
          setTimeout(() => navigate('/'), 2000);
        },
        onFailure: async () => {
          // Delete the booking since payment failed
          try {
            await api.serviceBookings.deleteBooking(bookingId);
          } catch (error) {
            console.error('Failed to delete booking:', error);
          }
          
          toast({
            title: "Payment Failed",
            description: "Payment was cancelled or failed. Please try again.",
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Shirt className="w-20 h-20 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Shree Jeen Mata Poshak" : "श्री जीण माता पोशाक"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Contribute to the divine adornment of Mata Rani"
                : "माता रानी के दिव्य श्रृंगार में योगदान करें"}
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">

              {/* Poshak Options */}
              <div>
                <h2 className="font-decorative text-4xl md:text-5xl text-center text-primary mb-4">
                  {isEnglish ? "Poshak Option" : "पोशाक विकल्प"}
                </h2>
                <p className="font-serif text-muted-foreground max-w-2xl mx-auto text-center mb-12">
                  {isEnglish 
                    ? "Donate sacred garment for the divine adornment of Mata Ji"
                    : "माता जी के दिव्य श्रृंगार के लिए पवित्र वस्त्र दान करें"}
                </p>

                <div className="flex justify-center">
                  <Card 
                    className="divine-shadow hover:golden-border transition-all duration-500 overflow-visible group cursor-pointer transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 relative w-full sm:max-w-sm mx-4 sm:mx-0"
                    onClick={handleCardClick}
                  >
                    {/* Shine effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-30 pointer-events-none"></div>
                    
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                    
                    {/* Selected checkmark badge - top right */}
                    {selectedPoshak !== null && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full p-2.5 z-20 animate-bounce shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* "Selected" badge - top left */}
                    {selectedPoshak !== null && (
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse shadow-lg">
                        {isEnglish ? "Selected" : "चयनित"}
                      </div>
                    )}
                    
                    <CardContent className="p-6 sm:p-10 relative bg-gradient-to-br from-card via-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-accent/10 transition-colors duration-500 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                      {/* Decorative top border */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Decorative icon at top */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                        <Shirt className="w-20 h-20 text-accent" />
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6 relative z-10">
                        <div className="text-center space-y-2 sm:space-y-3">
                          <h3 className="font-decorative text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                            {isEnglish ? poshakOption.name : poshakOption.nameHi}
                          </h3>
                          <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                            <Package className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                            <p className="font-serif text-base font-semibold text-muted-foreground group-hover:text-accent transition-colors duration-300">
                              {isEnglish ? poshakOption.description : poshakOption.descriptionHi}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300">
                          <div className="text-center">
                            <p className="font-serif text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300 inline-block">{poshakOption.price}</p>
                            <p className="text-sm text-muted-foreground font-serif mt-1">{isEnglish ? "Per Poshak" : "प्रति पोशाक"}</p>
                          </div>
                          <div className="flex justify-center">
                            <div className="bg-gradient-to-r from-accent/20 to-accent/10 group-hover:from-accent group-hover:to-accent/90 text-muted-foreground group-hover:text-accent-foreground px-6 py-3 rounded-full transition-all duration-300 shadow-md group-hover:shadow-xl">
                              <span className="text-sm font-serif font-bold flex items-center gap-2">
                                <Gift className="w-4 h-4" />
                                {isEnglish ? "Select" : "चुनें"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Booking Form - Shows when poshak is selected */}
              {selectedPoshak !== null && (
                <Card id="booking-form" className="divine-shadow golden-border">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="font-decorative text-2xl text-primary mb-2">
                        {isEnglish ? "Fill Donation Details" : "दान विवरण भरें"}
                      </h2>
                      <p className="font-serif text-sm text-muted-foreground">
                        {isEnglish ? "Complete the form to donate poshak" : "पोशाक दान करने के लिए फॉर्म भरें"}
                      </p>
                    </div>
                    
                    {/* Selected Poshak Info */}
                    <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
                      <h3 className="font-decorative text-lg font-bold text-foreground mb-3">
                        {isEnglish ? "Selected Poshak" : "चयनित पोशाक"}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-serif text-lg font-bold text-foreground">
                            {isEnglish ? poshakOption.name : poshakOption.nameHi}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <p className="font-serif text-sm text-muted-foreground">
                              {isEnglish ? poshakOption.description : poshakOption.descriptionHi}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-accent">
                            {poshakOption.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Donation Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-xl text-primary">
                          {isEnglish ? "Personal Information" : "व्यक्तिगत जानकारी"}
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-serif">
                              {isEnglish ? "Full Name *" : "पूरा नाम *"}
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender" className="font-serif">
                              {isEnglish ? "Gender *" : "लिंग *"}
                            </Label>
                            <select 
                              id="gender" 
                              name="gender" 
                              value={formData.gender}
                              onChange={handleInputChange}
                              required 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
                            >
                              <option value="">{isEnglish ? "Select Gender" : "लिंग चुनें"}</option>
                              <option value="Male">{isEnglish ? "Male" : "पुरुष"}</option>
                              <option value="Female">{isEnglish ? "Female" : "महिला"}</option>
                              <option value="Other">{isEnglish ? "Other" : "अन्य"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nationality" className="font-serif">
                              {isEnglish ? "Nationality *" : "राष्ट्रीयता *"}
                            </Label>
                            <Input
                              id="nationality"
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mobile" className="font-serif">
                              {isEnglish ? "Mobile Number *" : "मोबाइल नंबर *"}
                            </Label>
                            <Input
                              id="mobile"
                              name="mobile"
                              type="tel"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="font-serif">
                              {isEnglish ? "Email Address *" : "ईमेल पता *"}
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="membershipId" className="font-serif">
                              {isEnglish ? "Membership ID (Optional)" : "सदस्यता आईडी (वैकल्पिक)"}
                            </Label>
                            <Input
                              id="membershipId"
                              name="membershipId"
                              value={formData.membershipId}
                              onChange={handleInputChange}
                              className="font-serif"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-xl text-primary">
                          {isEnglish ? "Address Details" : "पता विवरण"}
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address" className="font-serif">
                            {isEnglish ? "Full Address *" : "पूरा पता *"}
                          </Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="font-serif"
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="font-serif">
                              {isEnglish ? "City *" : "शहर *"}
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state" className="font-serif">
                              {isEnglish ? "State *" : "राज्य *"}
                            </Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pinCode" className="font-serif">
                              {isEnglish ? "Pin Code *" : "पिन कोड *"}
                            </Label>
                            <Input
                              id="pinCode"
                              name="pinCode"
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ID Proof Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-xl text-primary">
                          {isEnglish ? "ID Proof Details" : "आईडी प्रूफ विवरण"}
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="idProof" className="font-serif">
                              {isEnglish ? "ID Proof Type *" : "आईडी प्रूफ प्रकार *"}
                            </Label>
                            <Input 
                              id="idProof" 
                              name="idProof" 
                              value={formData.idProof}
                              readOnly
                              className="font-serif bg-muted"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="idNumber" className="font-serif">
                              {isEnglish ? "Aadhaar Number *" : "आधार नंबर *"}
                            </Label>
                            <Input 
                              id="idNumber" 
                              name="idNumber" 
                              value={formData.idNumber}
                              onChange={handleInputChange}
                              required 
                              className="font-serif"
                              placeholder="XXXX-XXXX-XXXX"
                              maxLength={12}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="document" className="font-serif">
                              {isEnglish ? "Upload Aadhaar Card *" : "आधार कार्ड अपलोड करें *"}
                            </Label>
                            <div className="flex items-center gap-4">
                              <Input 
                                id="document" 
                                name="document" 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                required 
                                className="font-serif"
                              />
                              <Upload className="w-6 h-6 text-accent" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Donation Amount */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-xl text-primary">
                          {isEnglish ? "Donation Details" : "दान विवरण"}
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="bookingDate" className="font-serif">
                              {isEnglish ? "Booking Date *" : "बुकिंग तिथि *"}
                            </Label>
                            <Input
                              id="bookingDate"
                              name="bookingDate"
                              type="date"
                              value={formData.bookingDate || ''}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amount" className="font-serif">
                              {isEnglish ? "Amount (₹) *" : "राशि (₹) *"}
                            </Label>
                            <Input 
                              id="amount" 
                              name="amount" 
                              type="number" 
                              min="1100" 
                              value={formData.amount}
                              onChange={handleInputChange}
                              required 
                              className="font-serif text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <MembershipBenefitOption
                        isEnglish={isEnglish}
                        availableBenefits={availableBenefits}
                        useMembershipBenefit={useMembershipBenefit}
                        setUseMembershipBenefit={setUseMembershipBenefit}
                        selectedBenefit={selectedBenefit}
                        setSelectedBenefit={setSelectedBenefit}
                        amount={formData.amount}
                      />

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1 font-serif"
                          onClick={() => setSelectedPoshak(null)}
                        >
                          {isEnglish ? "Cancel" : "रद्द करें"}
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting 
                            ? (isEnglish ? "Processing..." : "प्रक्रिया में...")
                            : useMembershipBenefit
                              ? (isEnglish ? "Confirm Booking (FREE)" : "बुकिंग की पुष्टि करें (मुफ़्त)")
                              : (isEnglish ? "Proceed to Payment" : "भुगतान के लिए आगे बढ़ें")
                          }
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <Card className="divine-shadow hover:golden-border transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8 text-center space-y-4 relative z-10">
                    <div className="inline-block p-4 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors duration-300">
                      <Gift className="w-14 h-14 text-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-decorative text-2xl font-bold group-hover:text-accent transition-colors duration-300">
                      {isEnglish ? "Sacred Offering" : "पवित्र भेंट"}
                    </h3>
                    <p className="font-serif text-muted-foreground leading-relaxed">
                      {isEnglish ? "Highly auspicious seva for devotees" : "भक्तों के लिए अत्यंत शुभ सेवा"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="divine-shadow hover:golden-border transition-all duration-500 group hover:scale-105 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8 text-center space-y-4 relative z-10">
                    <div className="inline-block p-4 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors duration-300">
                      <Heart className="w-14 h-14 text-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-decorative text-2xl font-bold group-hover:text-accent transition-colors duration-300">
                      {isEnglish ? "Blessed Seva" : "आशीर्वादित सेवा"}
                    </h3>
                    <p className="font-serif text-muted-foreground leading-relaxed">
                      {isEnglish ? "Receive special blessings from Mata Rani" : "माता रानी से विशेष आशीर्वाद प्राप्त करें"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* About Service */}
              <Card className="divine-shadow golden-border relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 md:p-10 space-y-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-12 bg-accent rounded-full"></div>
                    <h2 className="font-decorative text-3xl md:text-4xl text-primary">
                      {isEnglish ? "About Poshak Seva" : "पोशाक सेवा के बारे में"}
                    </h2>
                    <div className="h-1 flex-1 bg-accent/30 rounded-full"></div>
                  </div>
                  <p className="font-serif text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {isEnglish
                      ? "Donating poshak (sacred garments) to Maa Jeen Mata Ji is considered a highly auspicious seva. The deity is adorned with beautiful poshaks during various festivals and special occasions. Your contribution helps maintain the divine splendor of Mata Rani."
                      : "माँ जीण माता जी को पोशाक (पवित्र वस्त्र) दान करना एक अत्यंत शुभ सेवा मानी जाती है। विभिन्न त्योहारों और विशेष अवसरों पर देवी को सुंदर पोशाकों से सजाया जाता है। आपका योगदान माता रानी के दिव्य वैभव को बनाए रखने में मदद करता है।"}
                  </p>
                </CardContent>
              </Card>


              {/* Booking Section */}
              <Card className="divine-shadow golden-border bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 animate-pulse"></div>
                <CardContent className="p-10 md:p-12 text-center space-y-6 relative z-10">
                  <div className="inline-block p-5 bg-accent/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shirt className="w-16 h-16 text-accent" />
                  </div>
                  <h2 className="font-decorative text-4xl md:text-5xl text-primary">
                    {isEnglish ? "Donate Poshak" : "पोशाक दान करें"}
                  </h2>
                  <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {isEnglish
                      ? "Select your preferred poshak option and contribute to the divine seva of adorning Mata Rani."
                      : "अपना पसंदीदा पोशाक विकल्प चुनें और माता रानी को सजाने की दिव्य सेवा में योगदान करें।"}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="h-1 w-16 bg-accent rounded-full animate-pulse"></div>
                    <div className="h-1 w-16 bg-accent/60 rounded-full animate-pulse delay-100"></div>
                    <div className="h-1 w-16 bg-accent/30 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <Link to="/service-booking?service=poshak">
                    <Button size="lg" className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-serif text-xl px-12 py-7 shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300 mt-6">
                      <span className="mr-2">{isEnglish ? "Donate Now" : "अभी दान करें"}</span>
                      <Shirt className="w-6 h-6" />
                    </Button>
                  </Link>
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

export default Poshak;
