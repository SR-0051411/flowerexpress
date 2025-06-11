
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

const CategoryCard = ({ title, image, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-2 border-pink-100"
      onClick={onClick}
    >
      <div className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-4xl">
          {image}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
    </Card>
  );
};

export default CategoryCard;
