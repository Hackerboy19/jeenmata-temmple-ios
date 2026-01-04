import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Clock, Camera, Heart, Gift, Package, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useMembershipBenefits } from "@/hooks/useMembershipBenefits";
import { MembershipBenefitOption } from "@/components/MembershipBenefitOption";

const DivyaDarshan = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment } = useRazorpay();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  } = useMembershipBenefits('divya-darshan', isFormVisible);
  
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
    quantity: "1",
    amount: "200"
  });

  const handleCardClick = () => {
    setIsFormVisible(true);
    // Set default amount to 200 for Divya Darshan
    setFormData({
      ...formData,
      amount: "200"
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
        serviceType: 'divya-darshan' as const,
        name: formData.name,
        gender: formData.gender,
        nationality: formData.nationality,
        mobile: formData.mobile,
        email: formData.email,
        membershipId: useMembershipBenefit ? selectedBenefit?.membershipId : (formData.membershipId || undefined),
        useMembershipBenefit: useMembershipBenefit,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        idProof: formData.idProof,
        idNumber: formData.idNumber,
        bookingDate: formData.bookingDate,
        quantity: parseInt(formData.quantity),
        amount: useMembershipBenefit ? 0 : parseFloat(formData.amount)
      };

      // If using membership benefit, create booking directly without payment
      if (useMembershipBenefit) {
        const response = await api.serviceBookings.createBooking(bookingData);
        
        toast({
          title: isEnglish ? "Booking Successful!" : "बुकिंग सफल!",
          description: isEnglish 
            ? `Your Divya Darshan booking has been confirmed using membership benefit. ${selectedBenefit.remaining - 1} benefits remaining.`
            : `आपकी दिव्य दर्शन बुकिंग सदस्यता लाभ का उपयोग करके पुष्टि की गई है। ${selectedBenefit.remaining - 1} लाभ शेष हैं।`,
        });

        // Reset form
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
          quantity: "1",
          amount: "200"
        });
        setIsFormVisible(false);
        setUseMembershipBenefit(false);
        
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        return;
      }

      // Otherwise, proceed with payment
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
          serviceType: 'divya-darshan'
        },
        onSuccess: (paymentData) => {
          toast({
            title: "Booking Successful!",
            description: "Your Divya Darshan booking has been confirmed. Check your email for details.",
          });

          // Reset form
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
            quantity: "1",
            amount: "200"
          });
          setIsFormVisible(false);
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        },
        onFailure: async (error) => {
          // Delete the booking since payment failed
          try {
            await api.serviceBookings.deleteBooking(bookingId);
          } catch (deleteError) {
            console.error('Failed to delete booking:', deleteError);
          }
          
          toast({
            title: "Payment Failed",
            description: error.message || "Payment was cancelled or failed. Please try again.",
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
            <Eye className="w-20 h-20 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Divya Darshan" : "दिव्य दर्शन"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Experience the divine presence of Maa Jeen Mata Ji"
                : "माँ जीण माता जी की दिव्य उपस्थिति का अनुभव करें"}
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              
              {/* Darshan Options Card */}
              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="font-decorative text-4xl md:text-5xl text-center text-primary mb-4">
                    {isEnglish ? "Darshan Options" : "दर्शन विकल्प"}
                  </h2>
                  <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                    {isEnglish 
                      ? "Choose your preferred darshan timing"
                      : "अपना पसंदीदा दर्शन समय चुनें"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Card 
                    className={`divine-shadow hover:golden-border transition-all duration-500 overflow-visible group cursor-pointer transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 hover:z-50 relative ${isFormVisible ? 'ring-4 ring-accent shadow-2xl shadow-accent/50 scale-105 -translate-y-2 z-40' : 'z-10'} w-full sm:max-w-sm mx-4 sm:mx-0`}
                    onClick={handleCardClick}
                  >
                    {/* Shine effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-30 pointer-events-none"></div>
                    
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                    
                    {/* Selected checkmark badge */}
                    {isFormVisible && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full p-2.5 z-20 animate-bounce shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Selected badge */}
                    {isFormVisible && (
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse shadow-lg">
                        {isEnglish ? "Selected" : "चयनित"}
                      </div>
                    )}
                    
                    <CardContent className="p-6 sm:p-10 relative bg-gradient-to-br from-card via-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-accent/10 transition-colors duration-500 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                      {/* Decorative top border */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Decorative icon at top */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                        <Eye className="w-20 h-20 text-accent" />
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6 relative z-10">
                        <div className="text-center space-y-2 sm:space-y-3">
                          <h3 className="font-decorative text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                            {isEnglish ? "Divine Darshan Booking" : "दिव्य दर्शन बुकिंग"}
                          </h3>
                          <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                            <Clock className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                            <p className="font-serif text-base font-semibold text-muted-foreground group-hover:text-accent transition-colors duration-300">
                              {isEnglish ? "Morning & Evening" : "सुबह और शाम"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300">
                          <div className="text-center">
                            <p className="font-serif text-3xl sm:text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300 inline-block">₹200.00</p>
                            <p className="text-sm text-muted-foreground font-serif mt-1">{isEnglish ? "Per Person" : "प्रति व्यक्ति"}</p>
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

              {/* Booking Form */}
              {isFormVisible && (
                <Card id="booking-form" className="divine-shadow golden-border animate-in slide-in-from-bottom-10 duration-700">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h2 className="font-decorative text-2xl text-primary mb-2">
                        {isEnglish ? "Fill Booking Details" : "बुकिंग विवरण भरें"}
                      </h2>
                      <p className="font-serif text-sm text-muted-foreground">
                        {isEnglish ? "Complete the form to book your darshan" : "अपना दर्शन बुक करने के लिए फॉर्म भरें"}
                      </p>
                    </div>
                    
                    {/* Selected Darshan Info */}
                    <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
                      <h3 className="font-decorative text-lg font-bold text-foreground mb-3">
                        {isEnglish ? "Selected Darshan" : "चयनित दर्शन"}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-serif text-lg font-bold text-foreground">
                            {isEnglish ? "Divine Darshan Booking" : "दिव्य दर्शन बुकिंग"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <p className="font-serif text-sm text-muted-foreground">
                              {isEnglish ? "Morning & Evening" : "सुबह और शाम"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-accent">₹200.00</p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Form */}
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

                      {/* Order Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-xl text-primary">
                          {isEnglish ? "Booking Details" : "बुकिंग विवरण"}
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
                            <Label htmlFor="quantity" className="font-serif">
                              {isEnglish ? "Number of Persons *" : "व्यक्तियों की संख्या *"}
                            </Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              type="number"
                              min="1"
                              value={formData.quantity}
                              onChange={handleInputChange}
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
                              min="200" 
                              value={formData.amount}
                              onChange={handleInputChange}
                              required 
                              className="font-serif text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Options */}
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
                          onClick={() => setIsFormVisible(false)}
                        >
                          {isEnglish ? "Cancel" : "रद्द करें"}
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting 
                            ? (isEnglish ? "Processing..." : "प्रक्रिया जारी है...")
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
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Clock className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Daily Timings" : "दैनिक समय"}
                    </h3>
                    <p className="font-serif text-muted-foreground">
                      {isEnglish ? "Morning: 6:00 AM - 12:00 PM\nEvening: 4:00 PM - 9:00 PM" : "प्रातः: सुबह 6:00 - दोपहर 12:00\nसायं: शाम 4:00 - रात 9:00"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Camera className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Live Streaming" : "लाइव स्ट्रीमिंग"}
                    </h3>
                    <p className="font-serif text-muted-foreground">
                      {isEnglish ? "Watch live darshan from anywhere in the world" : "दुनिया में कहीं से भी लाइव दर्शन देखें"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Heart className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Divine Blessings" : "दिव्य आशीर्वाद"}
                    </h3>
                    <p className="font-serif text-muted-foreground">
                      {isEnglish ? "Receive spiritual grace and divine blessings" : "आध्यात्मिक कृपा और दिव्य आशीर्वाद प्राप्त करें"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* About Service */}
              <Card className="divine-shadow golden-border">
                <CardContent className="p-8 space-y-6">
                  <h2 className="font-decorative text-3xl text-primary">
                    {isEnglish ? "About Divya Darshan" : "दिव्य दर्शन के बारे में"}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                    {isEnglish
                      ? "Divya Darshan provides you with the sacred opportunity to have a divine glimpse of Maa Jeen Mata Ji through our live streaming service or in-person visits. Experience the spiritual aura and receive blessings directly from the holy sanctum of the temple."
                      : "दिव्य दर्शन आपको हमारी लाइव स्ट्रीमिंग सेवा या व्यक्तिगत रूप से माँ जीण माता जी की दिव्य झलक पाने का पवित्र अवसर प्रदान करता है। मंदिर के पवित्र गर्भगृह से सीधे आध्यात्मिक आभा का अनुभव करें और आशीर्वाद प्राप्त करें।"}
                  </p>
                </CardContent>
              </Card>


              {/* Booking Section */}
              <Card className="divine-shadow golden-border bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8 text-center space-y-6">
                  <h2 className="font-decorative text-3xl text-primary">
                    {isEnglish ? "Book Your Darshan" : "अपना दर्शन बुक करें"}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
                    {isEnglish
                      ? "Book your slot for in-person darshan and ensure a smooth and blessed visit to the temple."
                      : "व्यक्तिगत दर्शन के लिए अपना स्लॉट बुक करें और मंदिर में एक सुचारू और धन्य यात्रा सुनिश्चित करें।"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/service-booking?service=darshan">
                      <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8">
                        {isEnglish ? "Book Now" : "अभी बुक करें"}
                      </Button>
                    </Link>
                    <Link to="/darshan">
                      <Button size="lg" variant="outline" className="font-serif text-lg px-8 border-2 border-accent">
                        {isEnglish ? "Watch Live Darshan" : "लाइव दर्शन देखें"}
                      </Button>
                    </Link>
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

export default DivyaDarshan;
