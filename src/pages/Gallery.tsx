import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, PlayCircle, Video } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import api, { GalleryItem } from "@/services/api";

const mediaBasePath = "/images";

const getMediaPath = (file: string) => encodeURI(`${mediaBasePath}/${file}`);

const customTitles: Record<string, string> = {
  "Jeenmata Documentry.mp4": "Jeen Mata Documentary",
  "video1.mp4": "Temple Highlights Video",
  "video2.mp4": "Temple Highlights Video2",
  "8a457bb6.mp4": "Events",
  "home-video.jpg": "Temple Video Cover",
  "Home-Icon.png": "Temple Home Icon",
  "jeen mata logo.png": "Jeen Mata Logo",
  "logo.png": "Trust Logo",
  "facebook.png": "Facebook Icon",
  "instagram.png": "Instagram Icon",
  "twitter.png": "Twitter Icon",
  "youtube.png": "YouTube Icon",
  "wheelchair.png": "Wheelchair Friendly",
  "placeholder.jpg": "Scenic Placeholder",
  "placeholder.svg": "Sacred Symbol",
};

const formatTitle = (file: string) => {
  if (customTitles[file]) {
    return customTitles[file];
  }

  const cleaned = file
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Temple Memory";

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
};

const deriveCategory = (file: string) => {
  const lower = file.toLowerCase();

  if (/\b(maa|mata|devi|idol)\b/.test(lower)) return "Deity";
  if (/\b(mela|festival|rang|bhandara|decoration|aarti)\b/.test(lower)) return "Festivals";
  if (/\b(video|mandir|temple|dham|gate|shikhar|infra|parking|slider|home|rang)\b/.test(lower))
    return "Temple";
  if (/\b(logo|icon|facebook|instagram|twitter|youtube|swastic|placeholder|wheelchair|clipart)\b/.test(lower))
    return "Symbols";

  return "Memories";
};

const imageFiles = [
  "1570628685gal_5.jpg",
  "1570628724001.jpg",
  
  "1570628747gal_1.jpg",
  
  "1571031510j7.jpg",
  "1571206416gal_3.jpg",
  "1613193401download.jpeg",
  "1621262705MelaPic.jpg",
  "1621264997dharamshala.jpg",
  "1621265160decoration.jpeg",
  "1621265219Maa_pic3.jpeg",
  "1621265280MaaJeenDham.png",
  "1621265347Present_parking_Place.png",
  "16225442011.jpeg",
  "16225442302.jpeg",
  
  "16225443295.jpg",
  "about-mataji -image.jpeg",
  "home.jpeg",
  "jeenmata.jpg",
  "mandir front gate.jpg",
  "mandir outer.jpeg",
  
  "slider2.jpeg",
  "slider3.jpeg",
  "1df1b9a4.jpg",
  "4f280fc5.jpg",
  "54fb9853.jpg",
  "903aad5e.jpg",
  "9345968c.jpg",
  "a24160cb.jpg",
  "c0a3f571.jpg"
] as const;

const imageGallery = imageFiles.map((file) => ({
  src: getMediaPath(file),
  title: formatTitle(file),
  category: deriveCategory(file),
}));

const videoItems = [
  {
    src: getMediaPath("Jeenmata Documentry.mp4"),
    title: {
      en: "Jeen Mata Documentary",
      hi: "जीण माता डॉक्यूमेंट्री",
    },
    description: {
      en: "A heartfelt short film capturing the spiritual aura of the dham.",
      hi: "धाम की आध्यात्मिक आभा को दर्शाती एक भावपूर्ण लघु फिल्म।",
    },
    duration: "04:52",
    poster: getMediaPath("home-video.jpg"),
  },
  {
    src: getMediaPath("video1.mp4"),
    title: {
      en: "Temple Highlights",
      hi: "मंदिर की झलकियां",
    },
    description: {
      en: "Quick glimpses from festivities, darshan, and temple life.",
      hi: "त्योहारों, दर्शन और मंदिर जीवन की झलकियां।",
    },
    duration: "02:18",
    poster: getMediaPath("home.jpeg"),
  },
  {
    src: getMediaPath("video2.mp4"),
    title: {
      en: "Temple Highlights",
      hi: "मंदिर की झलकियां",
    },
    description: {
      en: "Quick glimpses from festivities, darshan, and temple life.",
      hi: "त्योहारों, दर्शन और मंदिर जीवन की झलकियां।",
    },
    duration: "02:18",
    poster: getMediaPath("home.jpeg"),
  },
  {
    src: getMediaPath("8a457bb6.mp4"),
    title: {
      en: "Events",
      hi: "इवेंट्स",
    },
    description: {
      en: "Quick glimpses from festivities, darshan, and temple life.",
      hi: "त्योहारों, दर्शन और मंदिर जीवन की झलकियां।",
    },
    duration: "00:27",
    poster: getMediaPath("8a457bb6.mp4"),
  },
  {
    src: getMediaPath("872f89b8.mp4"),
    title: {
      en: "Events",
      hi: "इवेंट्स",
    },
    description: {
      en: "Quick glimpses from festivities, darshan, and temple life.",
      hi: "त्योहारों, दर्शन और मंदिर जीवन की झलकियां।",
    },
    duration: "00:17",
    poster: getMediaPath("872f89b8.mp4"),
  },
];

