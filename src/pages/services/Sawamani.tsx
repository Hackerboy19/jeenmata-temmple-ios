import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Package, Heart, ChevronLeft, ChevronRight, Upload, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useMembershipBenefits } from "@/hooks/useMembershipBenefits";
import { MembershipBenefitOption } from "@/components/MembershipBenefitOption";

const Sawamani = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment } = useRazorpay();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [selectedSwamani, setSelectedSwamani] = useState<number | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  } = useMembershipBenefits('sawamani', selectedSwamani !== null);
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
    amount: "2501"
  });

  const sawamaniOptions = [
    { 
      name: "Choorma", 
      nameHi: "चूरमा", 
      price: "₹11000.00", 
      quantity: "51kg"
    },
    { 
      name: "Laddu", 
      nameHi: "लड्डू", 
      price: "₹14000.00", 
      quantity: "51kg"
    },
    { 
      name: "Boondi", 
      nameHi: "बूंदी", 
      price: "₹15000.00", 
      quantity: "51kg"
    },
    { 
      name: "Peda", 
      nameHi: "पेड़ा", 
      price: "₹22000.00", 
      quantity: "51kg"
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

  const totalCards = sawamaniOptions.length;
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + cardsPerView < totalCards;

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalCards - cardsPerView, prev + 1));
  };

  const handleCardClick = (index: number) => {
    setSelectedSwamani(index);
    // Extract numeric value from price string (e.g., "₹11000.00" -> "11000")
    const price = sawamaniOptions[index].price.replace(/[₹,]/g, '').split('.')[0];
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
    
    if (selectedSwamani === null) {
      toast({
        title: "Selection Required",
        description: "Please select a sawamani type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceType: 'sawamani' as const,
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
        bookingDate: formData.bookingDate,
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
          description: "Your Sawamani booking has been confirmed using your membership benefit. Check your email for details.",
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
          amount: "2501"
        });
        setSelectedSwamani(null);
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
          serviceType: 'sawamani'
        },
        onSuccess: () => {
          toast({
            title: "Booking Successful!",
            description: "Your Sawamani booking has been confirmed. Check your email for details.",
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
            amount: "2501"
          });
          setSelectedSwamani(null);
          
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
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Swamani Offerings" : "स्वामणी अर्पण"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Offer sacred swamani to Mata Ji and receive divine blessings"
                : "माता जी को पवित्र स्वामणी अर्पित करें और दिव्य आशीर्वाद प्राप्त करें"}
            </p>
          </div>
        </section> 

        {/* Service Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">

              {/* Swamani Options */}
              <div className="relative">
                <div className="text-center mb-12">
                  
                  <h2 className="font-decorative text-4xl md:text-5xl text-center text-primary mb-4">
                    {isEnglish ? "Swamani Options" : "स्वामणी विकल्प"}
                  </h2>
                  <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                    {isEnglish 
                      ? "Choose from our divine collection of swamani offerings"
                      : "हमारे दिव्य स्वामणी संग्रह में से चुनें"}
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
                      {sawamaniOptions.map((swamani, index) => (
                        <Card 
                          key={index}
                          className={`divine-shadow hover:golden-border transition-all duration-500 overflow-visible group flex-shrink-0 cursor-pointer transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 hover:z-50 relative ${selectedSwamani === index ? 'ring-4 ring-accent shadow-2xl shadow-accent/50 scale-105 -translate-y-2 z-40' : 'z-10'} ${cardsPerView === 1 ? 'mx-4' : ''}`}
                          style={{ width: cardsPerView === 1 ? 'calc(100% - 32px)' : cardsPerView === 2 ? 'calc(50% - 12px)' : cardsPerView === 3 ? 'calc(33.333% - 16px)' : 'calc(25% - 18px)' }}
                          onClick={() => handleCardClick(index)}
                        >
                          {/* Shine effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-30 pointer-events-none"></div>
                          
                          {/* Decorative corner accents */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                          
                          {/* Selected checkmark badge - top right */}
                          {selectedSwamani === index && (
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full p-2.5 z-20 animate-bounce shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* "Selected" badge - top left */}
                          {selectedSwamani === index && (
                            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse shadow-lg">
                              {isEnglish ? "Selected" : "चयनित"}
                            </div>
                          )}
                          
                          <CardContent className="p-6 sm:p-8 lg:p-10 relative bg-gradient-to-br from-card via-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-accent/10 transition-colors duration-500 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Decorative icon at top */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                              <Sparkles className="w-20 h-20 text-accent" />
                            </div>
                            
                            <div className="space-y-6 relative z-10">
                              <div className="text-center space-y-2 sm:space-y-3">
                                <h3 className="font-decorative text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                                  {isEnglish ? swamani.name : swamani.nameHi}
                                </h3>
                                <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                                  <Package className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                                  <p className="font-serif text-base font-semibold text-muted-foreground group-hover:text-accent transition-colors duration-300">{swamani.quantity}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4 pt-4 border-t-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300">
                                <div className="text-center">
                                  <p className="font-serif text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300 inline-block">{swamani.price}</p>
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

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Pure Materials" : "शुद्ध सामग्री"}
                    </h3>
                    <p className="font-serif text-muted-foreground leading-relaxed">
                      {isEnglish ? "Crafted with authentic precious metals" : "प्रामाणिक कीमती धातुओं से निर्मित"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Heart className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Divine Blessings" : "दिव्य आशीर्वाद"}
                    </h3>
                    <p className="font-serif text-muted-foreground leading-relaxed">
                      {isEnglish ? "Blessed by temple priests" : "मंदिर के पुजारियों द्वारा आशीर्वादित"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="divine-shadow hover:golden-border transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <Package className="w-12 h-12 text-accent mx-auto" />
                    <h3 className="font-decorative text-xl font-bold">
                      {isEnglish ? "Safe Delivery" : "सुरक्षित डिलीवरी"}
                    </h3>
                    <p className="font-serif text-muted-foreground leading-relaxed">
                      {isEnglish ? "Securely packed and delivered" : "सुरक्षित रूप से पैक और वितरित"}
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
                      {isEnglish ? "About Swamani Offerings" : "स्वामणी अर्पण के बारे में"}
                    </h2>
                    <div className="h-1 flex-1 bg-accent/30 rounded-full"></div>
                  </div>
                  <p className="font-serif text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {isEnglish
                      ? "Swamani is a sacred offering made to Maa Jeen Mata Ji using precious metals like gold, silver, or copper. This traditional offering symbolizes devotion and gratitude. Each swamani is crafted with care, blessed by temple priests, and offered during special pujas. Devotees receive divine blessings and spiritual merit through this sacred offering."
                      : "स्वामणी माँ जीण माता जी को सोने, चांदी या तांबे जैसी कीमती धातुओं से बना एक पवित्र अर्पण है। यह पारंपरिक अर्पण भक्ति और कृतज्ञता का प्रतीक है। प्रत्येक स्वामणी को सावधानीपूर्वक तैयार किया जाता है, मंदिर के पुजारियों द्वारा आशीर्वादित किया जाता है, और विशेष पूजा के दौरान अर्पित किया जाता है। भक्तों को इस पवित्र अर्पण के माध्यम से दिव्य आशीर्वाद और आध्यात्मिक पुण्य प्राप्त होता है।"}
                  </p>
                </CardContent>
              </Card>

              {/* Booking Form */}
              {selectedSwamani !== null && (
                <Card id="booking-form" className="divine-shadow golden-border bg-gradient-to-br from-primary/5 to-accent/5 animate-in slide-in-from-bottom-10 duration-700">
                  <CardContent className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <h2 className="font-decorative text-3xl md:text-4xl text-primary mb-4">
                        {isEnglish ? "Book Your Swamani" : "अपनी स्वामणी बुक करें"}
                      </h2>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Selected: " : "चयनित: "}
                        <span className="text-accent font-bold">
                          {isEnglish ? sawamaniOptions[selectedSwamani].name : sawamaniOptions[selectedSwamani].nameHi}
                        </span>
                        {" - "}
                        <span className="text-primary font-bold">{sawamaniOptions[selectedSwamani].price}</span>
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-2xl text-primary border-b border-accent/30 pb-2">
                          {isEnglish ? "Personal Information" : "व्यक्तिगत जानकारी"}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
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
                        <h3 className="font-decorative text-2xl text-primary border-b border-accent/30 pb-2">
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
                            className="font-serif"
                            rows={3}
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
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
                              {isEnglish ? "PIN Code *" : "पिन कोड *"}
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

                      {/* ID Proof */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-2xl text-primary border-b border-accent/30 pb-2">
                          {isEnglish ? "ID Proof" : "पहचान प्रमाण"}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="idProof" className="font-serif">
                              {isEnglish ? "ID Proof Type *" : "पहचान प्रमाण प्रकार *"}
                            </Label>
                            <select 
                              id="idProof" 
                              name="idProof" 
                              value={formData.idProof}
                              onChange={handleInputChange}
                              required 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
                            >
                              <option value="Aadhaar Card">{isEnglish ? "Aadhaar Card" : "आधार कार्ड"}</option>
                              <option value="PAN Card">{isEnglish ? "PAN Card" : "पैन कार्ड"}</option>
                              <option value="Voter ID">{isEnglish ? "Voter ID" : "वोटर आईडी"}</option>
                              <option value="Passport">{isEnglish ? "Passport" : "पासपोर्ट"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="idNumber" className="font-serif">
                              {isEnglish ? "ID Number *" : "आईडी नंबर *"}
                            </Label>
                            <Input
                              id="idNumber"
                              name="idNumber"
                              value={formData.idNumber}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="document" className="font-serif">
                              {isEnglish ? "Upload ID Proof (Optional)" : "आईडी प्रमाण अपलोड करें (वैकल्पिक)"}
                            </Label>
                            <div className="flex items-center gap-4">
                              <Input
                                id="document"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="font-serif"
                              />
                              {documentFile && (
                                <span className="text-sm text-accent font-serif flex items-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  {documentFile.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-2xl text-primary border-b border-accent/30 pb-2">
                          {isEnglish ? "Order Details" : "ऑर्डर विवरण"}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
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
                              {isEnglish ? "Quantity *" : "मात्रा *"}
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
                              {isEnglish ? "Total Amount (₹) *" : "कुल राशि (₹) *"}
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="text"
                              value={formData.amount}
                              onChange={handleInputChange}
                              required
                              className="font-serif"
                              readOnly
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
                      <div className="flex justify-center pt-6">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-12 py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
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
                  </CardContent>
                </Card>
              )}

              {/* Booking Section */}
              <Card className="divine-shadow golden-border bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 animate-pulse"></div>
                <CardContent className="p-10 md:p-12 text-center space-y-6 relative z-10">
                  <div className="inline-block p-5 bg-accent/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-16 h-16 text-accent" />
                  </div>
                  <h2 className="font-decorative text-4xl md:text-5xl text-primary">
                    {isEnglish ? "Book Your Swamani" : "अपनी स्वामणी बुक करें"}
                  </h2>
                  <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {isEnglish
                      ? "Select your swamani option and complete the booking. We will offer it to Mata Rani on your behalf and arrange delivery."
                      : "अपना स्वामणी विकल्प चुनें और बुकिंग पूरी करें। हम इसे आपकी ओर से माता रानी को अर्पित करेंगे और डिलीवरी की व्यवस्था करेंगे।"}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="h-1 w-16 bg-accent rounded-full animate-pulse"></div>
                    <div className="h-1 w-16 bg-accent/60 rounded-full animate-pulse delay-100"></div>
                    <div className="h-1 w-16 bg-accent/30 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <Link to="/service-booking?service=swamani">
                    <Button size="lg" className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-serif text-xl px-12 py-7 shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300 mt-6">
                      <span className="mr-2">{isEnglish ? "Book Now" : "अभी बुक करें"}</span>
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

export default Sawamani;
