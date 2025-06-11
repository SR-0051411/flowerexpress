
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-sm"
      >
        EN
      </Button>
      <Button
        variant={language === 'ta' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ta')}
        className="text-sm"
      >
        தமிழ்
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
