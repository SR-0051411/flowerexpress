
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('whyChoose')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2 text-green-600">{t('nextDayDelivery')}</h3>
          <p className="text-gray-600">{t('nextDayDeliveryDesc')}</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold mb-2 text-green-600">
            <span className="bg-green-100 px-2 py-1 rounded font-bold">FRESH</span> {t('alwaysFresh')}
          </h3>
          <p className="text-gray-600">{t('alwaysFreshDesc')}</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-xl font-semibold mb-2">{t('perfectGifts')}</h3>
          <p className="text-gray-600">{t('perfectGiftsDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
