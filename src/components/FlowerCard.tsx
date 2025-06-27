
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FlowerCardProps {
  id: string;
  nameTa: string;
  nameEn: string;
  price: number;
  image: string;
  descTa: string;
  descEn: string;
  onAddToCart: (id: string) => void;
  tiedLength?: number;
  ballQuantity?: number;
  imageFileUrl?: string;
  additionalImages?: { file?: File | null; url?: string }[];
}

const getBallSpec = (qty: number | undefined) => {
  if (!qty) return null;
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="text-pink-700 text-lg font-bold leading-tight flex items-center gap-2">
        🌸
        <span>
          {qty} பந்து ({qty} ball{qty > 1 ? "s" : ""})
        </span>
      </div>
    </div>
  );
};

const getTiedLengthSpec = (len: number | undefined) => {
  if (!len) return null;
  return (
    <div className="flex items-center gap-2">
      <div className="text-pink-700 text-lg font-bold leading-tight flex items-center gap-2">
        📏
        <span>
          {len} முழம் ({len}ft tied length)
        </span>
      </div>
    </div>
  );
};

const FlowerCard = ({
  id,
  nameTa,
  nameEn,
  price,
  image,
  descTa,
  descEn,
  onAddToCart,
  tiedLength,
  ballQuantity,
  imageFileUrl,
  additionalImages = [],
}: FlowerCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine main image and additional images
  const allImages = [
    imageFileUrl || image,
    ...(additionalImages?.filter(img => img.url).map(img => img.url) || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const showImageNavigation = allImages.length > 1;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-2 border-pink-100">
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center relative">
        {allImages[currentImageIndex]?.startsWith('http') || allImages[currentImageIndex]?.startsWith('blob:') ? (
          <img 
            src={allImages[currentImageIndex]} 
            alt={nameTa} 
            className="object-cover w-full h-full" 
          />
        ) : (
          <span className="text-6xl">{allImages[currentImageIndex]}</span>
        )}
        
        {/* Image Navigation */}
        {showImageNavigation && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-1 shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-1 shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-pink-500' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 flex flex-col gap-0.5">
          <div className="text-xl font-bold text-pink-800 flex items-center gap-2">
            <span>{nameTa}</span>
            <span className="text-pink-700">({nameEn})</span>
          </div>
        </div>
        <div className="mb-2 h-10 flex items-center gap-2">
          <div className="text-sm text-gray-800">{descTa}</div>
          <div className="text-gray-500 text-sm">({descEn})</div>
        </div>

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
            <span>
              சேர் <span className="text-xs font-normal opacity-80">Add</span>
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlowerCard;
