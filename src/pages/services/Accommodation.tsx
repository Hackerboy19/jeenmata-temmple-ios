import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, Bed, Wifi, Utensils, Wind, Shield, Gift, Package, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useMembershipBenefits } from "@/hooks/useMembershipBenefits";
import { MembershipBenefitOption } from "@/components/MembershipBenefitOption";

const Accommodation = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment } = useRazorpay();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    availableBenefits,
    selectedBenefit,
    setSelectedBenefit,
    useMembershipBenefit,
    setUseMembershipBenefit,
    isLoadingBenefits
  } = useMembershipBenefits('accommodation', selectedRoom !== null);
  
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
    checkIn: "",
    checkOut: "",
    guests: "1",
    amount: "500"
  });

  const roomOptions = [
    { 
      name: "AC Room", 
      nameHi: "एसी कमरा", 
      price: "₹1100.00", 
      description: "Air-conditioned comfort",
      descriptionHi: "वातानुकूलित आराम",
      messageHi: "नवरात्री महोत्सव में रुपये 1500",
      message: "₹1500 in the Navratri festival"
    },
    { 
      name: "Non-AC Room", 
      nameHi: "नॉन-एसी कमरा", 
      price: "₹800.00", 
      description: "Comfortable standard room",
      descriptionHi: "आरामदायक मानक कमरा",
      messageHi: " नवरात्री महोत्सव में रुपये 1100",
      message: "₹1100 in the Navratri festival"
    },
  ];

  const handleCardClick = (index: number) => {
    setSelectedRoom(index);
    setFormData({
      ...formData,
      amount: index === 0 ? "1000" : "500"
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
    
    if (selectedRoom === null) {
      toast({
        title: "Selection Required",
        description: "Please select a room type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceType: 'accommodation' as const,
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
        roomType: roomOptions[selectedRoom].name,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        amount: useMembershipBenefit ? 0 : parseFloat(formData.amount),
        useMembershipBenefit: useMembershipBenefit,
        membershipBenefitDetails: useMembershipBenefit ? {
          membershipId: selectedBenefit.membershipId,
          benefitType: selectedBenefit.benefitType
        } : undefined
      };

      // If using membership benefit, create booking directly without payment
      if (useMembershipBenefit) {
        const response = await api.serviceBookings.createBooking(bookingData);
        
        toast({
          title: "Booking Successful!",
          description: "Your accommodation booking has been confirmed using your membership benefit. Check your email for details.",
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
          checkIn: "",
          checkOut: "",
          guests: "1",
          amount: "500"
        });
        setSelectedRoom(null);
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
          serviceType: 'accommodation'
        },
        onSuccess: () => {
          toast({
            title: "Booking Successful!",
            description: "Your accommodation booking has been confirmed. Check your email for details.",
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
            checkIn: "",
            checkOut: "",
            guests: "1",
            amount: "500"
          });
          setSelectedRoom(null);
          
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
            <Home className="w-20 h-20 text-accent mx-auto mb-6 diya-glow" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Accommodation" : "आवास"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Comfortable stay for a peaceful spiritual journey"
                : "शांतिपूर्ण आध्यात्मिक यात्रा के लिए आरामदायक प्रवास"}
            </p>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">

              {/* Room Types */}
              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="font-decorative text-4xl md:text-5xl text-center text-primary mb-4">
                    {isEnglish ? "Room Options" : "कमरे के विकल्प"}
                  </h2>
                  <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
                    {isEnglish 
                      ? "Choose your preferred accommodation type"
                      : "अपने पसंदीदा आवास प्रकार चुनें"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {roomOptions.map((room, index) => (
                    <Card 
                      key={index}
                      className={`divine-shadow hover:golden-border transition-all duration-500 overflow-visible group cursor-pointer transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 hover:z-50 relative ${selectedRoom === index ? 'ring-4 ring-accent shadow-2xl shadow-accent/50 scale-105 -translate-y-2 z-40' : 'z-10'} w-full`}
                      onClick={() => handleCardClick(index)}
                    >
                      {/* Shine effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-30 pointer-events-none"></div>
                      
                      {/* Decorative corner accents */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                      
                      {/* Selected checkmark badge */}
                      {selectedRoom === index && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full p-2.5 z-20 animate-bounce shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Selected badge */}
                      {selectedRoom === index && (
                        <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold z-20 animate-pulse shadow-lg">
                          {isEnglish ? "Selected" : "चयनित"}
                        </div>
                      )}
                      
                      <CardContent className="p-6 sm:p-10 relative bg-gradient-to-br from-card via-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:via-accent/5 group-hover:to-accent/10 transition-colors duration-500 min-h-[240px] sm:min-h-[280px] flex flex-col justify-between">
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Decorative icon at top */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                          {index === 0 ? <Wind className="w-20 h-20 text-accent" /> : <Bed className="w-20 h-20 text-accent" />}
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6 relative z-10">
                          <div className="text-center space-y-2 sm:space-y-3">
                            <h3 className="font-decorative text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                              {isEnglish ? room.name : room.nameHi}
                            </h3>
                            <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                              <Package className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                              <p className="font-serif text-base font-semibold text-muted-foreground group-hover:text-accent transition-colors duration-300">
                                {isEnglish ? room.description : room.descriptionHi}
                              </p>
                            </div>
                            {/* Message/Note */}
                            <div className="bg-primary/10 px-4 py-2 rounded-lg">
                              <p className="font-serif text-sm text-primary font-medium">
                                {isEnglish ? room.message : room.messageHi}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300">
                            <div className="text-center">
                              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300 inline-block">{room.price}</p>
                              <p className="text-sm text-muted-foreground font-serif mt-1">{isEnglish ? "Per Night" : "प्रति रात"}</p>
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

              {/* Booking Form */}
              {selectedRoom !== null && (
                <Card id="booking-form" className="divine-shadow golden-border bg-gradient-to-br from-primary/5 to-accent/5 animate-in slide-in-from-bottom-10 duration-700">
                  <CardContent className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <h2 className="font-decorative text-3xl md:text-4xl text-primary mb-4">
                        {isEnglish ? "Book Your Room" : "अपना कमरा बुक करें"}
                      </h2>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Selected: " : "चयनित: "}
                        <span className="text-accent font-bold">
                          {isEnglish ? roomOptions[selectedRoom].name : roomOptions[selectedRoom].nameHi}
                        </span>
                        {" - "}
                        <span className="text-primary font-bold">{roomOptions[selectedRoom].price}</span>
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

                      {/* Booking Details */}
                      <div className="space-y-4">
                        <h3 className="font-decorative text-2xl text-primary border-b border-accent/30 pb-2">
                          {isEnglish ? "Booking Details" : "बुकिंग विवरण"}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="checkIn" className="font-serif">
                              {isEnglish ? "Check-in Date *" : "चेक-इन तिथि *"}
                            </Label>
                            <Input
                              id="checkIn"
                              name="checkIn"
                              type="date"
                              value={formData.checkIn}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="checkOut" className="font-serif">
                              {isEnglish ? "Check-out Date *" : "चेक-आउट तिथि *"}
                            </Label>
                            <Input
                              id="checkOut"
                              name="checkOut"
                              type="date"
                              value={formData.checkOut}
                              onChange={handleInputChange}
                              min={formData.checkIn || new Date().toISOString().split('T')[0]}
                              required
                              className="font-serif"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="guests" className="font-serif">
                              {isEnglish ? "Number of Guests *" : "अतिथियों की संख्या *"}
                            </Label>
                            <Input
                              id="guests"
                              name="guests"
                              type="number"
                              min="1"
                              value={formData.guests}
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
                              : (isEnglish ? "Proceed to Payment" : "भुगतान के लिए आगे बढ़ें")
                          }
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Facilities */}
              <div>
                <h2 className="font-decorative text-3xl text-center mb-8 text-primary">
                  {isEnglish ? "Facilities" : "सुविधाएं"}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="divine-shadow hover:golden-border transition-all">
                    <CardContent className="p-6 text-center space-y-4">
                      <Bed className="w-12 h-12 text-accent mx-auto" />
                      <h3 className="font-decorative text-xl font-bold">
                        {isEnglish ? "Clean Bedding" : "स्वच्छ बिस्तर"}
                      </h3>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Fresh and hygienic bedding provided" : "ताजा और स्वच्छ बिस्तर प्रदान किया गया"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="divine-shadow hover:golden-border transition-all">
                    <CardContent className="p-6 text-center space-y-4">
                      <Shield className="w-12 h-12 text-accent mx-auto" />
                      <h3 className="font-decorative text-xl font-bold">
                        {isEnglish ? "24/7 Security" : "24/7 सुरक्षा"}
                      </h3>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Round the clock security provided" : "चौबीसों घंटे सुरक्षा प्रदान की गई"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="divine-shadow hover:golden-border transition-all">
                    <CardContent className="p-6 text-center space-y-4">
                      <Home className="w-12 h-12 text-accent mx-auto" />
                      <h3 className="font-decorative text-xl font-bold">
                        {isEnglish ? "Temple Proximity" : "मंदिर निकटता"}
                      </h3>
                      <p className="font-serif text-muted-foreground">
                        {isEnglish ? "Walking distance to the temple" : "मंदिर तक पैदल दूरी"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* About Service */}
              <Card className="divine-shadow golden-border">
                <CardContent className="p-8 space-y-6">
                  <h2 className="font-decorative text-3xl text-primary">
                    {isEnglish ? "About Dharamshala" : "धर्मशाला के बारे में"}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground leading-relaxed">
                    {isEnglish
                      ? "Our dharamshala provides clean, comfortable, and affordable accommodation for devotees visiting the temple. Experience a peaceful stay with modern amenities while being close to the holy sanctum of Maa Jeen Mata Ji."
                      : "हमारा धर्मशाला मंदिर आने वाले भक्तों के लिए स्वच्छ, आरामदायक और किफायती आवास प्रदान करता है। माँ जीण माता जी के पवित्र गर्भगृह के करीब रहते हुए आधुनिक सुविधाओं के साथ शांतिपूर्ण प्रवास का अनुभव करें।"}
                  </p>
                </CardContent>
              </Card>

              {/* Booking Section */}
              <Card className="divine-shadow golden-border bg-gradient-to-br from-card to-muted/30">
                <CardContent className="p-8 text-center space-y-6">
                  <h2 className="font-decorative text-3xl text-primary">
                    {isEnglish ? "Book Your Stay" : "अपना प्रवास बुक करें"}
                  </h2>
                  <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
                    {isEnglish
                      ? "Reserve your room in advance for a hassle-free stay. Select your preferred room type and dates."
                      : "परेशानी मुक्त प्रवास के लिए अपने कमरे को पहले से बुक करें। अपने पसंदीदा कमरे का प्रकार और तिथियां चुनें।"}
                  </p>
                  <Link to="/service-booking?service=accommodation">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg px-8">
                      {isEnglish ? "Book Now" : "अभी बुक करें"}
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

export default Accommodation;
