import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { User, Mail, Phone, Calendar, Users, MapPin, Briefcase, Lock, CreditCard, Package, FileText, Edit2, Save, X, Download, Receipt } from "lucide-react";

const Profile = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    nationality: "Indian",
    maritalStatus: "",
    occupation: "",
    state: "",
    city: "",
    pincode: ""
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [bookings, setBookings] = useState<any[]>([]);
  const [serviceBookings, setServiceBookings] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    
    fetchProfileData();
    if (activeTab === 'bookings') {
      fetchBookingsData();
    } else if (activeTab === 'donations') {
      fetchDonationsData();
    } else if (activeTab === 'membership') {
      fetchMembershipData();
    } else if (activeTab === 'payments') {
      fetchPaymentsData();
    }
  }, [activeTab, navigate]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await api.profile.getProfile();
      if (response.success && response.data) {
        const userData = {
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          dob: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : "",
          gender: response.data.gender || "",
          nationality: response.data.nationality || "Indian",
          maritalStatus: response.data.maritalStatus || "",
          occupation: response.data.occupation || "",
          state: response.data.state || "",
          city: response.data.city || "",
          pincode: response.data.pincode || ""
        };
        setProfileData(userData);
        setEditData(userData);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingsData = async () => {
    try {
      const [bookingsRes, serviceBookingsRes] = await Promise.all([
        api.profile.getBookings(),
        api.profile.getServiceBookings()
      ]);
      
      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
      if (serviceBookingsRes.success && serviceBookingsRes.data) {
        setServiceBookings(serviceBookingsRes.data);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    }
  };

  const fetchDonationsData = async () => {
    try {
      const response = await api.profile.getDonations();
      if (response.success && response.data) {
        setDonations(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to load donations",
        variant: "destructive",
      });
    }
  };

  const fetchMembershipData = async () => {
    try {
      const response = await api.memberships.getMyMemberships();
      if (response.success && response.data) {
        // Store all memberships
        setMemberships(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching membership:', error);
      // If no membership found, that's okay
      setMemberships([]);
    }
  };

  const fetchPaymentsData = async () => {
    try {
      const response = await api.payments.getMyPayments();
      if (response.success && response.data) {
        // Filter only paid payments
        const paidPayments = response.data.filter((p: any) => p.status === 'paid');
        setPayments(paidPayments);
      }
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async (paymentId: string, invoiceNumber: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.shrijeenmata.org/api'}/payments/${paymentId}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: isEnglish ? "Success" : "सफलता",
        description: isEnglish ? "Invoice downloaded successfully" : "रसीद सफलतापूर्वक डाउनलोड हुई",
      });
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.profile.updateProfile(editData);
      if (response.success) {
        setProfileData({ ...editData });
        setIsEditing(false);
        toast({
          title: isEnglish ? "Success" : "सफलता",
          description: isEnglish ? "Profile updated successfully" : "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गया",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    // clear previous errors
    setPasswordErrors({});

    // client-side validation
    const errors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    if (!passwords.currentPassword) errors.currentPassword = isEnglish ? 'Please enter current password' : 'कृपया वर्तमान पासवर्ड दर्ज करें';
    if (!passwords.newPassword) errors.newPassword = isEnglish ? 'Please enter new password' : 'कृपया नया पासवर्ड दर्ज करें';
    if (passwords.newPassword && passwords.newPassword.length < 6) errors.newPassword = isEnglish ? 'Password must be at least 6 characters long' : 'पासवर्ड कम से कम 6 अक्षर लंबा होना चाहिए';
    if (passwords.newPassword !== passwords.confirmPassword) errors.confirmPassword = isEnglish ? "New passwords do not match" : "नए पासवर्ड मेल नहीं खाते";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await api.profile.changePassword(passwords.currentPassword, passwords.newPassword);
      if (response.success) {
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({});
        toast({
          title: isEnglish ? "Success" : "सफलता",
          description: isEnglish ? "Password changed successfully" : "पासवर्ड सफलतापूर्वक बदल गया",
        });
      }
    } catch (error: any) {
      // show field level error when current password is incorrect
      const msg = error?.message || 'Failed to change password';
      if (msg.toLowerCase().includes('current password')) {
        setPasswordErrors({ currentPassword: isEnglish ? 'Current password is incorrect' : 'वर्तमान पासवर्ड गलत है' });
      } else {
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: isEnglish ? "Profile" : "प्रोफाइल", icon: User },
    { id: "bookings", label: isEnglish ? "Booking Details" : "बुकिंग विवरण", icon: FileText },
    { id: "donations", label: isEnglish ? "Donation Details" : "दान विवरण", icon: CreditCard },
    { id: "payments", label: isEnglish ? "Payment History" : "भुगतान इतिहास", icon: Receipt },
    { id: "membership", label: isEnglish ? "Membership Package" : "सदस्य पैकेज", icon: Package },
    { id: "password", label: isEnglish ? "Change Password" : "पासवर्ड बदलें", icon: Lock }
  ];

  const renderProfileView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-decorative text-2xl font-bold text-foreground">
          {isEnglish ? "Personal Information" : "व्यक्तिगत जानकारी"}
        </h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEnglish ? "Edit Profile" : "प्रोफाइल संपादित करें"}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-serif">
                {isEnglish ? "Full Name *" : "पूरा नाम *"}
              </Label>
              <Input
                id="name"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
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
                value={editData.email}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-serif">
                {isEnglish ? "Phone Number *" : "फोन नंबर *"}
              </Label>
              <Input
                id="phone"
                name="phone"
                value={editData.phone}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="font-serif">
                {isEnglish ? "Date of Birth *" : "जन्म तिथि *"}
              </Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={editData.dob}
                onChange={handleInputChange}
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
                value={editData.gender}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
              >
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
                value={editData.nationality}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="font-serif">
                {isEnglish ? "Marital Status *" : "वैवाहिक स्थिति *"}
              </Label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={editData.maritalStatus}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-serif"
              >
                <option value="Single">{isEnglish ? "Single" : "अविवाहित"}</option>
                <option value="Married">{isEnglish ? "Married" : "विवाहित"}</option>
                <option value="Divorced">{isEnglish ? "Divorced" : "तलाकशुदा"}</option>
                <option value="Widowed">{isEnglish ? "Widowed" : "विधवा/विधुर"}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="font-serif">
                {isEnglish ? "Occupation *" : "व्यवसाय *"}
              </Label>
              <Input
                id="occupation"
                name="occupation"
                value={editData.occupation}
                onChange={handleInputChange}
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
                value={editData.state}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="font-serif">
                {isEnglish ? "City *" : "शहर *"}
              </Label>
              <Input
                id="city"
                name="city"
                value={editData.city}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="font-serif">
                {isEnglish ? "Pin Code *" : "पिन कोड *"}
              </Label>
              <Input
                id="pincode"
                name="pincode"
                value={editData.pincode}
                onChange={handleInputChange}
                className="font-serif"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEnglish ? "Save Changes" : "परिवर्तन सहेजें"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="font-serif"
            >
              <X className="w-4 h-4 mr-2" />
              {isEnglish ? "Cancel" : "रद्द करें"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem icon={User} label={isEnglish ? "Full Name" : "पूरा नाम"} value={profileData.name} />
          <InfoItem icon={Mail} label={isEnglish ? "Email" : "ईमेल"} value={profileData.email} />
          <InfoItem icon={Phone} label={isEnglish ? "Phone" : "फोन"} value={profileData.phone} />
          <InfoItem icon={Calendar} label={isEnglish ? "Date of Birth" : "जन्म तिथि"} value={profileData.dob} />
          <InfoItem icon={Users} label={isEnglish ? "Gender" : "लिंग"} value={profileData.gender} />
          <InfoItem icon={MapPin} label={isEnglish ? "Nationality" : "राष्ट्रीयता"} value={profileData.nationality} />
          <InfoItem icon={Users} label={isEnglish ? "Marital Status" : "वैवाहिक स्थिति"} value={profileData.maritalStatus} />
          <InfoItem icon={Briefcase} label={isEnglish ? "Occupation" : "व्यवसाय"} value={profileData.occupation} />
          <InfoItem icon={MapPin} label={isEnglish ? "State" : "राज्य"} value={profileData.state} />
          <InfoItem icon={MapPin} label={isEnglish ? "City" : "शहर"} value={profileData.city} />
          <InfoItem icon={MapPin} label={isEnglish ? "Pin Code" : "पिन कोड"} value={profileData.pincode} />
        </div>
      )}
    </div>
  );

  const renderBookingsView = () => {
    const allBookings = [...bookings, ...serviceBookings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getBookingTitle = (booking: any) => {
      if (booking.bookingType) {
        return booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1) + ' Booking';
      } else if (booking.serviceType) {
        return booking.serviceType.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      return 'Booking';
    };

    return (
      <div className="space-y-4">
        <h2 className="font-decorative text-2xl font-bold text-foreground mb-6">
          {isEnglish ? "Booking History" : "बुकिंग इतिहास"}
        </h2>
        {allBookings.length === 0 ? (
          <Card className="divine-shadow">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground font-serif">
                {isEnglish ? "No bookings found" : "कोई बुकिंग नहीं मिली"}
              </p>
            </CardContent>
          </Card>
        ) : (
          allBookings.map((booking) => (
            <Card key={booking._id} className="divine-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-serif font-semibold text-foreground">{getBookingTitle(booking)}</p>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Booking ID:" : "बुकिंग आईडी:"} {booking._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    {booking.amount && (
                      <p className="font-serif font-bold text-accent">₹{booking.amount}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-serif ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {booking.status === 'cancelled' && booking.rejectionRemark && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-semibold text-red-800 mb-1">
                        {isEnglish ? "Rejection Reason:" : "अस्वीकृति कारण:"}
                      </p>
                      <p className="text-sm text-red-700 font-serif">
                        {booking.rejectionRemark}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  const renderDonationsView = () => (
    <div className="space-y-4">
      <h2 className="font-decorative text-2xl font-bold text-foreground mb-6">
        {isEnglish ? "Donation History" : "दान इतिहास"}
      </h2>
      {donations.length === 0 ? (
        <Card className="divine-shadow">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground font-serif">
              {isEnglish ? "No donations found" : "कोई दान नहीं मिला"}
            </p>
          </CardContent>
        </Card>
      ) : (
        donations.map((donation) => (
          <Card key={donation._id} className="divine-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-serif font-semibold text-foreground">{donation.purpose || (isEnglish ? "General Donation" : "सामान्य दान")}</p>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? "Receipt No:" : "रसीद संख्या:"} {donation.receiptNumber}
                  </p>
                  {donation.transactionId && (
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Transaction ID:" : "ट्रांजैक्शन आईडी:"} {donation.transactionId}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-accent">₹{donation.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(donation.createdAt || donation.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-serif">
                  {isEnglish ? "Completed" : "पूर्ण"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderMembershipView = () => {
    const activeMemberships = memberships.filter((m: any) => m.status === 'Active');
    const hasMemberships = memberships.length > 0;
    
    return (
      <div className="space-y-6">
        <h2 className="font-decorative text-2xl font-bold text-foreground mb-6">
          {isEnglish ? "Membership Package" : "सदस्यता पैकेज"}
        </h2>
        {!hasMemberships ? (
          <Card className="divine-shadow">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-serif mb-6">
                {isEnglish ? "You don't have any memberships" : "आपके पास कोई सदस्यता नहीं है"}
              </p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                onClick={() => navigate('/membership')}
              >
                {isEnglish ? "Get Membership" : "सदस्यता प्राप्त करें"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership, index) => (
              <Card key={membership._id || index} className={`divine-shadow ${membership.status === 'Active' ? 'golden-border' : ''}`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Package className={`w-16 h-16 mx-auto mb-4 ${membership.status === 'Active' ? 'text-accent' : 'text-muted-foreground'}`} />
                    <h3 className="font-decorative text-2xl font-bold text-foreground mb-2">
                      {membership.membershipType} {isEnglish ? "Member" : "सदस्य"}
                    </h3>
                    {membership.startDate && (
                      <p className="text-sm text-muted-foreground">
                        {isEnglish ? "Active Since:" : "सक्रिय से:"} {new Date(membership.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-serif text-muted-foreground">{isEnglish ? "Membership ID" : "सदस्यता आईडी"}</span>
                      <span className="font-serif font-semibold">{membership._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-serif text-muted-foreground">{isEnglish ? "Amount Paid" : "भुगतान राशि"}</span>
                      <span className="font-serif font-semibold">₹{membership.amount?.toLocaleString('en-IN')}</span>
                    </div>
                    {membership.expiryDate && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-serif text-muted-foreground">{isEnglish ? "Valid Until" : "मान्य तिथि"}</span>
                        <span className="font-serif font-semibold">
                          {new Date(membership.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-serif text-muted-foreground">{isEnglish ? "Payment Status" : "भुगतान स्थिति"}</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-serif ${
                        membership.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {membership.paymentStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-serif text-muted-foreground">{isEnglish ? "Status" : "स्थिति"}</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-serif ${
                        membership.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {membership.status === 'Active' ? (isEnglish ? "Active" : "सक्रिय") : (isEnglish ? "Expired" : "समाप्त")}
                      </span>
                    </div>
                  </div>
                  
                  {membership.benefits && membership.benefits.length > 0 && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-serif font-semibold mb-3">{isEnglish ? "Benefits" : "लाभ"}</h4>
                      <ul className="space-y-3">
                        {membership.benefitUsage && membership.benefitUsage.length > 0 ? (
                          membership.benefitUsage.map((benefit: any, idx: number) => {
                            const remaining = benefit.totalAllowed - benefit.used;
                            const percentage = (benefit.used / benefit.totalAllowed) * 100;
                            
                            return (
                              <li key={idx} className="space-y-2">
                                <div className="flex items-start justify-between gap-2 text-sm">
                                  <span className="font-serif text-muted-foreground flex-1">{benefit.benefitName}</span>
                                  <span className={`font-serif font-semibold whitespace-nowrap ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {remaining} / {benefit.totalAllowed} {isEnglish ? "left" : "बचा"}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-full transition-all ${remaining > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${100 - percentage}%` }}
                                  />
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          membership.benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-accent">✓</span>
                              <span className="font-serif text-muted-foreground">{benefit}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}

                  <Button 
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                    onClick={() => navigate('/membership')}
                  >
                    {isEnglish ? "Get Another Membership" : "नई सदस्यता प्राप्त करें"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPaymentsView = () => {
    const getPaymentDescription = (payment: any) => {
      if (payment.paymentFor === 'donation') {
        return payment.metadata?.donationType || 'General Donation';
      } else if (payment.paymentFor === 'membership') {
        return `${payment.metadata?.membershipType || 'Temple'} Membership`;
      } else if (payment.paymentFor === 'service-booking' || payment.paymentFor === 'service') {
        return payment.metadata?.serviceType || payment.metadata?.serviceName || 'Temple Service';
      } else if (payment.paymentFor === 'booking') {
        return payment.metadata?.bookingType || 'Temple Booking';
      }
      return 'Payment';
    };

    return (
      <div className="space-y-6">
        <h2 className="font-decorative text-2xl font-bold text-foreground mb-6">
          {isEnglish ? "Payment History" : "भुगतान इतिहास"}
        </h2>
        {payments.length === 0 ? (
          <Card className="divine-shadow">
            <CardContent className="p-8 text-center">
              <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-serif">
                {isEnglish ? "No payment history found" : "कोई भुगतान इतिहास नहीं मिला"}
              </p>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment, index) => (
            <Card key={payment._id || index} className="divine-shadow hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="w-5 h-5 text-accent" />
                      <h3 className="font-serif font-bold text-lg">
                        {getPaymentDescription(payment)}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Invoice:" : "चालान:"} {payment.invoiceNumber || `INV-${payment.razorpayOrderId || payment._id}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Transaction ID:" : "ट्रांज़ैक्शन आईडी:"} {payment.razorpayPaymentId || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isEnglish ? "Date:" : "तारीख:"} {new Date(payment.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-2xl text-accent">₹{payment.amount.toFixed(2)}</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-serif mt-2">
                      {isEnglish ? "Paid" : "भुगतान किया"}
                    </span>
                  </div>
                </div>
                
                {payment.metadata?.couponCode && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-serif">
                      💰 {isEnglish ? "Discount Applied:" : "छूट लागू:"} {payment.metadata.couponCode}
                      {payment.metadata.discountAmount && ` (-₹${payment.metadata.discountAmount.toFixed(2)})`}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-end">
                  <Button
                    onClick={() => handleDownloadInvoice(payment._id, payment.invoiceNumber || `INV-${payment.razorpayOrderId || payment._id}`)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isEnglish ? "Download Invoice" : "चालान डाउनलोड करें"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  const renderPasswordView = () => (
    <div className="space-y-6">
      <h2 className="font-decorative text-2xl font-bold text-foreground mb-6">
        {isEnglish ? "Change Password" : "पासवर्ड बदलें"}
      </h2>
      <Card className="divine-shadow">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-serif">
                {isEnglish ? "Current Password *" : "वर्तमान पासवर्ड *"}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="font-serif"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, currentPassword: e.target.value });
                  if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                }}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600 mt-1 font-serif">{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-serif">
                {isEnglish ? "New Password *" : "नया पासवर्ड *"}
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="font-serif"
                name="newPassword"
                value={passwords.newPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, newPassword: e.target.value });
                  if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                  if (passwordErrors.confirmPassword && passwords.confirmPassword === e.target.value) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                }}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600 mt-1 font-serif">{passwordErrors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-serif">
                {isEnglish ? "Confirm New Password *" : "नया पासवर्ड पुष्टि करें *"}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="font-serif"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, confirmPassword: e.target.value });
                  if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                }}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1 font-serif">{passwordErrors.confirmPassword}</p>
              )}
            </div>
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (isEnglish ? 'Updating...' : 'अपडेट हो रहा है...') : (isEnglish ? "Update Password" : "पासवर्ड अपडेट करें")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                <User className="w-12 h-12 text-accent-foreground" />
              </div>
              <h1 className="font-decorative text-4xl font-bold text-foreground mb-2">
                {profileData.name}
              </h1>
              <p className="font-serif text-lg text-muted-foreground">{profileData.email}</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    className={`font-serif ${
                      activeTab === tab.id
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : "hover:bg-accent/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* Content */}
            {isLoading && activeTab === "profile" ? (
              <Card className="divine-shadow">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground font-serif">{isEnglish ? "Loading..." : "लोड हो रहा है..."}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="divine-shadow">
                <CardContent className="p-8">
                  {activeTab === "profile" && renderProfileView()}
                  {activeTab === "bookings" && renderBookingsView()}
                  {activeTab === "donations" && renderDonationsView()}
                  {activeTab === "payments" && renderPaymentsView()}
                  {activeTab === "membership" && renderMembershipView()}
                  {activeTab === "password" && renderPasswordView()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
    <Icon className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground font-serif mb-1">{label}</p>
      <p className="font-serif font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default Profile;
