import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Home, Gift, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api, type Booking as BookingType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AartiTiming {
  _id: string;
  name: string;
  title: { en: string; hi: string };
  startTime: string;
  endTime: string;
}

const Booking = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'room';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aartiTimings, setAartiTimings] = useState<AartiTiming[]>([]);

  useEffect(() => {
    const fetchAartiTimings = async () => {
      try {
        const response = await api.aartiTimings.getAll();
        if (response.success) {
          setAartiTimings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch aarti timings:', error);
      }
    };
    fetchAartiTimings();
  }, []);

  const getMorning = () => aartiTimings.find(t => t.name === 'morning');
  const getEvening = () => aartiTimings.find(t => t.name === 'evening');
  const getAartiTimeString = (timing: AartiTiming | undefined, fallback: string) => {
    return timing ? `${timing.title.en} (${timing.startTime} - ${timing.endTime})` : fallback;
  };

  // Room booking state
  const [roomBooking, setRoomBooking] = useState({
    name: '',
    phone: '',
    email: '',
    idProof: 'Aadhaar Card',
    idNumber: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    specialRequirements: ''
  });

  // Prasad booking state
  const [prasadBooking, setPrasadBooking] = useState({
    name: '',
    phone: '',
    prasadType: 'Standard Prasad',
    quantity: '1',
    idProof: 'Aadhaar Card',
    idNumber: ''
  });

  // Aarti booking state
  const [aartiBooking, setAartiBooking] = useState({
    name: '',
    phone: '',
    idProof: 'Aadhaar Card',
    idNumber: '',
    aartiDate: '',
    aartiTime: '',
    numberOfDevotees: '1',
    specialPrayerRequest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleRoomBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate dates: prevent past check-in and ensure check-out is not before check-in
    if (roomBooking.checkInDate) {
      if (roomBooking.checkInDate < today) {
        toast({
          title: isEnglish ? "Invalid Date" : "अमान्य तिथि",
          description: isEnglish ? "Check-in date cannot be in the past." : "चेक-इन तिथि पिछली तिथि नहीं हो सकती।",
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (roomBooking.checkInDate && roomBooking.checkOutDate) {
      if (roomBooking.checkOutDate < roomBooking.checkInDate) {
        toast({
          title: isEnglish ? "Invalid Date Range" : "अमान्य तारीख़ की रेंज",
          description: isEnglish ? "Check-out date cannot be before check-in date." : "चेक-आउट तिथि चेक-इन से पहले नहीं हो सकती।",
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: isEnglish ? "Authentication Required" : "प्रमाणीकरण आवश्यक",
          description: isEnglish ? "Please login to make a booking" : "बुकिंग करने के लिए कृपया लॉगिन करें",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const bookingData: BookingType = {
        bookingType: 'room',
        name: roomBooking.name,
        phone: roomBooking.phone,
        email: roomBooking.email,
        idProof: roomBooking.idProof,
        idNumber: roomBooking.idNumber,
        checkInDate: roomBooking.checkInDate,
        checkOutDate: roomBooking.checkOutDate,
        numberOfGuests: parseInt(roomBooking.numberOfGuests),
        specialRequirements: roomBooking.specialRequirements
      };

      await api.bookings.createBooking(bookingData);

      toast({
        title: isEnglish ? "Booking Successful" : "बुकिंग सफल",
        description: isEnglish ? "Your room booking request has been submitted successfully" : "आपकी कमरा बुकिंग का अनुरोध सफलतापूर्वक भेजा गया है"
      });

      // Reset form
      setRoomBooking({
        name: '',
        phone: '',
        email: '',
        idProof: 'Aadhaar Card',
        idNumber: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: '',
        specialRequirements: ''
      });
    } catch (error: any) {
      toast({
        title: isEnglish ? "Booking Failed" : "बुकिंग विफल",
        description: error.message || (isEnglish ? "Failed to create booking" : "बुकिंग बनाने में विफल"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrasadBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: isEnglish ? "Authentication Required" : "प्रमाणीकरण आवश्यक",
          description: isEnglish ? "Please login to make a booking" : "बुकिंग करने के लिए कृपया लॉगिन करें",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const bookingData: BookingType = {
        bookingType: 'prasad',
        name: prasadBooking.name,
        phone: prasadBooking.phone,
        idProof: prasadBooking.idProof,
        idNumber: prasadBooking.idNumber,
        prasadType: prasadBooking.prasadType,
        quantity: parseInt(prasadBooking.quantity)
      };

      await api.bookings.createBooking(bookingData);

      toast({
        title: isEnglish ? "Booking Successful" : "बुकिंग सफल",
        description: isEnglish ? "Your prasad booking has been submitted successfully" : "आपकी प्रसाद बुकिंग सफलतापूर्वक भेजी गई है"
      });

      // Reset form
      setPrasadBooking({
        name: '',
        phone: '',
        prasadType: 'Standard Prasad',
        quantity: '1',
        idProof: 'Aadhaar Card',
        idNumber: ''
      });
    } catch (error: any) {
      toast({
        title: isEnglish ? "Booking Failed" : "बुकिंग विफल",
        description: error.message || (isEnglish ? "Failed to create booking" : "बुकिंग बनाने में विफल"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAartiBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prevent booking for past dates
    if (aartiBooking.aartiDate && aartiBooking.aartiDate < today) {
      toast({
        title: isEnglish ? "Invalid Date" : "अमान्य तिथि",
        description: isEnglish ? "Aarti date cannot be in the past." : "आरती तिथि पिछली तिथि नहीं हो सकती।",
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: isEnglish ? "Authentication Required" : "प्रमाणीकरण आवश्यक",
          description: isEnglish ? "Please login to make a booking" : "बुकिंग करने के लिए कृपया लॉगिन करें",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const bookingData: BookingType = {
        bookingType: 'aarti',
        name: aartiBooking.name,
        phone: aartiBooking.phone,
        idProof: aartiBooking.idProof,
        idNumber: aartiBooking.idNumber,
        aartiDate: aartiBooking.aartiDate,
        aartiTime: aartiBooking.aartiTime,
        numberOfDevotees: parseInt(aartiBooking.numberOfDevotees),
        specialPrayerRequest: aartiBooking.specialPrayerRequest
      };

      await api.bookings.createBooking(bookingData);

      toast({
        title: isEnglish ? "Booking Successful" : "बुकिंग सफल",
        description: isEnglish ? "Your aarti participation booking has been submitted successfully" : "आपकी आरती भागीदारी बुकिंग सफलतापूर्वक भेजी गई है"
      });

      // Reset form
      setAartiBooking({
        name: '',
        phone: '',
        idProof: 'Aadhaar Card',
        idNumber: '',
        aartiDate: '',
        aartiTime: '',
        numberOfDevotees: '1',
        specialPrayerRequest: ''
      });
    } catch (error: any) {
      toast({
        title: isEnglish ? "Booking Failed" : "बुकिंग विफल",
        description: error.message || (isEnglish ? "Failed to create booking" : "बुकिंग बनाने में विफल"),
        variant: "destructive"
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
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Online Booking" : "ऑनलाइन बुकिंग"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Book your temple services and experience divine blessings"
                : "मंदिर सेवाओं की बुकिंग करें और माँ जीण माता जी की दिव्य कृपा का अनुभव करें"}
            </p>
          </div>
        </section>

        {/* Booking Forms */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue={defaultTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted">
                  <TabsTrigger value="room" className="font-serif py-3">
                    <Home className="w-4 h-4 mr-2" />
                    {isEnglish ? "Room Booking" : "कमरा बुकिंग"}
                  </TabsTrigger>
                  <TabsTrigger value="prasad" className="font-serif py-3">
                    <Gift className="w-4 h-4 mr-2" />
                    {isEnglish ? "Prasad Booking" : "प्रसाद बुकिंग"}
                  </TabsTrigger>
                  <TabsTrigger value="aarti" className="font-serif py-3">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isEnglish ? "Aarti Participation" : "आरती भागीदारी"}
                  </TabsTrigger>
                </TabsList>

                {/* Room Booking */}
                <TabsContent value="room">
                  <Card className="divine-shadow golden-border">
                    <CardContent className="p-8">
                      <h3 className="font-decorative text-2xl font-bold mb-6 text-center">
                        {isEnglish ? "Dharamshala Room Booking" : "धर्मशाला कमरा बुकिंग"}
                      </h3>
                      <form onSubmit={handleRoomBookingSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-serif">
                              {isEnglish ? "Full Name *" : "पूरा नाम *"}
                            </Label>
                            <Input
                              id="name"
                              placeholder={isEnglish ? "Enter your name" : "अपना नाम लिखें"}
                              className="font-serif"
                              value={roomBooking.name}
                              onChange={(e) => setRoomBooking({...roomBooking, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="font-serif">
                              {isEnglish ? "Phone Number *" : "फोन नंबर *"}
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder={isEnglish ? "Enter phone number" : "फोन नंबर दर्ज करें"}
                              className="font-serif"
                              value={roomBooking.phone}
                              onChange={(e) => setRoomBooking({...roomBooking, phone: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-serif">
                            {isEnglish ? "Email Address" : "ईमेल पता"}
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={isEnglish ? "Enter email address" : "ईमेल पता दर्ज करें"}
                            className="font-serif"
                            value={roomBooking.email}
                            onChange={(e) => setRoomBooking({...roomBooking, email: e.target.value})}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="idProof" className="font-serif">
                              {isEnglish ? "ID Proof Type *" : "पहचान प्रमाण प्रकार *"}
                            </Label>
                            <select
                              id="idProof"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-serif"
                              value={roomBooking.idProof}
                              onChange={(e) => setRoomBooking({...roomBooking, idProof: e.target.value})}
                              required
                            >
                              <option value="Aadhaar Card">{isEnglish ? "Aadhaar Card" : "आधार कार्ड"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="idNumber" className="font-serif">
                              {isEnglish ? "ID Number *" : "पहचान संख्या *"}
                            </Label>
                            <Input
                              id="idNumber"
                              type="text"
                              placeholder={isEnglish ? "Enter ID number" : "पहचान संख्या दर्ज करें"}
                              className="font-serif"
                              value={roomBooking.idNumber}
                              onChange={(e) => setRoomBooking({...roomBooking, idNumber: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="checkin" className="font-serif">
                              {isEnglish ? "Check-in Date *" : "चेक-इन तिथि *"}
                            </Label>
                            <Input 
                              id="checkin" 
                              type="date" 
                              className="font-serif"
                                value={roomBooking.checkInDate}
                                min={today}
                                onChange={(e) => setRoomBooking({...roomBooking, checkInDate: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="checkout" className="font-serif">
                              {isEnglish ? "Check-out Date *" : "चेक-आउट तिथि *"}
                            </Label>
                            <Input 
                              id="checkout" 
                              type="date" 
                              className="font-serif"
                                value={roomBooking.checkOutDate}
                                min={roomBooking.checkInDate || today}
                                onChange={(e) => setRoomBooking({...roomBooking, checkOutDate: e.target.value})}
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guests" className="font-serif">
                            {isEnglish ? "Number of Guests *" : "मेहमानों की संख्या *"}
                          </Label>
                          <Input
                            id="guests"
                            type="number"
                            min="1"
                            placeholder={isEnglish ? "Enter number of guests" : "मेहमानों की संख्या दर्ज करें"}
                            className="font-serif"
                            value={roomBooking.numberOfGuests}
                            onChange={(e) => setRoomBooking({...roomBooking, numberOfGuests: e.target.value})}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="requirements" className="font-serif">
                            {isEnglish ? "Special Requirements" : "विशेष आवश्यकता"}
                          </Label>
                          <Textarea 
                            id="requirements" 
                            placeholder={isEnglish ? "Any special requirements or requests" : "कोई विशेष आवश्यकता या अनुरोध"} 
                            className="font-serif h-24"
                            value={roomBooking.specialRequirements}
                            onChange={(e) => setRoomBooking({...roomBooking, specialRequirements: e.target.value})}
                          />
                        </div>

                        <Button 
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (isEnglish ? "Submitting..." : "भेजा जा रहा है...") : (isEnglish ? "Submit Booking Request" : "बुकिंग अनुरोध भेजें")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Prasad Booking */}
                <TabsContent value="prasad">
                  <Card className="divine-shadow golden-border">
                    <CardContent className="p-8">
                      <h3 className="font-decorative text-2xl font-bold mb-6 text-center">
                        {isEnglish ? "Online Prasad Booking" : "ऑनलाइन प्रसाद बुकिंग"}
                      </h3>
                      <form onSubmit={handlePrasadBookingSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="prasad-name" className="font-serif">
                              {isEnglish ? "Full Name *" : "पूरा नाम *"}
                            </Label>
                            <Input
                              id="prasad-name"
                              placeholder={isEnglish ? "Enter your name" : "अपना नाम लिखें"}
                              className="font-serif"
                              value={prasadBooking.name}
                              onChange={(e) => setPrasadBooking({...prasadBooking, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="prasad-phone" className="font-serif">
                              {isEnglish ? "Phone Number *" : "फोन नंबर *"}
                            </Label>
                            <Input
                              id="prasad-phone"
                              type="tel"
                              placeholder={isEnglish ? "Enter phone number" : "फोन नंबर दर्ज करें"}
                              className="font-serif"
                              value={prasadBooking.phone}
                              onChange={(e) => setPrasadBooking({...prasadBooking, phone: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="prasad-idProof" className="font-serif">
                              {isEnglish ? "ID Proof Type *" : "पहचान प्रमाण प्रकार *"}
                            </Label>
                            <select
                              id="prasad-idProof"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-serif"
                              value={prasadBooking.idProof}
                              onChange={(e) => setPrasadBooking({...prasadBooking, idProof: e.target.value})}
                              required
                            >
                              <option value="Aadhaar Card">{isEnglish ? "Aadhaar Card" : "आधार कार्ड"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="prasad-idNumber" className="font-serif">
                              {isEnglish ? "ID Number *" : "पहचान संख्या *"}
                            </Label>
                            <Input
                              id="prasad-idNumber"
                              type="text"
                              placeholder={isEnglish ? "Enter ID number" : "पहचान संख्या दर्ज करें"}
                              className="font-serif"
                              value={prasadBooking.idNumber}
                              onChange={(e) => setPrasadBooking({...prasadBooking, idNumber: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="prasad-type" className="font-serif">
                              {isEnglish ? "Prasad Type" : "प्रसाद प्रकार"}
                            </Label>
                            <Input
                              id="prasad-type"
                              placeholder={isEnglish ? "Standard Prasad" : "मानक प्रसाद"}
                              className="font-serif"
                              value={prasadBooking.prasadType}
                              onChange={(e) => setPrasadBooking({...prasadBooking, prasadType: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="prasad-quantity" className="font-serif">
                              {isEnglish ? "Quantity" : "मात्रा"}
                            </Label>
                            <Input 
                              id="prasad-quantity" 
                              type="number" 
                              min="1" 
                              className="font-serif"
                              value={prasadBooking.quantity}
                              onChange={(e) => setPrasadBooking({...prasadBooking, quantity: e.target.value})}
                            />
                          </div>
                        </div>

                        <Button 
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (isEnglish ? "Submitting..." : "भेजा जा रहा है...") : (isEnglish ? "Book Prasad Delivery" : "प्रसाद डिलीवरी बुक करें")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Aarti Participation */}
                <TabsContent value="aarti">
                  <Card className="divine-shadow golden-border">
                    <CardContent className="p-8">
                      <h3 className="font-decorative text-2xl font-bold mb-6 text-center">
                        {isEnglish ? "Aarti Participation Booking" : "आरती भागीदारी बुकिंग"}
                      </h3>
                      <form onSubmit={handleAartiBookingSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="aarti-name" className="font-serif">
                              {isEnglish ? "Full Name *" : "पूरा नाम *"}
                            </Label>
                            <Input
                              id="aarti-name"
                              placeholder={isEnglish ? "Enter your name" : "अपना नाम लिखें"}
                              className="font-serif"
                              value={aartiBooking.name}
                              onChange={(e) => setAartiBooking({...aartiBooking, name: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aarti-phone" className="font-serif">
                              {isEnglish ? "Phone Number *" : "फोन नंबर *"}
                            </Label>
                            <Input
                              id="aarti-phone"
                              type="tel"
                              placeholder={isEnglish ? "Enter phone number" : "फोन नंबर दर्ज करें"}
                              className="font-serif"
                              value={aartiBooking.phone}
                              onChange={(e) => setAartiBooking({...aartiBooking, phone: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="aarti-idProof" className="font-serif">
                              {isEnglish ? "ID Proof Type *" : "पहचान प्रमाण प्रकार *"}
                            </Label>
                            <select
                              id="aarti-idProof"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent font-serif"
                              value={aartiBooking.idProof}
                              onChange={(e) => setAartiBooking({...aartiBooking, idProof: e.target.value})}
                              required
                            >
                              <option value="Aadhaar Card">{isEnglish ? "Aadhaar Card" : "आधार कार्ड"}</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="aarti-idNumber" className="font-serif">
                              {isEnglish ? "ID Number *" : "पहचान संख्या *"}
                            </Label>
                            <Input
                              id="aarti-idNumber"
                              type="text"
                              placeholder={isEnglish ? "Enter ID number" : "पहचान संख्या दर्ज करें"}
                              className="font-serif"
                              value={aartiBooking.idNumber}
                              onChange={(e) => setAartiBooking({...aartiBooking, idNumber: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="aarti-date" className="font-serif">
                              {isEnglish ? "Aarti Date *" : "आरती तिथि *"}
                            </Label>
                            <Input 
                              id="aarti-date" 
                              type="date" 
                              className="font-serif"
                              value={aartiBooking.aartiDate}
                              min={today}
                              onChange={(e) => setAartiBooking({...aartiBooking, aartiDate: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aarti-time" className="font-serif">
                              {isEnglish ? "Aarti Time *" : "आरती समय *"}
                            </Label>
                            <select 
                              id="aarti-time"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
                              value={aartiBooking.aartiTime}
                              onChange={(e) => setAartiBooking({...aartiBooking, aartiTime: e.target.value})}
                              required
                            >
                              <option value="">
                                {isEnglish ? "Select Aarti Time" : "आरती समय चुनें"}
                              </option>
                              {getMorning() && (
                                <option value={getAartiTimeString(getMorning(), '')}>
                                  {isEnglish 
                                    ? `${getMorning()!.title.en} (${getMorning()!.startTime} - ${getMorning()!.endTime})`
                                    : `${getMorning()!.title.hi} (${getMorning()!.startTime} - ${getMorning()!.endTime})`
                                  }
                                </option>
                              )}
                              {getEvening() && (
                                <option value={getAartiTimeString(getEvening(), '')}>
                                  {isEnglish 
                                    ? `${getEvening()!.title.en} (${getEvening()!.startTime} - ${getEvening()!.endTime})`
                                    : `${getEvening()!.title.hi} (${getEvening()!.startTime} - ${getEvening()!.endTime})`
                                  }
                                </option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="aarti-devotees" className="font-serif">
                            {isEnglish ? "Number of Devotees" : "भक्तों की संख्या"}
                          </Label>
                          <Input 
                            id="aarti-devotees" 
                            type="number" 
                            min="1" 
                            className="font-serif"
                            value={aartiBooking.numberOfDevotees}
                            onChange={(e) => setAartiBooking({...aartiBooking, numberOfDevotees: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="aarti-note" className="font-serif">
                            {isEnglish ? "Special Prayer Request" : "विशेष प्रार्थना अनुरोध"}
                          </Label>
                          <Textarea 
                            id="aarti-note" 
                            placeholder={isEnglish ? "Any special prayer or intention" : "कोई विशेष प्रार्थना या मनोकामना"} 
                            className="font-serif h-24"
                            value={aartiBooking.specialPrayerRequest}
                            onChange={(e) => setAartiBooking({...aartiBooking, specialPrayerRequest: e.target.value})}
                          />
                        </div>

                        <Button 
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (isEnglish ? "Submitting..." : "भेजा जा रहा है...") : (isEnglish ? "Book Aarti Participation" : "आरती भागीदारी बुक करें")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
