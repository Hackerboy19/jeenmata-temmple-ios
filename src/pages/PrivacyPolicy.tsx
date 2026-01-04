import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Privacy Policy" : "गोपनीयता नीति"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Your privacy is important to us"
                : "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है"}
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {isEnglish ? (
                <>
                  <div className="space-y-4">
                    <p className="font-serif text-muted-foreground text-sm">
                      Last Updated: December 5, 2025
                    </p>
                    <p className="font-serif text-lg leading-relaxed">
                      Shri Jeen Mata Temple Trust ("we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website shrijeenmata.org and use our services.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      1. Information We Collect
                    </h2>
                    <div className="space-y-3 font-serif text-foreground leading-relaxed">
                      <p className="font-semibold">Personal Information:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Name, email address, phone number</li>
                        <li>Aadhaar card details (for room bookings)</li>
                        <li>Payment information (processed securely through Razorpay)</li>
                        <li>Booking and donation details</li>
                      </ul>
                      <p className="font-semibold mt-4">Automatically Collected Information:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>IP address, browser type, and operating system</li>
                        <li>Pages visited and time spent on our website</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      2. How We Use Your Information
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>We use the collected information to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Process bookings for rooms, prasad, and aarti participation</li>
                        <li>Process donations and issue receipts</li>
                        <li>Send booking confirmations and updates via email/SMS</li>
                        <li>Improve our website and services</li>
                        <li>Communicate important temple announcements and events</li>
                        <li>Comply with legal obligations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      3. Information Sharing and Disclosure
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>We do not sell or rent your personal information. We may share your information with:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                        <li><strong>Service Providers:</strong> Third-party vendors who assist in website operations</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      4. Data Security
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      5. Cookies and Tracking Technologies
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      We use cookies to enhance your browsing experience, analyze website traffic, and remember your preferences. You can control cookie settings through your browser, but disabling cookies may affect website functionality.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      6. Third-Party Links
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      7. Your Rights
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>You have the right to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Access and update your personal information</li>
                        <li>Request deletion of your data (subject to legal obligations)</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Withdraw consent for data processing</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      8. Children's Privacy
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      9. Changes to This Privacy Policy
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated "Last Updated" date.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      10. Contact Us
                    </h2>
                    <div className="font-serif text-foreground leading-relaxed space-y-2">
                      <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
                  <div className="space-y-4">
                    <p className="font-serif text-muted-foreground text-sm">
                      अंतिम अपडेट: 5 दिसंबर, 2025
                    </p>
                    <p className="font-serif text-lg leading-relaxed">
                      श्री जीण माता मंदिर ("हम," "हमें," या "हमारा") आपकी गोपनीयता का सम्मान करता है और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट shrijeenmata.org पर जाते हैं और हमारी सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र, उपयोग, प्रकट और सुरक्षित करते हैं।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      1. हम कौन सी जानकारी एकत्र करते हैं
                    </h2>
                    <div className="space-y-3 font-serif text-foreground leading-relaxed">
                      <p className="font-semibold">व्यक्तिगत जानकारी:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>नाम, ईमेल पता, फोन नंबर</li>
                        <li>आधार कार्ड विवरण (कमरे की बुकिंग के लिए)</li>
                        <li>भुगतान जानकारी (Razorpay के माध्यम से सुरक्षित रूप से संसाधित)</li>
                        <li>बुकिंग और दान विवरण</li>
                      </ul>
                      <p className="font-semibold mt-4">स्वचालित रूप से एकत्रित जानकारी:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>आईपी पता, ब्राउज़र प्रकार और ऑपरेटिंग सिस्टम</li>
                        <li>देखे गए पृष्ठ और वेबसाइट पर बिताया गया समय</li>
                        <li>कुकीज़ और समान ट्रैकिंग तकनीकें</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      2. हम आपकी जानकारी का उपयोग कैसे करते हैं
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>हम एकत्रित जानकारी का उपयोग निम्नलिखित के लिए करते हैं:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>कमरे, प्रसाद और आरती भागीदारी की बुकिंग प्रोसेस करना</li>
                        <li>दान प्रोसेस करना और रसीद जारी करना</li>
                        <li>ईमेल/एसएमएस के माध्यम से बुकिंग पुष्टिकरण और अपडेट भेजना</li>
                        <li>हमारी वेबसाइट और सेवाओं में सुधार करना</li>
                        <li>महत्वपूर्ण मंदिर घोषणाओं और कार्यक्रमों का संचार करना</li>
                        <li>कानूनी दायित्वों का पालन करना</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      3. जानकारी साझाकरण और प्रकटीकरण
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>हम आपकी व्यक्तिगत जानकारी बेचते या किराए पर नहीं देते हैं। हम आपकी जानकारी निम्नलिखित के साथ साझा कर सकते हैं:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>भुगतान प्रोसेसर:</strong> सुरक्षित भुगतान प्रसंस्करण के लिए Razorpay</li>
                        <li><strong>सेवा प्रदाता:</strong> तृतीय-पक्ष विक्रेता जो वेबसाइट संचालन में सहायता करते हैं</li>
                        <li><strong>कानूनी आवश्यकताएं:</strong> जब कानून द्वारा आवश्यक हो या हमारे अधिकारों की रक्षा के लिए</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      4. डेटा सुरक्षा
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      हम अनधिकृत पहुंच, परिवर्तन, प्रकटीकरण या विनाश के खिलाफ आपकी व्यक्तिगत जानकारी की रक्षा के लिए उपयुक्त तकनीकी और संगठनात्मक सुरक्षा उपाय लागू करते हैं। हालांकि, इंटरनेट पर ट्रांसमिशन की कोई भी विधि 100% सुरक्षित नहीं है, और हम पूर्ण सुरक्षा की गारंटी नहीं दे सकते।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      5. कुकीज़ और ट्रैकिंग तकनीकें
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      हम आपके ब्राउज़िंग अनुभव को बढ़ाने, वेबसाइट ट्रैफ़िक का विश्लेषण करने और आपकी प्राथमिकताओं को याद रखने के लिए कुकीज़ का उपयोग करते हैं। आप अपने ब्राउज़र के माध्यम से कुकी सेटिंग्स को नियंत्रित कर सकते हैं, लेकिन कुकीज़ अक्षम करना वेबसाइट कार्यक्षमता को प्रभावित कर सकता है।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      6. तृतीय-पक्ष लिंक
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      हमारी वेबसाइट में तृतीय-पक्ष वेबसाइटों के लिंक हो सकते हैं। हम इन बाहरी साइटों की गोपनीयता प्रथाओं के लिए जिम्मेदार नहीं हैं। हम आपको उनकी गोपनीयता नीतियों की समीक्षा करने के लिए प्रोत्साहित करते हैं।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      7. आपके अधिकार
                    </h2>
                    <div className="space-y-2 font-serif text-foreground leading-relaxed">
                      <p>आपको निम्नलिखित का अधिकार है:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>अपनी व्यक्तिगत जानकारी तक पहुंच और अपडेट करना</li>
                        <li>अपने डेटा को हटाने का अनुरोध करना (कानूनी दायित्वों के अधीन)</li>
                        <li>मार्केटिंग संचार से बाहर निकलना</li>
                        <li>डेटा प्रोसेसिंग के लिए सहमति वापस लेना</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      8. बच्चों की गोपनीयता
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      हमारी सेवाएं 18 वर्ष से कम उम्र के व्यक्तियों के लिए निर्देशित नहीं हैं। हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते हैं। यदि आपको लगता है कि किसी बच्चे ने हमें व्यक्तिगत जानकारी प्रदान की है, तो कृपया तुरंत हमसे संपर्क करें।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      9. इस गोपनीयता नीति में परिवर्तन
                    </h2>
                    <p className="font-serif text-foreground leading-relaxed">
                      हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम अद्यतन "अंतिम अपडेट" तिथि के साथ इस पृष्ठ पर नई नीति पोस्ट करके किसी भी महत्वपूर्ण परिवर्तन के बारे में आपको सूचित करेंगे।
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-decorative text-2xl font-bold text-foreground">
                      10. हमसे संपर्क करें
                    </h2>
                    <div className="font-serif text-foreground leading-relaxed space-y-2">
                      <p>यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:</p>
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

export default PrivacyPolicy;
