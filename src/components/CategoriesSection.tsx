
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/flowersData";

const categoryTitles = {
  all: "அனைத்து பூக்கள் (All Flowers)",
  spare: "தனித்த பூக்கள் (Spare Flowers)",
  tied: "கட்டிய பூ (Tied Flowers)", 
  garland: "பூ மாலை (Flower Garlands)"
};

const CategoriesSection = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        பூ வகைகள் அடிப்படையில் கடை (Shop by Category)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            title={categoryTitles[category.id as keyof typeof categoryTitles]}
            image={category.image}
            categoryId={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
