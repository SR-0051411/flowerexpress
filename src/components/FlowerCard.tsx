import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FlowerCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: (id: string) => void;
  tiedLength?: number;
  ballQuantity?: number;
}

const FlowerCard = ({
  id,
  name,
  price,
  image,
  description,
  onAddToCart,
  tiedLength,
  ballQuantity,
}: FlowerCardProps) => {
  const { t } = useLanguage();

  // Only show dual language for specs.
  // Tamil large, English small.
  
  const getBallSpec = (qty: number | undefined) => {
    if (!qty) return null;
    return (
      <div className="mb-2">
        <div className="text-pink-700 text-lg font-bold leading-tight">
          🌸 {qty} பந்து
        </div>
        <div className="text-xs text-pink-700">
          {qty} flower ball{qty > 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  const getTiedLengthSpec = (len: number | undefined) => {
    if (!len) return null;
    return (
      <div>
        <div className="text-pink-700 text-lg font-bold leading-tight">
          📏 {len} மோலம்
        </div>
        <div className="text-xs text-pink-700">
          {len}ft tied length
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-2 border-pink-100">
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <span className="text-6xl">{image}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-8 overflow-hidden">
          {description}
        </p>

        {(tiedLength || ballQuantity) && (
          <div className="mb-3 p-2 bg-pink-50 rounded-md text-xs space-y-2">
            {getBallSpec(ballQuantity)}
            {getTiedLengthSpec(tiedLength)}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-pink-600">₹{price}</span>
          <Button
            onClick={() => onAddToCart(id)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            {/* Always in English for "Add" */}
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlowerCard;
