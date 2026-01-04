import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from '@/hooks/useRazorpay';
import api from '@/services/api';
import { Crown, Users, Heart, User, Check, Sparkles, Star, Tag } from "lucide-react";

interface MembershipType {
  _id: string;
  membershipType: string;
  amount: number;
  duration: number;
  benefits: string[];
  description?: string;
  isActive: boolean;
  serviceBenefits?: Record<string, { enabled: boolean; count: number }>;
}

const Membership = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    members: "1"
  });
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCouponValidating, setIsCouponValidating] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const { initiatePayment } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Fetch membership types from backend
  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        setIsLoading(true);
        const defaultTypes = getDefaultMembershipTypes();
        
        const response = await api.memberships.getMembershipTypes();
        if (response.success && response.data && response.data.length > 0) {
          // Combine default types with custom types from backend
          const allTypes = [...defaultTypes, ...response.data];
          // Sort by amount in descending order (highest first)
          allTypes.sort((a, b) => b.amount - a.amount);
          setMembershipTypes(allTypes);
        } else {
          // Show only default membership types if no custom types exist
          // Sort by amount in descending order (highest first)
          const sortedTypes = [...defaultTypes].sort((a, b) => b.amount - a.amount);
          setMembershipTypes(sortedTypes);
        }
      } catch (error) {
        console.error('Failed to fetch membership types:', error);
        // Show default membership types on error
        // Sort by amount in descending order (highest first)
        const sortedTypes = getDefaultMembershipTypes().sort((a, b) => b.amount - a.amount);
        setMembershipTypes(sortedTypes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  // Default membership types fallback
  const getDefaultMembershipTypes = (): MembershipType[] => [
    // {
    //   _id: '1',
    //   membershipType: language === 'en' ? 'Membership Type-1' : 'सदस्यता प्रकार-1',
    //   amount: 51000,
    //   duration: 12,
    //   benefits: [
    //     language === 'en' ? 'Two Special Pooja @ Shri Jeen Darbar' : 'श्री जीन दरबार में दो विशेष पूजा',
    //     language === 'en' ? 'Four Times Divya Darshan on Navratri Mahotsav' : 'नवरात्रि महोत्सव पर चार बार दिव्य दर्शन',
    //     language === 'en' ? 'Stay at Shri Jeen Vatika on Navratri Mahotsav (8 Members for 4 Days) (Subject to Availability)' : 'नवरात्रि महोत्सव पर श्री जीन वाटिका में ठहरना (8 सदस्य 4 दिनों के लिए) (उपलब्धता के अधीन)',
    //     language === 'en' ? 'Shri Jeen Prasadam for Family' : 'परिवार के लिए श्री जीन प्रसादम'
    //   ],
    //   description: language === 'en' ? 'For Family - 8 Adults' : 'परिवार के लिए - 8 वयस्क',
    //   isActive: true
    // },
    // {
    //   _id: '2',
    //   membershipType: language === 'en' ? 'Membership Type-2' : 'सदस्यता प्रकार-2',
    //   amount: 31000,
    //   duration: 12,
    //   benefits: [
    //     language === 'en' ? 'Two Special Pooja @ Shri Jeen Darbar' : 'श्री जीन दरबार में दो विशेष पूजा',
    //     language === 'en' ? 'Four Times Divya Darshan on Navratri Mahotsav' : 'नवरात्रि महोत्सव पर चार बार दिव्य दर्शन',
    //     language === 'en' ? 'Stay at Shri Jeen Vatika on Navratri Mahotsav (4 Members for 2 Days) (Subject to Availability)' : 'नवरात्रि महोत्सव पर श्री जीन वाटिका में ठहरना (4 सदस्य 2 दिनों के लिए) (उपलब्धता के अधीन)',
    //     language === 'en' ? 'Shri Jeen Prasadam for Family' : 'परिवार के लिए श्री जीन प्रसादम'
    //   ],
    //   description: language === 'en' ? 'For Family - 4 Adults' : 'परिवार के लिए - 4 वयस्क',
    //   isActive: true
    // },
    // {
    //   _id: '3',
    //   membershipType: language === 'en' ? 'Membership Type-3' : 'सदस्यता प्रकार-3',
    //   amount: 21000,
    //   duration: 12,
    //   benefits: [
    //     language === 'en' ? 'Two Special Pooja @ Shri Jeen Darbar (Except Navratri)' : 'श्री जीन दरबार में दो विशेष पूजा (नवरात्रि को छोड़कर)',
    //     language === 'en' ? 'Two Times Divya Darshan on Navratri Mahotsav' : 'नवरात्रि महोत्सव पर दो बार दिव्य दर्शन',
    //     language === 'en' ? 'Stay at Shri Jeen Vatika on Navratri Mahotsav (Two Days) (Subject to Availability)' : 'नवरात्रि महोत्सव पर श्री जीन वाटिका में ठहरना (दो दिन) (उपलब्धता के अधीन)',
    //     language === 'en' ? 'Shri Jeen Prasadam for Family' : 'परिवार के लिए श्री जीन प्रसादम'
    //   ],
    //   description: language === 'en' ? 'For Couple' : 'दंपति के लिए',
    //   isActive: true
    // },
    // {
    //   _id: '4',
    //   membershipType: language === 'en' ? 'Membership Type-4' : 'सदस्यता प्रकार-4',
    //   amount: 11000,
    //   duration: 12,
    //   benefits: [
    //     language === 'en' ? 'One Time Special Pooja @ Shri Jeen Darbar (Except Navratri)' : 'श्री जीन दरबार में एक बार विशेष पूजा (नवरात्रि को छोड़कर)',
    //     language === 'en' ? 'Two Times Divya Darshan on Navratri Mahotsav' : 'नवरात्रि महोत्सव पर दो बार दिव्य दर्शन',
    //     language === 'en' ? 'Stay at Shri Jeen Vatika on Navratri Mahotsav (One Day) (Subject to Availability)' : 'नवरात्रि महोत्सव पर श्री जीन वाटिका में ठहरना (एक दिन) (उपलब्धता के अधीन)',
    //     language === 'en' ? 'Shri Jeen Prasadam for Family' : 'परिवार के लिए श्री जीन प्रसादम'
    //   ],
    //   description: language === 'en' ? 'For an Individual' : 'व्यक्तिगत के लिए',
    //   isActive: true
    // }
  ];

  // Get icon for membership type
  const getIcon = (index: number) => {
    const icons = [Crown, Users, Heart, User, Sparkles, Star];
    return icons[index % icons.length];
  };

  // Map service keys to readable display names (match backend)
  const serviceDisplayNames: Record<string, string> = {
    'divya-darshan': language === 'en' ? 'Divya Darshan' : 'दिव्य दर्शन',
    'special-pooja': language === 'en' ? 'Special Pooja' : 'विशेष पूजा',
    'accommodation': language === 'en' ? 'Accommodation/Stay' : 'ठहराव',
    'prasad': language === 'en' ? 'Prasad' : 'प्रसाद',
    'bhog': language === 'en' ? 'Bhog' : 'भोग',
    'poshak': language === 'en' ? 'Poshak' : 'पोशाक',
    'seva-satkar': language === 'en' ? 'Seva Satkar' : 'सेवा सत्कार',
    'sawamani': language === 'en' ? 'Sawamani' : 'सवामनी'
  };

  // Get color for membership type
  const getColor = (index: number) => {
    const colors = [
      "from-amber-500 to-yellow-600",
      "from-orange-500 to-red-600",
      "from-pink-500 to-rose-600",
      "from-purple-500 to-indigo-600",
      "from-blue-500 to-cyan-600",
      "from-green-500 to-emerald-600"
    ];
    return colors[index % colors.length];
  };

  const handleApplyCoupon = async () => {
    if (!couponCode || !selectedPlan) return;

    setIsCouponValidating(true);
    try {
      const response: any = await api.coupons.validateCoupon(
        couponCode, 
        selectedPlan.amount, 
        'membership',
        selectedPlan.membershipType
      );
      if (response.success) {
        setAppliedCoupon(response);
        setFinalAmount(response.finalAmount || selectedPlan.amount);
        const discount = response.discount || 0;
        toast({
          title: language === 'en' ? 'Coupon Applied!' : 'कूपन लागू किया गया!',
          description: `${language === 'en' ? 'Discount' : 'छूट'}: ₹${discount}`,
        });
      }
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Invalid Coupon' : 'अमान्य कूपन',
        description: error.message || (language === 'en' ? 'Failed to apply coupon' : 'कूपन लागू करने में विफल'),
        variant: 'destructive',
      });
      setAppliedCoupon(null);
      setFinalAmount(selectedPlan.amount);
    } finally {
      setIsCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setFinalAmount(selectedPlan?.amount || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Initiate Razorpay payment for membership
    if (!selectedPlan) return;

    const paymentAmount = appliedCoupon ? finalAmount : selectedPlan.amount;
    if (paymentAmount <= 0) {
      toast({ title: 'Error', description: 'Invalid membership amount', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);

    initiatePayment({
      amount: paymentAmount,
      paymentFor: 'membership',
      userDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      metadata: {
        membershipType: selectedPlan.membershipType,
        planId: selectedPlan._id,
        durationDays: selectedPlan.duration * 30,
        couponCode: appliedCoupon ? couponCode : undefined,
        originalAmount: selectedPlan.amount,
        discountAmount: appliedCoupon ? (appliedCoupon.discount || 0) : 0,
      },
      onSuccess: async (paymentData: any) => {
        // paymentData comes from backend verification
        try {
          // Create membership record in backend
          await api.memberships.create({
            membershipType: selectedPlan.membershipType,
            amount: paymentAmount,
            duration: selectedPlan.duration,
            paymentId: paymentData.razorpay_payment_id,
            orderId: paymentData.razorpay_order_id,
          });

          toast({ 
            title: language === 'en' ? 'Payment Successful' : 'भुगतान सफल', 
            description: language === 'en' ? 'Your membership has been activated successfully!' : 'आपकी सदस्यता सफलतापूर्वक सक्रिय हो गई है!' 
          });
          
          setSelectedPlan(null);
          // Navigate to profile to see membership details
          setTimeout(() => navigate('/profile'), 700);
        } catch (error) {
          console.error('Membership creation error:', error);
          toast({ 
            title: language === 'en' ? 'Error' : 'त्रुटि', 
            description: language === 'en' ? 'Payment successful but membership creation failed. Please contact support.' : 'भुगतान सफल लेकिन सदस्यता बनाने में विफल। कृपया सहायता से संपर्क करें।',
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
        }
      },
      onFailure: (err: any) => {
        setIsProcessing(false);
        // onFailure handled by hook with toast, but ensure dialog stays
      }
    });
  };

  // when dialog opens, prefill form from profile
  useEffect(() => {
    if (!selectedPlan) {
      // Reset coupon state when dialog closes
      setCouponCode("");
      setAppliedCoupon(null);
      setFinalAmount(0);
      return;
    }

    // Set initial amount
    setFinalAmount(selectedPlan.amount);

    const fetchProfile = async () => {
      try {
        const res = await api.profile.getProfile();
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            members: '1'
          });
        }
      } catch (error) {
        // ignore silently
      }
    };

    fetchProfile();
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12 animate-fade-in">
          <Crown className="w-16 h-16 mx-auto mb-4 text-accent animate-pulse-glow" />
          <h1 className="font-decorative text-5xl font-bold text-foreground mb-4">
            {language === 'en' ? 'Temple Membership' : 'मंदिर सदस्यता'}
          </h1>
          <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {language === 'en' 
              ? 'Join our spiritual family with exclusive benefits and divine blessings'
              : 'विशेष लाभ और दिव्य आशीर्वाद के साथ हमारे आध्यात्मिक परिवार में शामिल हों'}
          </p>
          <p className="font-serif text-sm text-muted-foreground italic border-l-4 border-accent pl-4 inline-block">
            {language === 'en'
              ? 'Note: Trust Management has sole discretionary power to approve/disapprove any membership application. If disapproved, the amount will be refunded at the earliest.'
              : 'नोट: किसी भी सदस्यता आवेदन को स्वीकृत/अस्वीकृत करने की एकमात्र विवेकाधीन शक्ति ट्रस्ट प्रबंधन के पास है। अस्वीकृत होने पर, राशि शीघ्रातिशीघ्र वापस कर दी जाएगी।'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : membershipTypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {language === 'en' ? 'No membership types available at the moment' : 'इस समय कोई सदस्यता प्रकार उपलब्ध नहीं है'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {membershipTypes.map((membership, index) => {
              const Icon = getIcon(index);
              const color = getColor(index);
              
              return (
                <Card 
                  key={membership._id}
                  className="group hover:scale-105 transition-all duration-300 divine-shadow hover:golden-border overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${color}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${color} text-white`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <p className="font-decorative text-3xl font-bold text-accent">₹{membership.amount.toLocaleString()}/-</p>
                        <p className="font-serif text-xs text-muted-foreground">
                          {language === 'en' ? `${membership.duration} Months` : `${membership.duration} महीने`}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="font-decorative text-2xl">
                      {membership.membershipType}
                    </CardTitle>
                    {membership.description && (
                      <p className="font-serif text-sm text-muted-foreground">
                        {membership.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* If serviceBenefits provided by API, show those with counts, otherwise show textual benefits */}
                      {membership.serviceBenefits && Object.keys(membership.serviceBenefits).length > 0 ? (
                        Object.entries(membership.serviceBenefits)
                          .filter(([_, cfg]) => cfg && (cfg as any).enabled)
                          .map(([key, cfg], idx) => {
                            const count = (cfg as any).count ?? 0;
                            const name = serviceDisplayNames[key] || key;
                            return (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                <p className="font-serif text-md text-muted-foreground leading-relaxed flex items-baseline gap-2">
                                  <span>{name}</span>
                                  {count > 0 && (
                                    <span className="text-lg text-muted-foreground/80">— {count}</span>
                                  )}
                                </p>
                              </div>
                            );
                          })
                      ) : (
                        membership.benefits.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                              {feature}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <Button 
                      onClick={() => setSelectedPlan(membership)}
                      className="w-full mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    >
                      {language === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-decorative text-2xl">
              {language === 'en' ? 'Membership Application' : 'सदस्यता आवेदन'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{language === 'en' ? 'Full Name' : 'पूरा नाम'}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{language === 'en' ? 'Email' : 'ईमेल'}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{language === 'en' ? 'Phone Number' : 'फोन नंबर'}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">{language === 'en' ? 'Address (Optional)' : 'पता (वैकल्पिक)'}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'I agree to the terms and conditions'
                  : 'मैं नियम और शर्तों से सहमत हूं'}
              </label>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <Label htmlFor="coupon">{language === 'en' ? 'Have a Coupon Code?' : 'कूपन कोड है?'}</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder={language === 'en' ? 'Enter coupon code' : 'कूपन कोड दर्ज करें'}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="uppercase"
                />
                {appliedCoupon ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveCoupon}
                    className="whitespace-nowrap"
                  >
                    {language === 'en' ? 'Remove' : 'हटाएं'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || isCouponValidating}
                    className="whitespace-nowrap"
                  >
                    {isCouponValidating ? (language === 'en' ? 'Checking...' : 'जांच रहे हैं...') : (language === 'en' ? 'Apply' : 'लागू करें')}
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  <Tag className="h-4 w-4" />
                  <span>
                    {language === 'en' ? 'Coupon applied!' : 'कूपन लागू किया गया!'} 
                    {' '}({appliedCoupon.coupon?.code || couponCode})
                  </span>
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-serif text-sm text-muted-foreground">
                <strong>{language === 'en' ? 'Selected Plan:' : 'चयनित योजना:'}</strong> {selectedPlan?.membershipType}
              </p>
              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'en' ? 'Original Price:' : 'मूल कीमत:'}</span>
                    <span className="line-through text-muted-foreground">₹{selectedPlan?.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>{language === 'en' ? 'Discount:' : 'छूट:'}</span>
                    <span>- ₹{(appliedCoupon.discount || 0).toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-decorative text-lg">{language === 'en' ? 'Total Amount:' : 'कुल राशि:'}</span>
                <span className="font-decorative text-2xl text-accent">
                  ₹{(appliedCoupon ? finalAmount : selectedPlan?.amount || 0).toLocaleString()}/-
                </span>
              </div>
              <p className="font-serif text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Duration:' : 'अवधि:'} {selectedPlan?.duration} {language === 'en' ? 'months' : 'महीने'}
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (language === 'en' ? 'Processing...' : 'प्रोसेस हो रहा है...') : (language === 'en' ? 'Submit Application' : 'आवेदन जमा करें')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Membership;
