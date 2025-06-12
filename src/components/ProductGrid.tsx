
import FlowerCard from "@/components/FlowerCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flower } from "@/data/flowersData";
import { categories } from "@/data/flowersData";

interface ProductGridProps {
  flowers: Flower[];
  searchTerm: string;
  selectedCategory: string;
  onAddToCart: (flowerId: string) => void;
}

const ProductGrid = ({ flowers, searchTerm, selectedCategory, onAddToCart }: ProductGridProps) => {
  const { t } = useLanguage();

  const filteredFlowers = flowers.filter(flower => {
    const flowerName = flower.isCustom ? flower.customName || '' : t(flower.nameKey);
    const matchesSearch = flowerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || flower.category === selectedCategory;
    const isAvailable = flower.available !== false;
    return matchesSearch && matchesCategory && isAvailable;
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {selectedCategory === "all" ? t('allFlowers') : t(categories.find(c => c.id === selectedCategory)?.titleKey || 'allFlowers')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFlowers.map(flower => (
          <FlowerCard
            key={flower.id}
            id={flower.id}
            name={flower.isCustom ? flower.customName || 'Unknown Product' : t(flower.nameKey)}
            price={flower.price}
            image={flower.image}
            description={flower.isCustom ? flower.customDesc || '' : t(flower.descKey)}
            onAddToCart={onAddToCart}
            tiedLength={flower.tiedLength}
            ballQuantity={flower.ballQuantity}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
