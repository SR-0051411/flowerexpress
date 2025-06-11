
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FlowerCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: (id: string) => void;
}

const FlowerCard = ({ id, name, price, image, description, onAddToCart }: FlowerCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-2 border-pink-100">
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <span className="text-6xl">{image}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-pink-600">₹{price}</span>
          <Button 
            onClick={() => onAddToCart(id)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlowerCard;
