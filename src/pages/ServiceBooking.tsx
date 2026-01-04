import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingDetails {
  bookingId: string;
  categoryName: string;
  serviceName: string;
  bookingStatus: string;
  name: string;
  gender: string;
  nationality: string;
  mobile: string;
  email: string;
  membershipId: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  bookingDate: string;
  idProof: string;
  idNumber: string;
  documentImage: string;
  darshanStatus: string;
  transactionId: string;
  amount: string;
  paymentDateTime: string;
}

const ServiceBooking = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const service = searchParams.get("service") || "general";
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const serviceNames: Record<string, { en: string; hi: string }> = {
    darshan: { en: "Divya Darshan", hi: "दिव्य दर्शन" },
    pooja: { en: "Special Pooja", hi: "विशेष पूजा" },
    bhog: { en: "Bhog", hi: "भोग" },
    poshak: { en: "Shree Jeen Mata Poshak", hi: "श्री जीण माता पोशाक" },
    accommodation: { en: "Accommodation", hi: "आवास" },
    seva: { en: "Seva-Satkar", hi: "सेवा-सहकार" },
    general: { en: "General Service", hi: "सामान्य सेवा" }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Generate booking details
    const bookingId = `JMT${Date.now().toString().slice(-8)}`;
    const transactionId = `TXN${Date.now().toString().slice(-10)}`;
    const currentDateTime = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const details: BookingDetails = {
      bookingId,
      categoryName: "Temple Services",
      serviceName: serviceNames[service]?.[language] || serviceNames.general[language],
      bookingStatus: "Confirmed",
      name: formData.get("name") as string,
      gender: formData.get("gender") as string,
      nationality: formData.get("nationality") as string,
      mobile: formData.get("mobile") as string,
      email: formData.get("email") as string,
      membershipId: formData.get("membershipId") as string || "N/A",
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pinCode: formData.get("pinCode") as string,
      bookingDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
      idProof: formData.get("idProof") as string,
      idNumber: formData.get("idNumber") as string,
      documentImage: documentFile?.name || "Not uploaded",
      darshanStatus: "Pending",
      transactionId,
      amount: formData.get("amount") as string,
      paymentDateTime: currentDateTime
    };

    setBookingDetails(details);
    setShowConfirmation(true);

    toast({
      title: isEnglish ? "Booking Successful! 🙏" : "बुकिंग सफल! 🙏",
      description: isEnglish ? `Your booking ID: ${bookingId}` : `आपकी बुकिंग आईडी: ${bookingId}`,
    });
  };

  if (showConfirmation && bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="divine-shadow golden-border">
                <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-center py-8">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 className="w-20 h-20 text-accent" />
                  </div>
                  <CardTitle className="font-decorative text-3xl">
                    {isEnglish ? "Booking Confirmed!" : "बुकिंग की पुष्टि हुई!"}
                  </CardTitle>
                  <p className="font-serif text-lg mt-2">
                    {isEnglish ? "Thank you for your booking" : "आपकी बुकिंग के लिए धन्यवाद"}
                  </p>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <DetailItem label={isEnglish ? "Booking ID" : "बुकिंग आईडी"} value={bookingDetails.bookingId} highlight />
                    <DetailItem label={isEnglish ? "Category Name" : "श्रेणी का नाम"} value={bookingDetails.categoryName} />
                    <DetailItem label={isEnglish ? "Service Name" : "सेवा का नाम"} value={bookingDetails.serviceName} />
                    <DetailItem label={isEnglish ? "Booking Status" : "बुकिंग स्थिति"} value={bookingDetails.bookingStatus} highlight />
                    <DetailItem label={isEnglish ? "Name" : "नाम"} value={bookingDetails.name} />
                    <DetailItem label={isEnglish ? "Gender" : "लिंग"} value={bookingDetails.gender} />
                    <DetailItem label={isEnglish ? "Nationality" : "राष्ट्रीयता"} value={bookingDetails.nationality} />
                    <DetailItem label={isEnglish ? "Mobile" : "मोबाइल"} value={bookingDetails.mobile} />
                    <DetailItem label={isEnglish ? "Email" : "ईमेल"} value={bookingDetails.email} />
                    <DetailItem label={isEnglish ? "Membership ID" : "सदस्यता आईडी"} value={bookingDetails.membershipId} />
                    <DetailItem label={isEnglish ? "Address" : "पता"} value={bookingDetails.address} className="md:col-span-2" />
                    <DetailItem label={isEnglish ? "City" : "शहर"} value={bookingDetails.city} />
                    <DetailItem label={isEnglish ? "State" : "राज्य"} value={bookingDetails.state} />
                    <DetailItem label={isEnglish ? "Pin Code" : "पिन कोड"} value={bookingDetails.pinCode} />
                    <DetailItem label={isEnglish ? "Booking Date" : "बुकिंग तिथि"} value={bookingDetails.bookingDate} />
                    <DetailItem label={isEnglish ? "ID Proof" : "आईडी प्रूफ"} value={bookingDetails.idProof} />
                    <DetailItem label={isEnglish ? "ID Number" : "आईडी नंबर"} value={bookingDetails.idNumber} />
                    <DetailItem label={isEnglish ? "Document Image" : "दस्तावेज़ छवि"} value={bookingDetails.documentImage} className="md:col-span-2" />
                    <DetailItem label={isEnglish ? "Darshan Status" : "दर्शन स्थिति"} value={bookingDetails.darshanStatus} />
                    <DetailItem label={isEnglish ? "Transaction ID" : "लेनदेन आईडी"} value={bookingDetails.transactionId} highlight />
                    <DetailItem label={isEnglish ? "Amount" : "राशि"} value={`₹${bookingDetails.amount}`} highlight />
                    <DetailItem label={isEnglish ? "Payment Date/Time" : "भुगतान दिनांक/समय"} value={bookingDetails.paymentDateTime} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <Button 
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                      onClick={() => window.print()}
                    >
                      {isEnglish ? "Print Receipt" : "रसीद प्रिंट करें"}
                    </Button>
                    <Button 
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-serif"
                      onClick={() => navigate("/")}
                    >
                      {isEnglish ? "Back to Home" : "होम पर वापस जाएं"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Service Booking" : "सेवा बुकिंग"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {serviceNames[service]?.[language] || serviceNames.general[language]}
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="divine-shadow golden-border">
                <CardHeader>
                  <CardTitle className="font-decorative text-2xl text-center">
                    {isEnglish ? "Fill Booking Details" : "बुकिंग विवरण भरें"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8">
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
                          <Input id="name" name="name" required className="font-serif" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender" className="font-serif">
                            {isEnglish ? "Gender *" : "लिंग *"}
                          </Label>
                          <select 
                            id="gender" 
                            name="gender" 
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
                          <Input id="nationality" name="nationality" required className="font-serif" defaultValue="Indian" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="font-serif">
                            {isEnglish ? "Mobile Number *" : "मोबाइल नंबर *"}
                          </Label>
                          <Input id="mobile" name="mobile" type="tel" required className="font-serif" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-serif">
                            {isEnglish ? "Email Address *" : "ईमेल पता *"}
                          </Label>
                          <Input id="email" name="email" type="email" required className="font-serif" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="membershipId" className="font-serif">
                            {isEnglish ? "Membership ID (Optional)" : "सदस्यता आईडी (वैकल्पिक)"}
                          </Label>
                          <Input id="membershipId" name="membershipId" className="font-serif" />
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
                        <Textarea id="address" name="address" required className="font-serif" rows={3} />
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="font-serif">
                            {isEnglish ? "City *" : "शहर *"}
                          </Label>
                          <Input id="city" name="city" required className="font-serif" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state" className="font-serif">
                            {isEnglish ? "State *" : "राज्य *"}
                          </Label>
                          <Input id="state" name="state" required className="font-serif" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pinCode" className="font-serif">
                            {isEnglish ? "Pin Code *" : "पिन कोड *"}
                          </Label>
                          <Input id="pinCode" name="pinCode" required className="font-serif" />
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
                            value="Aadhaar Card"
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

                    {/* Payment Details */}
                    <div className="space-y-4">
                      <h3 className="font-decorative text-xl text-primary">
                        {isEnglish ? "Payment Details" : "भुगतान विवरण"}
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
                            min="100" 
                            required 
                            className="font-serif text-lg"
                            defaultValue="500"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                    >
                      {isEnglish ? "Proceed to Payment" : "भुगतान के लिए आगे बढ़ें"}
                    </Button>
                  </form>
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

const DetailItem = ({ 
  label, 
  value, 
  highlight = false,
  className = ""
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <p className="font-serif text-sm text-muted-foreground">{label}</p>
    <p className={`font-serif font-semibold ${highlight ? 'text-accent text-lg' : 'text-foreground'}`}>
      {value}
    </p>
  </div>
);

export default ServiceBooking;
