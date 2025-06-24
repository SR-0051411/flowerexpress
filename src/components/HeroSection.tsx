
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        {t('heroTitle')}
        <span className="text-pink-500"> {t('heroTitleHighlight')}</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        {t('heroSubtitle')}
      </p>
      <div className="text-6xl mb-8">🌼🌸🌺🌻🌷🌿🍃🌱🌹</div>
    </div>
  );
};

export default HeroSection;
