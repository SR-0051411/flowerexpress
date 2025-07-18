
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App Identity
    appName: 'FlowerExpressCo',
    tagline: 'Fresh Flowers for Tomorrow',
    
    // Hero Section
    heroTitle: 'Fresh Flowers',
    heroTitleHighlight: 'Delivered Tomorrow',
    heroSubtitle: 'Order today, Get the fresh flowers delivered to your door-step by tomorrow - First-Ever Fresh Flower Delivery Service',
    
    // Categories
    shopByCategory: 'Shop by Category',
    allFlowers: 'All Flowers',
    spareFlowers: 'Spare Flowers (Loose)',
    tiedFlower: 'Tied Flower',
    flowerGarland: 'Flower Garland (Maalai)',
    
    // Cart & Actions
    cart: 'Cart',
    addToCart: 'Add to Cart',
    
    // Features
    whyChoose: 'Why Choose FlowerExpressCo?',
    nextDayDelivery: 'Next Day Delivery',
    nextDayDeliveryDesc: 'Order today and receive fresh flowers tomorrow - guaranteed freshness',
    alwaysFresh: 'Always Fresh',
    alwaysFreshDesc: 'Premium quality fresh flowers sourced directly from gardens',
    perfectGifts: 'Perfect for All Occasions',
    perfectGiftsDesc: 'Fresh flowers for prayers, celebrations, and special moments',
    
    // Feedback
    giveFeedback: 'Share Feedback',
    feedbackTitle: 'How was your experience?',
    feedbackDesc: 'Help us improve our fresh flower delivery service',
  },
  ta: {
    // App Identity  
    appName: 'FlowerExpressCo',
    tagline: 'நாளை புதிய பூக்கள்',
    
    // Hero Section
    heroTitle: 'புதிய பூக்கள்',
    heroTitleHighlight: 'நாளை டெலிவரி',
    heroSubtitle: 'இன்று ஆர்டர் செய்யுங்கள், நாளை புதிய பூக்களைப் பெறுங்கள் - முதல் புதிய பூ டெலிவரி சேவை',
    
    // Categories
    shopByCategory: 'வகை அடிப்படையில் கடை',
    allFlowers: 'அனைத்து பூக்கள்',
    spareFlowers: 'தனித்த பூக்கள்',
    tiedFlower: 'கட்டிய பூ',
    flowerGarland: 'பூ மாலை',
    
    // Cart & Actions
    cart: 'கார்ட்',
    addToCart: 'கார்ட்டில் சேர்',
    
    // Features
    whyChoose: 'FlowerExpressCo ஏன் தேர்வு செய்ய வேண்டும்?',
    nextDayDelivery: 'அடுத்த நாள் டெலிவரி',
    nextDayDeliveryDesc: 'இன்று ஆர்டர் செய்து நாளை புதிய பூக்களைப் பெறுங்கள் - உத்தரவாதமான புதுமை',
    alwaysFresh: 'எப்போதும் புதிய',
    alwaysFreshDesc: 'தோட்டங்களில் இருந்து நேரடியாக பெறப்பட்ட மிகச்சிறந்த தரமான புதிய பூக்கள்',
    perfectGifts: 'அனைத்து சந்தர்ப்பங்களுக்கும் சரியானது',
    perfectGiftsDesc: 'பிரார்த்தனைகள், கொண்டாட்டங்கள் மற்றும் சிறப்பு தருணங்களுக்கான புதிய பூக்கள்',
    
    // Feedback
    giveFeedback: 'கருத்து தெரிவிக்க',
    feedbackTitle: 'உங்கள் அனுபவம் எப்படி இருந்தது?',
    feedbackDesc: 'எங்கள் புதிய பூ டெலிவரி சேவையை மேம்படுத்த உதவுங்கள்',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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