const categoryLabels: Record<"en" | "hi", Record<string, string>> = {
  en: {
    Deity: "Deity",
    Festivals: "Festivals",
    Temple: "Temple",
    Symbols: "Symbols",
    Memories: "Memories",
  },
  hi: {
    Deity: "देवी स्वरूप",
    Festivals: "उत्सव",
    Temple: "मंदिर",
    Symbols: "प्रतीक",
    Memories: "स्मृतियां",
  },
};

const Gallery = () => {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [backendGallery, setBackendGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchGalleryFromBackend();
  }, []);

  const fetchGalleryFromBackend = async () => {
    try {
      setIsLoading(true);
      const response = await api.gallery.getAll();
      if (response.success && response.photos) {
        setBackendGallery(response.photos);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate images and videos from backend
  const backendImages = backendGallery.filter(item => item.mediaType === 'image');
  const backendVideos = backendGallery.filter(item => item.mediaType === 'video');

  // Combine static images with backend images
  const allImages = [
    ...imageGallery,
    ...backendImages.map(item => ({
      src: item.imageUrl,
      title: item.caption,
      category: item.category === 'Festival' ? 'Festivals' : 
                item.category === 'Aarti' ? 'Temple' :
                item.category === 'Projects' ? 'Temple' :
                item.category
    }))
  ];

  // Combine static videos with backend videos
  const allVideos = [
    ...videoItems,
    ...backendVideos.map(item => ({
      src: item.imageUrl,
      title: {
        en: item.caption,
        hi: item.caption
      },
      description: {
        en: `${item.category} video`,
        hi: `${item.category} वीडियो`
      },
      duration: "00:00",
      poster: item.imageUrl
    }))
  ];

  // Handle video play - pause all other videos
  const handleVideoPlay = (currentIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex && !video.paused) {
        video.pause();
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-decorative text-4xl md:text-5xl font-bold mb-4">
              {isEnglish ? "Temple Gallery" : "मंदिर गैलरी"}
            </h1>
            <p className="font-serif text-xl max-w-3xl mx-auto">
              {isEnglish
                ? "Explore the divine beauty and sacred moments of Shree Jeen Mata Temple"
                : "श्री जीण माता मंदिर की दिव्य सुंदरता और पावन पलों का अनुभव करें"}
            </p>
          </div>
        </section>

        {/* Gallery Tabs */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="font-serif text-lg text-muted-foreground">
                {isEnglish
                  ? "Choose between mesmerizing photos and immersive videos to relive every sacred moment from Shree Jeen Mata Dham."
                  : "श्री जीण माता धाम के हर पवित्र पल को फिर से जीने के लिए मनमोहक तस्वीरें और वीडियो चुनें।"}
              </p>
            </div>

            <Tabs defaultValue="images" className="space-y-10">
              <TabsList className="grid grid-cols-2 max-w-xl mx-auto bg-primary/10">
                <TabsTrigger value="images" className="flex items-center gap-2 font-serif">
                  <ImageIcon className="w-4 h-4" />
                  {isEnglish ? "Images" : "चित्र"}
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2 font-serif">
                  <Video className="w-4 h-4" />
                  {isEnglish ? "Videos" : "वीडियो"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="images">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-lg text-muted-foreground">
                      {isEnglish ? "Loading gallery..." : "गैलरी लोड हो रही है..."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {allImages.map((item, index) => (
                      <div
                        key={item.src + index}
                        className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                        {/* <div className="p-4 flex flex-col gap-1">
                          <p className="font-decorative text-lg text-primary">{item.title}</p>
                          <p className="text-sm font-serif text-muted-foreground">
                            {categoryLabels[language][item.category] ?? item.category}
                          </p>
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos">
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="font-serif text-lg text-muted-foreground">
                      {isEnglish ? "Loading videos..." : "वीडियो लोड हो रहे हैं..."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-8 lg:grid-cols-2">
                    {allVideos.map((video, index) => (
                      <div
                        key={video.src + index}
                        className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
                      >
                        <div className="relative aspect-video bg-black">
                          <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            controls
                            poster={video.poster}
                            className="h-full w-full object-cover"
                            onPlay={() => handleVideoPlay(index)}
                          >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          {video.duration && video.duration !== "00:00" && (
                            <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                              <PlayCircle className="h-4 w-4" />
                              {video.duration}
                            </div>
                          )}
                        </div>
                        {/* <div className="p-6 space-y-2">
                          { <p className="font-decorative text-2xl text-primary">
                            {video.title[language as "en" | "hi"]}
                          </p> }
                          { <p className="font-serif text-sm text-muted-foreground">
                            {video.description[language as "en" | "hi"]}
                          </p> }
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
