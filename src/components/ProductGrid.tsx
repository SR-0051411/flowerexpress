
import FlowerCard from "@/components/FlowerCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flower } from "@/data/flowersData";

interface ProductGridProps {
  flowers: Flower[];
  searchTerm: string;
  selectedCategory: string;
  onAddToCart: (flowerId: string) => void;
}

const categoryTranslation = {
  all: { ta: "அனைத்து பூக்கள்", en: "All Flowers" },
  spare: { ta: "தனித்த பூக்கள்", en: "Spare Flowers (Loose)" },
  tied: { ta: "கட்டிய பூ", en: "Tied Flower" },
  garland: { ta: "பூ மாலை", en: "Flower Garland (Maalai)" }
};

const ProductGrid = ({ flowers, searchTerm, selectedCategory, onAddToCart }: ProductGridProps) => {
  const filteredFlowers = flowers.filter(flower => {
    const mainName = flower.customName || flower.nameKey || "";
    const matchesSearch = mainName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || flower.category === selectedCategory;
    const isAvailable = flower.available !== false;
    return matchesSearch && matchesCategory && isAvailable;
  });

  const renderCategoryTitle = () => {
    const cat = categoryTranslation[selectedCategory as keyof typeof categoryTranslation] || 
                { ta: "", en: "" };

    return (
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-pink-700 flex items-center justify-center gap-2">
          <span className="bg-green-100 px-3 py-1 rounded-full text-green-800 text-lg font-bold">
            FRESH
          </span>
          {cat.ta}
        </div>
        <div className="text-base text-gray-500">{cat.en}</div>
      </div>
    );
  };

  return (
    <div className="mb-12">
      {renderCategoryTitle()}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFlowers.map(flower => (
          <FlowerCard
            key={flower.id}
            id={flower.id}
            nameTa={flower.customName?.split('(')[0]?.trim() || flower.nameKey}
            nameEn={flower.customName?.match(/\((.*?)\)/)?.[1] || flower.nameKey}
            price={flower.price}
            image={flower.image}
            imageFileUrl={flower.imageFileUrl}
            descTa={flower.customDesc?.split(' - ')[0] || ""}
            descEn={flower.customDesc?.split(' - ')[1] || ""}
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
