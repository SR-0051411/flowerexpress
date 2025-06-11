import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    appName: 'FlowerExpress',
    tagline: 'Fresh flowers delivered fast',
    cart: 'Cart',
    
    // Hero section
    heroTitle: 'Fresh Flowers',
    heroTitleHighlight: 'Delivered Fast',
    heroSubtitle: 'Beautiful flowers delivered to your doorstep in minutes',
    
    // Search
    searchPlaceholder: 'Search flowers...',
    
    // Categories
    shopByCategory: 'Shop by Category',
    allFlowers: 'All Flowers',
    roses: 'Roses',
    sunflowers: 'Sunflowers',
    lilies: 'Lilies',
    tulips: 'Tulips',
    marigolds: 'Marigolds',
    orchids: 'Orchids',
    
    // Flowers
    redRoses: 'Red Roses',
    redRosesDesc: 'Beautiful red roses perfect for any occasion',
    sunflowersDesc: 'Bright and cheerful sunflowers',
    whiteLilies: 'White Lilies',
    whiteLiliesDesc: 'Elegant white lilies for special moments',
    pinkTulips: 'Pink Tulips',
    pinkTulipsDesc: 'Fresh pink tulips from Holland',
    yellowMarigolds: 'Yellow Marigolds',
    yellowMarigoldsDesc: 'Vibrant yellow marigolds',
    purpleOrchids: 'Purple Orchids',
    purpleOrchidsDesc: 'Exotic purple orchids',
    
    // Actions
    add: 'Add',
    
    // Cart
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    total: 'Total:',
    orderNow: 'Order Now',
    
    // Features
    whyChoose: 'Why Choose FlowerExpress?',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Fresh flowers delivered within 30 minutes',
    alwaysFresh: 'Always Fresh',
    alwaysFreshDesc: 'Directly sourced from local flower gardens',
    perfectGifts: 'Perfect for Gifts',
    perfectGiftsDesc: 'Beautiful arrangements for every occasion',
    
    // Toast messages
    addedToCart: 'Added to cart!',
    addedToCartDesc: 'has been added to your cart.',
    orderPlaced: 'Order placed!',
    orderPlacedDesc: 'Your flowers will be delivered within 30 minutes.',
    
    // Maala
    maala: "Flower Maala",
    pooja: "Pooja Items", 
    oils: "Oils",
    coconut: "Coconut Products",
    other: "Other Items",
  },
  ta: {
    // Header
    appName: 'பூவெக்ஸ்பிரஸ்',
    tagline: 'புதிய பூக்கள் வேகமாக டெலிவரி',
    cart: 'கார்ட்',
    
    // Hero section
    heroTitle: 'புதிய பூக்கள்',
    heroTitleHighlight: 'வேகமாக டெலிவரி',
    heroSubtitle: 'அழகான பூக்கள் சில நிமிடங்களில் உங்கள் வீட்டு வாசலில்',
    
    // Search
    searchPlaceholder: 'பூக்களை தேடுங்கள்...',
    
    // Categories
    shopByCategory: 'வகை அடிப்படையில் வாங்குங்கள்',
    allFlowers: 'அனைத்து பூக்கள்',
    roses: 'ரோஜாக்கள்',
    sunflowers: 'சூரியகாந்தி',
    lilies: 'லிலி',
    tulips: 'டுலிப்',
    marigolds: 'சாமந்தி',
    orchids: 'ஆர்க்கிட்',
    
    // Flowers
    redRoses: 'சிவப்பு ரோஜாக்கள்',
    redRosesDesc: 'எல்லா சந்தர்ப்பங்களுக்கும் ஏற்ற அழகான சிவப்பு ரோஜாக்கள்',
    sunflowersDesc: 'பிரகாசமான மற்றும் மகிழ்ச்சியான சூரியகாந்தி',
    whiteLilies: 'வெள்ளை லிலி',
    whiteLiliesDesc: 'சிறப்பு தருணங்களுக்கான நேர்த்தியான வெள்ளை லிலி',
    pinkTulips: 'இளஞ்சிவப்பு டுலிப்',
    pinkTulipsDesc: 'ஹாலந்தில் இருந்து புதிய இளஞ்சிவப்பு டுலிப்',
    yellowMarigolds: 'மஞ்சள் சாமந்தி',
    yellowMarigoldsDesc: 'உயிர்ப்பான மஞ்சள் சாமந்தி',
    purpleOrchids: 'ஊதா ஆர்க்கிட்',
    purpleOrchidsDesc: 'அரிய ஊதா ஆர்க்கிட்',
    
    // Actions
    add: 'சேர்',
    
    // Cart
    yourCart: 'உங்கள் கார்ட்',
    cartEmpty: 'உங்கள் கார்ட் காலியாக உள்ளது',
    total: 'மொத்தம்:',
    orderNow: 'இப்போது ஆர்டர் செய்யுங்கள்',
    
    // Features
    whyChoose: 'ஏன் பூவெக்ஸ்பிரஸ் தேர்வு செய்ய வேண்டும்?',
    fastDelivery: 'வேகமான டெலிவரி',
    fastDeliveryDesc: '30 நிமிடங்களில் புதிய பூக்கள் டெலிவரி',
    alwaysFresh: 'எப்போதும் புதிதாக',
    alwaysFreshDesc: 'உள்ளூர் பூந்தோட்டங்களில் இருந்து நேரடியாக பெறப்படுகிறது',
    perfectGifts: 'பரிசுகளுக்கு சரியானது',
    perfectGiftsDesc: 'எல்லா சந்தர்ப்பங்களுக்கும் அழகான அலங்காரங்கள்',
    
    // Toast messages
    addedToCart: 'கார்ட்டில் சேர்க்கப்பட்டது!',
    addedToCartDesc: 'உங்கள் கார்ட்டில் சேர்க்கப்பட்டது.',
    orderPlaced: 'ஆர்டர் செய்யப்பட்டது!',
    orderPlacedDesc: 'உங்கள் பூக்கள் 30 நிமிடங்களில் டெலிவரி செய்யப்படும்.',
    
    // Maala
    maala: "பூ மாலை",
    pooja: "பூஜை பொருட்கள்",
    oils: "எண்ணெய்கள்",
    coconut: "தேங்காய் பொருட்கள்",
    other: "மற்ற பொருட்கள்",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
