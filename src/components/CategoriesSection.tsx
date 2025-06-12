
import CategoryCard from "@/components/CategoryCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/data/flowersData";

interface CategoriesSectionProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoriesSection = ({ selectedCategory, onCategorySelect }: CategoriesSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('shopByCategory')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            title={t(category.titleKey)}
            image={category.image}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
