
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
  garland: { ta: "பூ மாலை", en: "Flower Garland (Maalai)" },
  seasonal: { ta: "பருவகால பூக்கள்", en: "Seasonal Flowers" }
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
            {selectedCategory === "seasonal" ? "SEASONAL" : "FRESH"}
          </span>
          {cat.ta}
        </div>
        <div className="text-base text-gray-500">{cat.en}</div>
        {selectedCategory === "seasonal" && (
          <div className="text-sm text-orange-600 mt-2 bg-orange-50 p-2 rounded-lg inline-block">
            🌸 பருவகால பூக்கள் - சீசன் அடிப்படையில் மட்டுமே கிடைக்கும் (Available only in specific seasons)
          </div>
        )}
      </div>
    );
  };

  const renderNoResults = () => {
    if (filteredFlowers.length > 0) return null;
    
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-xl font-bold text-gray-700 mb-2">
          மன்னிக்கவும், தேடிய பூ கிடைக்கவில்லை
        </div>
        <div className="text-gray-500 mb-4">
          Sorry, the flower you searched for is not available
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <span className="bg-green-100 px-2 py-1 rounded font-bold text-sm">
              {selectedCategory === "seasonal" ? "SEASONAL" : "FRESH"}
            </span>
            <span className="text-sm">
              {selectedCategory === "seasonal" 
                ? "பருவகால பூக்கள் மட்டுமே - Only Seasonal Flowers Available" 
                : "புதிய பூக்கள் மட்டுமே - Only Fresh Flowers Available"
              }
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-12">
      {renderCategoryTitle()}
      {renderNoResults()}
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
            additionalImages={flower.additionalImages}
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
