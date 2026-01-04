import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Package, Truck, Users, ChevronLeft, ChevronRight, Upload, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useMembershipBenefits } from "@/hooks/useMembershipBenefits";
import { MembershipBenefitOption } from "@/components/MembershipBenefitOption";

const SevaSatkar = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment } = useRazorpay();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [selectedSeva, setSelectedSeva] = useState<number | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  } = useMembershipBenefits('seva-satkar', selectedSeva !== null);
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
    amount: "500"
  });

  const sevaOptions = [
    { 
      name: "Ritual Bathing", 
      nameHi: "अभिषेक", 
      price: "₹1100"
    },
    { 
      name: "Unbroken sacred flame (oil/ghee lamp)", 
      nameHi: "अखण्ड ज्योत (तेल घी)", 
      price: "₹1100"
    },
    { 
      name: "Offering Bhog both times", 
      nameHi: "भोग दोनों समय", 
      price: "₹2100"
    },
    { 
      name: "Fragrance", 
      nameHi: "इत्र ", 
      price: "₹500"
    },
    { 
      name: "Food for 50 Brahmins", 
      nameHi: "50 ब्राह्मणो का भोजन", 
      price: "₹7500"
    },
    
  ];

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1280) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const totalCards = sevaOptions.length;
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + cardsPerView < totalCards;

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalCards - cardsPerView, prev + 1));
  };

  const handleCardClick = (index: number) => {
    setSelectedSeva(index);
    // Extract numeric value from price string (e.g., "₹1100" -> "1100")
    const price = sevaOptions[index].price.replace(/[₹,]/g, '').split('.')[0];
    setFormData({
      ...formData,
      amount: price
    });
    // Scroll to form
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
    
    if (selectedSeva === null) {
      toast({
        title: "Selection Required",
        description: "Please select a seva type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceType: 'seva-satkar' as const,
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
        sevaType: sevaOptions[selectedSeva].name,
        sevaDate: formData.bookingDate,
        quantity: parseInt(formData.quantity),
        amount: useMembershipBenefit ? 0 : parseFloat(formData.amount),
        useMembershipBenefit: useMembershipBenefit,
        membershipBenefitDetails: useMembershipBenefit ? { membershipId: selectedBenefit.membershipId, benefitType: selectedBenefit.benefitType } : undefined
      };

      // If using membership benefit, create booking directly without payment
      if (useMembershipBenefit) {
        await api.serviceBookings.createBooking(bookingData);
        
        toast({
          title: "Booking Successful!",
          description: "Your Seva Satkar booking has been confirmed using your membership benefit. Check your email for details.",
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
          quantity: "1",
          amount: "500"
        });
        setSelectedSeva(null);
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
          serviceType: 'seva-satkar'
        },
        onSuccess: () => {
          toast({
            title: "Booking Successful!",
            description: "Your Seva Satkar booking has been confirmed. Check your email for details.",
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
            quantity: "1",
            amount: "500"
          });
          setSelectedSeva(null);
          
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
        <section className="relative py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <Heart className="w-16 h-16 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Seva & Satkar" : "सेवा और सत्कार"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Serve the temple, serve the devotees, serve humanity"
                : "मंदिर की सेवा करें, भक्तों की सेवा करें, मानवता की सेवा करें"}
            </p>
          </div>
        </section>

        {/* Enhanced Seva Cards Section with Carousel */}
        <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Seva Options */}
            <div className="relative">
              <div className="text-center mb-12">
                
                <h2 className="font-decorative text-4xl md:text-5xl text-center text-primary mb-4">
                  {isEnglish ? "Seva Options" : "सेवा विकल्प"}
                </h2>
                <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                  {isEnglish 
                    ? "Choose from our divine collection of seva opportunities"
                    : "हमारे दिव्य सेवा अवसरों के संग्रह में से चुनें"}
                </p>
              </div>
              
              {/* Carousel Container */}
              <div className="relative py-4">
                {/* Previous Button */}
                {totalCards > cardsPerView && canScrollLeft && (
                  <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-gradient-to-r from-primary to-secondary hover:from-accent hover:to-accent/80 text-primary-foreground rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-accent/50"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Cards Container */}
                <div className="overflow-hidden py-8">
                  <div 
                    className={`flex transition-transform duration-500 ease-in-out ${cardsPerView === 1 ? 'gap-0' : 'gap-6'}`}
                    style={{
                      transform: `translateX(-${currentIndex * (100 / cardsPerView + (cardsPerView > 1 ? 1.5 : 0))}%)`
                    }}
                  >
                    {sevaOptions.map((seva, index) => (
                      <Card 
                        key={index} 
                        className={`divine-shadow hover:golden-border transition-all duration-500 overflow-visible group flex-shrink-0 cursor-pointer transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 hover:z-50 relative flex flex-col ${selectedSeva === index ? 'ring-4 ring-accent shadow-2xl shadow-accent/50 scale-105 -translate-y-2 z-40' : 'z-10'} ${cardsPerView === 1 ? 'mx-4' : ''}`}
                        style={{ width: cardsPerView === 1 ? 'calc(100% - 32px)' : cardsPerView === 2 ? 'calc(50% - 12px)' : cardsPerView === 3 ? 'calc(33.333% - 16px)' : 'calc(25% - 18px)' }}
                        onClick={() => handleCardClick(index)}
                      >
                        {/* Shine effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-30 pointer-events-none"></div>
                        
                        {/* Decorative corner accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                        
                        {/* Selected checkmark badge - top right */}
                        {selectedSeva === index && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full p-2.5 z-20 animate-bounce shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        {/* "Selected" badge - top left */}
                        {selectedSeva === index && (
                          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse shadow-lg">
                            {isEnglish ? "Selected" : "चयनित"}
                          </div>
                        )}
                        
                        <CardContent className="p-6 sm:p-8 lg:p-10 relative bg-gradient-to-br from-card via-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-accent/10 transition-colors duration-500 flex flex-col flex-1 h-full">
                          {/* Decorative top border */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Decorative icon at top */}
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                            <Heart className="w-20 h-20 text-accent" />
                          </div>
                          
                          <div className="space-y-3 sm:space-y-4 relative z-10 flex flex-col h-full">
                            <div className="text-center space-y-2 sm:space-y-3 flex-shrink-0">
                              <h3 className="font-decorative text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                                {isEnglish ? seva.name : seva.nameHi}
                              </h3>
                            </div>
                            
                            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300 mt-auto">
                              <div className="text-center">
                                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300 inline-block">{seva.price}</p>
                                <p className="text-sm text-muted-foreground font-serif mt-1">{isEnglish ? "Per Unit" : "प्रति यूनिट"}</p>
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
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                {totalCards > cardsPerView && canScrollRight && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-gradient-to-r from-secondary to-primary hover:from-accent hover:to-accent/80 text-primary-foreground rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-accent/50"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Booking Form Section */}
        {selectedSeva !== null && (
        <section id="booking-form" className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isEnglish ? "Seva Registration Form" : "सेवा पंजीकरण फॉर्म"}
                </h2>
                <p className="text-gray-600">
                  {isEnglish 
                    ? `Selected: ${sevaOptions[selectedSeva].name}` 
                    : `चयनित: ${sevaOptions[selectedSeva].nameHi}`}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    {isEnglish ? "Personal Information" : "व्यक्तिगत जानकारी"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{isEnglish ? "Full Name *" : "पूरा नाम *"}</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">{isEnglish ? "Gender *" : "लिंग *"}</Label>
                      <select 
                        id="gender" 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">{isEnglish ? "Select" : "चुनें"}</option>
                        <option value="male">{isEnglish ? "Male" : "पुरुष"}</option>
                        <option value="female">{isEnglish ? "Female" : "महिला"}</option>
                        <option value="other">{isEnglish ? "Other" : "अन्य"}</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="nationality">{isEnglish ? "Nationality *" : "राष्ट्रीयता *"}</Label>
                      <Input 
                        id="nationality" 
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile">{isEnglish ? "Mobile Number *" : "मोबाइल नंबर *"}</Label>
                      <Input 
                        id="mobile" 
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{isEnglish ? "Email ID *" : "ईमेल आईडी *"}</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="membershipId">{isEnglish ? "Membership ID (if applicable)" : "सदस्यता आईडी (यदि लागू हो)"}</Label>
                      <Input 
                        id="membershipId" 
                        name="membershipId"
                        value={formData.membershipId}
                        onChange={handleInputChange}
                        className="mt-1" 
                      />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {isEnglish ? "Address Details" : "पता विवरण"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">{isEnglish ? "Full Address *" : "पूरा पता *"}</Label>
                      <Textarea 
                        id="address" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">{isEnglish ? "City *" : "शहर *"}</Label>
                      <Input 
                        id="city" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{isEnglish ? "State *" : "राज्य *"}</Label>
                      <Input 
                        id="state" 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="pinCode">{isEnglish ? "Pin Code *" : "पिन कोड *"}</Label>
                      <Input 
                        id="pinCode" 
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                  </div>
                </div>

                {/* ID Proof Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {isEnglish ? "ID Proof Details" : "पहचान प्रमाण विवरण"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idProof">{isEnglish ? "ID Proof Type *" : "पहचान प्रमाण प्रकार *"}</Label>
                      <Input 
                        id="idProof" 
                        name="idProof"
                        value="Aadhaar Card"
                        readOnly
                        className="mt-1 bg-gray-50" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="idNumber">{isEnglish ? "Aadhaar Number *" : "आधार नंबर *"}</Label>
                      <Input 
                        id="idNumber" 
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="idDocument">{isEnglish ? "Upload Aadhaar Document *" : "आधार दस्तावेज़ अपलोड करें *"}</Label>
                      <div className="mt-1 flex items-center gap-4">
                        <Input 
                          id="idDocument" 
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required 
                          className="flex-1"
                        />
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      {documentFile && (
                        <p className="text-sm text-green-600 mt-1">
                          {isEnglish ? "File selected:" : "फ़ाइल चयनित:"} {documentFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {isEnglish ? "Registration Details" : "पंजीकरण विवरण"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bookingDate">{isEnglish ? "Booking Date *" : "बुकिंग तिथि *"}</Label>
                      <Input
                        id="bookingDate"
                        name="bookingDate"
                        type="date"
                        value={formData.bookingDate || ''}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">{isEnglish ? "Duration/Sessions *" : "अवधि/सत्र *"}</Label>
                      <Input 
                        id="quantity" 
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">{isEnglish ? "Total Amount (₹) *" : "कुल राशि (₹) *"}</Label>
                      <Input 
                        id="amount" 
                        name="amount"
                        type="number"
                        min="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required 
                        className="mt-1" 
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

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (isEnglish ? "Processing..." : "प्रक्रिया में...")
                      : useMembershipBenefit
                        ? (isEnglish ? "Confirm Booking (FREE)" : "बुकिंग की पुष्टि करें (मुफ़्त)")
                        : (isEnglish ? "Submit Registration" : "पंजीकरण जमा करें")
                    }
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
        )}

        {/* Enhanced Features Section */}
        <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-accent overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 inline-block">
                    <Heart className="w-12 h-12 text-accent mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                    {isEnglish ? "Serve with Love" : "प्रेम से सेवा करें"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {isEnglish 
                      ? "Experience the joy of selfless service to the divine and devotees" 
                      : "भगवान और भक्तों की निःस्वार्थ सेवा का आनंद अनुभव करें"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-primary overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 inline-block">
                    <Users className="w-12 h-12 text-accent mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {isEnglish ? "Community Service" : "सामुदायिक सेवा"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {isEnglish 
                      ? "Join a community of dedicated volunteers serving together" 
                      : "समर्पित स्वयंसेवकों के समुदाय में शामिल हों"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-accent overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 inline-block">
                    <Truck className="w-12 h-12 text-accent mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                    {isEnglish ? "Flexible Timings" : "लचीला समय"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {isEnglish 
                      ? "Choose seva schedules that fit your availability" 
                      : "अपनी सुविधा के अनुसार सेवा समय चुनें"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </section>

        {/* About Seva Section */}
        <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* About Service */}
            <Card className="divine-shadow golden-border relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 md:p-10 space-y-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-12 bg-accent rounded-full"></div>
                  <h2 className="font-decorative text-3xl md:text-4xl text-primary">
                    {isEnglish ? "About Seva & Satkar" : "सेवा और सत्कार के बारे में"}
                  </h2>
                  <div className="h-1 flex-1 bg-accent/30 rounded-full"></div>
                </div>
                <p className="font-serif text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {isEnglish
                    ? "Seva (selfless service) is the essence of devotion and spiritual growth. At Jeen Mata Dham, we believe that serving the temple and fellow devotees is a sacred path to connect with the divine. Our Seva & Satkar program offers various opportunities for devotees to contribute their time, skills, and efforts in maintaining the sanctity of the temple premises, assisting pilgrims, and participating in religious activities."
                    : "सेवा (निःस्वार्थ सेवा) भक्ति और आध्यात्मिक विकास का सार है। जीण माता धाम में, हमारा मानना है कि मंदिर और साथी भक्तों की सेवा करना परमात्मा से जुड़ने का एक पवित्र मार्ग है। हमारा सेवा और सत्कार कार्यक्रम भक्तों को मंदिर परिसर की पवित्रता बनाए रखने, तीर्थयात्रियों की सहायता करने और धार्मिक गतिविधियों में भाग लेने के लिए अपना समय, कौशल और प्रयास योगदान करने के विभिन्न अवसर प्रदान करता है।"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        </section>

      {/* Ready to Serve Section */}
      <Card className="divine-shadow golden-border bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 relative overflow-hidden group mx-4 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 animate-pulse"></div>
        <CardContent className="p-10 md:p-12 text-center space-y-6 relative z-10">
          <div className="inline-block p-5 bg-accent/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-16 h-16 text-accent" />
          </div>
          <h2 className="font-decorative text-4xl md:text-5xl text-primary">
            {isEnglish ? "Ready to Serve?" : "सेवा के लिए तैयार हैं?"}
          </h2>
          <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isEnglish
              ? "Select your preferred seva from above and make a difference in temple activities"
              : "ऊपर से अपनी पसंदीदा सेवा चुनें और मंदिर की गतिविधियों में योगदान दें"}
          </p>
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="h-1 w-16 bg-accent rounded-full animate-pulse"></div>
            <div className="h-1 w-16 bg-accent/60 rounded-full animate-pulse delay-100"></div>
            <div className="h-1 w-16 bg-accent/30 rounded-full animate-pulse delay-200"></div>
          </div>
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            size="lg" 
            className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-serif text-xl px-12 py-7 shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300 mt-6"
          >
            <span className="mr-2">{isEnglish ? "Choose Your Seva" : "अपनी सेवा चुनें"}</span>
          </Button>
        </CardContent>
      </Card>
      </main>

      <Footer />
    </div>
  );
};

export default SevaSatkar;