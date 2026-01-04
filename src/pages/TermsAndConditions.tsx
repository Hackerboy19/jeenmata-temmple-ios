import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";

const TermsAndConditions = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Terms & Conditions" : "नियम व शर्तें"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Please read these terms and conditions carefully before using our website." 
                : "कृपया हमारी वेबसाइट का उपयोग करने से पहले इन नियमों और शर्तों को ध्यानपूर्वक पढ़ें।"}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {isEnglish ? (
                <>
                  <p className="font-serif text-muted-foreground text-sm">Last Updated: December 5, 2025</p>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">1. Acceptance of Terms</h2>
                    <p className="font-serif leading-relaxed">By accessing or using the website of Shri Jeen Mata Mandir Trust, you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you should not use this site.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">2. Use of Website</h2>
                    <p className="font-serif leading-relaxed">You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">3. Bookings, Payments & Donations</h2>
                    <p className="font-serif leading-relaxed">Bookings and donations made through the website are subject to availability and the specific terms shown at the time of booking. Payments are processed via third-party providers (e.g., Razorpay). We are not responsible for the policies or security of those providers beyond ensuring we integrate them correctly.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">4. Cancellation and Refunds</h2>
                    <p className="font-serif leading-relaxed">Cancellation and refund policies vary by service. Please review the specific cancellation rules shown when you make a booking. Any refunds will be processed in accordance with the provider’s policies and may take time to reflect in your account.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">5. Intellectual Property</h2>
                    <p className="font-serif leading-relaxed">All content on this website, including text, images, logos and design, is the property of Shri Jeen Mata Mandir Trust or its licensors and is protected by applicable intellectual property laws. You may not reproduce or use the site content without permission.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">6. Limitation of Liability</h2>
                    <p className="font-serif leading-relaxed">To the fullest extent permitted by law, Shri Jeen Mata Mandir Trust shall not be liable for any indirect, incidental, special or consequential damages arising out of or in connection with your use of the website.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">7. Governing Law</h2>
                    <p className="font-serif leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in Sikar, Rajasthan.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">8. Changes to Terms</h2>
                    <p className="font-serif leading-relaxed">We may update these Terms & Conditions from time to time. We will post the updated terms on this page with a revised "Last Updated" date.</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">9. Contact Us</h2>
                    <div className="font-serif leading-relaxed">
                      <p>If you have any questions about these Terms & Conditions, please contact us:</p>
                      <div className="bg-muted p-6 rounded-lg space-y-1">
                        <p><strong>Shri Jeen Mata Ji Mandir</strong></p>
                        <p>Sikar, Rajasthan, India</p>
                        <p>Email: sjmmtrust@gmail.com</p>
                        <p>Phone: 01576-227346</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-serif text-muted-foreground text-sm">अंतिम अपडेट: 5 दिसंबर, 2025</p>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">1. नियमों की स्वीकृति</h2>
                    <p className="font-serif leading-relaxed">श्री जीण माता मंदिर ट्रस्ट की वेबसाइट का उपयोग कर आप इन नियमों व शर्तों के पालन के लिए सहमति देते हैं। यदि आप सहमत नहीं हैं तो कृपया इस साइट का उपयोग न करें।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">2. वेबसाइट का उपयोग</h2>
                    <p className="font-serif leading-relaxed">आप वेबसाइट का उपयोग केवल कानूनी उद्देश्यों के लिए करेंगे और किसी अन्य के अधिकारों का हनन नहीं करेंगे।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">3. बुकिंग, भुगतान और दान</h2>
                    <p className="font-serif leading-relaxed">वेबसाइट के माध्यम से की गई बुकिंग और दान उपलब्धता और उस समय दिखाई गई शर्तों के अधीन होते हैं। भुगतान तृतीय-पक्ष प्रदाताओं (जैसे Razorpay) द्वारा संसाधित किए जाते हैं।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">4. रद्दीकरण और रिफंड</h2>
                    <p className="font-serif leading-relaxed">रद्दीकरण और रिफंड नीतियाँ सेवा के अनुसार भिन्न हो सकती हैं। कृपया बुकिंग करते समय दी गई विशिष्ट शर्तें पढ़ें।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">5. बौद्धिक संपदा</h2>
                    <p className="font-serif leading-relaxed">इस वेबसाइट की सभी सामग्री सहित टेक्स्ट, छवियाँ, लोगो और डिज़ाइन श्री जीण माता मंदिर ट्रस्ट या इसके लाइसेंसधारकों की संपत्ति हैं। बिना अनुमति के सामग्री का पुनरुत्पादन व उपयोग उचित नहीं है।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">6. दायित्व की सीमा</h2>
                    <p className="font-serif leading-relaxed">कानून द्वारा अनुमत अधिकतम सीमा तक, श्री जीण माता मंदिर ट्रस्ट किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामस्वरूप हानि के लिए उत्तरदायी नहीं होगा जो आपकी वेबसाइट उपयोग से उत्पन्न हो।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">7. लागू कानून</h2>
                    <p className="font-serif leading-relaxed">ये नियम भारत के कानूनों के अनुरूप व्याख्यायित होंगे। किसी भी विवाद के लिए सीकर, राजस्थान के न्यायालयों का विशेष क्षेत्राधिकार होगा।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">8. नियमों में परिवर्तन</h2>
                    <p className="font-serif leading-relaxed">हम समय-समय पर इन नियमों और शर्तों को अपडेट कर सकते हैं। हम किसी भी महत्वपूर्ण परिवर्तन की सूचना इस पृष्ठ पर संशोधित "अंतिम अपडेट" तिथि के साथ देंगे।</p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold">9. हमसे संपर्क करें</h2>
                    <div className="font-serif leading-relaxed">
                      <p>यदि आपके पास इन नियमों व शर्तों के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:</p>
                      <div className="bg-muted p-6 rounded-lg space-y-1">
                        <p><strong>श्री जीण माता जी मंदिर</strong></p>
                        <p>सीकर, राजस्थान, भारत</p>
                        <p>ईमेल: sjmmtrust@gmail.com</p>
                        <p>फोन: 01576-227346</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
