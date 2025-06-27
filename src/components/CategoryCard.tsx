
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  categoryId: string;
}

const CategoryCard = ({ title, image, categoryId }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const routeMap = {
      'all': '/all-flowers',
      'spare': '/spare-flowers', 
      'tied': '/tied-flowers',
      'garland': '/flower-garlands',
      'seasonal': '/seasonal-flowers'
    };
    
    const route = routeMap[categoryId as keyof typeof routeMap];
    if (route) {
      navigate(route);
    }
  };

  const getSpecialStyling = () => {
    if (categoryId === 'seasonal') {
      return "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100";
    }
    return "border-pink-100 bg-white hover:bg-pink-50";
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 ${getSpecialStyling()}`}
      onClick={handleClick}
    >
      <div className="p-6 text-center">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${
          categoryId === 'seasonal' 
            ? 'bg-gradient-to-r from-orange-100 to-yellow-100' 
            : 'bg-gradient-to-r from-pink-100 to-rose-100'
        }`}>
          {image}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {categoryId === 'seasonal' && (
          <div className="mt-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            சீசன் அடிப்படையில் (Season Based)
          </div>
        )}
      </div>
    </Card>
  );
};

export default CategoryCard;
