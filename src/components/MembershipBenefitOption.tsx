import { Award, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MembershipBenefitOptionProps {
  isEnglish: boolean;
  availableBenefits: any[];
  useMembershipBenefit: boolean;
  setUseMembershipBenefit: (value: boolean) => void;
  selectedBenefit: any;
  setSelectedBenefit: (benefit: any) => void;
  amount: string;
}

export const MembershipBenefitOption = ({
  isEnglish,
  availableBenefits,
  useMembershipBenefit,
  setUseMembershipBenefit,
  selectedBenefit,
  setSelectedBenefit,
  amount
}: MembershipBenefitOptionProps) => {
  const hasBenefits = availableBenefits.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="font-decorative text-xl text-primary flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-accent" />
        {isEnglish ? "Payment Options" : "भुगतान विकल्प"}
      </h3>
      
      <div className="space-y-3">
        {/* Online Payment Option */}
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            !useMembershipBenefit 
              ? 'border-accent bg-accent/5' 
              : 'border-border hover:border-accent/50'
          }`}
          onClick={() => setUseMembershipBenefit(false)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              !useMembershipBenefit ? 'border-accent' : 'border-gray-300'
            }`}>
              {!useMembershipBenefit && (
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-accent" />
                <h4 className="font-serif font-bold text-lg">
                  {isEnglish ? "Pay Online" : "ऑनलाइन भुगतान करें"}
                </h4>
              </div>
              <p className="font-serif text-sm text-muted-foreground">
                {isEnglish 
                  ? `Pay ₹${amount} using Razorpay (Credit/Debit Card, UPI, Net Banking)` 
                  : `Razorpay का उपयोग करके ₹${amount} का भुगतान करें (क्रेडिट/डेबिट कार्ड, UPI, नेट बैंकिंग)`}
              </p>
              <div className="mt-2">
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold">
                  ₹{amount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Benefit Option - Only show if benefits available */}
        {hasBenefits && (
          <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            useMembershipBenefit 
              ? 'border-accent bg-accent/5 ring-2 ring-accent/20' 
              : 'border-border hover:border-accent/50'
          }`}
          onClick={() => setUseMembershipBenefit(true)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
              useMembershipBenefit ? 'border-accent' : 'border-gray-300'
            }`}>
              {useMembershipBenefit && (
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-accent" />
                <h4 className="font-serif font-bold text-lg">
                  {isEnglish ? "Use Membership Benefit" : "सदस्यता लाभ का उपयोग करें"}
                </h4>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {isEnglish ? "FREE" : "मुफ़्त"}
                </span>
              </div>
              <p className="font-serif text-sm text-muted-foreground mb-3">
                {isEnglish 
                  ? "Book using your membership benefits at no cost" 
                  : "बिना किसी लागत के अपने सदस्यता लाभों का उपयोग करके बुक करें"}
              </p>
              
              {useMembershipBenefit && (
                <div className="space-y-3 mt-3 pt-3 border-t border-accent/20">
                  <div className="space-y-2">
                    <Label className="font-serif text-sm">
                      {isEnglish ? "Select Benefit" : "लाभ चुनें"}
                    </Label>
                    <select 
                      value={selectedBenefit?.membershipId || ''}
                      onChange={(e) => {
                        const benefit = availableBenefits.find(b => b.membershipId === e.target.value);
                        setSelectedBenefit(benefit);
                      }}
                      className="w-full p-2 border rounded-md font-serif text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {availableBenefits.map((benefit) => (
                        <option key={benefit.membershipId} value={benefit.membershipId}>
                          {benefit.benefitName} ({benefit.remaining} {isEnglish ? 'left' : 'शेष'})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedBenefit && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-serif text-muted-foreground">
                          {isEnglish ? "Membership Type:" : "सदस्यता प्रकार:"}
                        </span>
                        <span className="font-serif font-bold">
                          {selectedBenefit.membershipType}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-serif text-muted-foreground">
                          {isEnglish ? "Benefits Remaining:" : "शेष लाभ:"}
                        </span>
                        <span className="font-serif font-bold text-green-600">
                          {selectedBenefit.remaining} / {selectedBenefit.totalAllowed}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-serif text-green-700 bg-green-100 px-2 py-1 rounded">
                        {isEnglish 
                          ? `You will have ${selectedBenefit.remaining - 1} benefits remaining after this booking`
                          : `इस बुकिंग के बाद आपके पास ${selectedBenefit.remaining - 1} लाभ शेष रहेंगे`}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        
        {/* Info message for users without benefits */}
        {!hasBenefits && (
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-serif font-bold text-blue-900 mb-1">
                  {isEnglish ? "Want to save on future bookings?" : "भविष्य की बुकिंग पर बचत करना चाहते हैं?"}
                </h4>
                <p className="font-serif text-sm text-blue-800">
                  {isEnglish 
                    ? "Purchase a membership to enjoy FREE bookings and exclusive benefits!" 
                    : "मुफ्त बुकिंग और विशेष लाभों का आनंद लेने के लिए सदस्यता खरीदें!"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
