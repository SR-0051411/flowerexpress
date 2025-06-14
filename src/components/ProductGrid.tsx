
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

const languageTranslation = {
  redRoses: { ta: "சிவப்பு ரோஜாக்கள்", en: "Red Roses" },
  sunflowers: { ta: "சூரியகாந்தி", en: "Sunflowers" },
  whiteLilies: { ta: "வெள்ளை லிலி", en: "White Lilies" },
  pinkTulips: { ta: "இளஞ்சிவப்பு டுலிப்", en: "Pink Tulips" },
  yellowMarigolds: { ta: "மஞ்சள் சாமந்தி", en: "Yellow Marigolds" },
  purpleOrchids: { ta: "ஊதா ஆர்க்கிட்", en: "Purple Orchids" },
};

const descTranslations = {
  redRosesDesc: { ta: "எல்லா சந்தர்ப்பங்களுக்கும் ஏற்ற அழகான சிவப்பு ரோஜாக்கள்", en: "Beautiful red roses perfect for any occasion" },
  sunflowersDesc: { ta: "பிரகாசமான மற்றும் மகிழ்ச்சியான சூரியகாந்தி", en: "Bright and cheerful sunflowers" },
  whiteLiliesDesc: { ta: "சிறப்பு தருணங்களுக்கான நேர்த்தியான வெள்ளை லிலி", en: "Elegant white lilies for special moments" },
  pinkTulipsDesc: { ta: "ஹாலந்தில் இருந்து புதிய இளஞ்சிவப்பு டுலிப்", en: "Fresh pink tulips from Holland" },
  yellowMarigoldsDesc: { ta: "உயிர்ப்பான மஞ்சள் சாமந்தி", en: "Vibrant yellow marigolds" },
  purpleOrchidsDesc: { ta: "அரிய ஊதா ஆர்க்கிட்", en: "Exotic purple orchids" },
};

const categoryTranslation = {
  all: { ta: "அனைத்து பூக்கள்", en: "All Flowers" },
  flowers: { ta: "பூக்கள்", en: "Flowers" },
  maala: { ta: "பூ மாலை", en: "Flower Maala" },
  pooja: { ta: "பூஜை பொருட்கள்", en: "Pooja Items" },
  oils: { ta: "எண்ணெய்கள்", en: "Oils" },
  coconut: { ta: "தேங்காய் பொருட்கள்", en: "Coconut Products" },
  other: { ta: "மற்ற பொருட்கள்", en: "Other Items" }
};

const ProductGrid = ({ flowers, searchTerm, selectedCategory, onAddToCart }: ProductGridProps) => {
  // No more t: always show Tamil (big) and English (small)
  const filteredFlowers = flowers.filter(flower => {
    let mainName = "";
    if (flower.isCustom) {
      mainName = flower.customName || '';
    } else {
      mainName = languageTranslation[flower.nameKey as keyof typeof languageTranslation]?.ta || "";
    }
    const matchesSearch = mainName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || flower.category === selectedCategory;
    const isAvailable = flower.available !== false;
    return matchesSearch && matchesCategory && isAvailable;
  });

  const renderCategoryTitle = () => {
    const cat = selectedCategory === "all"
      ? categoryTranslation["all"]
      : categoryTranslation[selectedCategory as keyof typeof categoryTranslation] ||
        { ta: "", en: "" };

    return (
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-pink-700">{cat.ta}</div>
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
            // Name: use Tamil large, English small under
            nameTa={flower.isCustom
              ? flower.customName || ''
              : languageTranslation[flower.nameKey as keyof typeof languageTranslation]?.ta || ''}
            nameEn={flower.isCustom
              ? flower.customName || 'Unknown'
              : languageTranslation[flower.nameKey as keyof typeof languageTranslation]?.en || ''}
            price={flower.price}
            image={flower.image}
            // Description: use Tamil large, English small under
            descTa={flower.isCustom
              ? flower.customDesc || ''
              : descTranslations[flower.descKey as keyof typeof descTranslations]?.ta || ''}
            descEn={flower.isCustom
              ? flower.customDesc || ''
              : descTranslations[flower.descKey as keyof typeof descTranslations]?.en || ''}
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
