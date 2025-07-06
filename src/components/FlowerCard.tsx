
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Combine main image and additional images, filtering out empty URLs
  const allImages = [
    imageFileUrl || image,
    ...(additionalImages?.filter(img => img.url && img.url.trim() !== '').map(img => img.url) || [])
  ].filter(Boolean); // Remove any undefined/null/empty values

  const showCarousel = allImages.length > 1;

  const onApiChange = useCallback((api: CarouselApi) => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, []);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-2 border-pink-100">
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center relative group">
        {showCarousel ? (
          <div className="relative w-full h-full">
            <Carousel 
              className="w-full h-full" 
              opts={{ loop: true, align: "start" }}
              setApi={onApiChange}
            >
              <CarouselContent>
                {allImages.map((imgSrc, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-full flex items-center justify-center">
                      {imgSrc?.startsWith('http') || imgSrc?.startsWith('blob:') ? (
                        <img 
                          src={imgSrc} 
                          alt={`${nameTa} - Image ${index + 1}`} 
                          className="object-cover w-full h-full" 
                          onError={(e) => {
                            console.log(`Failed to load image: ${imgSrc}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-6xl">{imgSrc}</span>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Enhanced Navigation Buttons - Always visible on hover */}
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-pink-200 text-pink-600 hover:text-pink-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 h-10 w-10" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white border-pink-200 text-pink-600 hover:text-pink-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 h-10 w-10" />
              
              {/* Multiple Images Indicator */}
              <div className="absolute top-2 right-2 bg-pink-600/90 text-white text-xs px-2 py-1 rounded-full font-medium z-10 flex items-center gap-1">
                <span>📸</span>
                <span>{current}/{allImages.length}</span>
              </div>
              
              {/* Clickable Image Counter Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 hover:scale-110 ${
                      index === current - 1
                        ? 'bg-pink-500 border-pink-500 shadow-md'
                        : 'bg-white/70 border-pink-300 hover:bg-white hover:border-pink-400'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        ) : (
          // Single image display
          <>
            {allImages[0]?.startsWith('http') || allImages[0]?.startsWith('blob:') ? (
              <img 
                src={allImages[0]} 
                alt={nameTa} 
                className="object-cover w-full h-full" 
                onError={(e) => {
                  console.log(`Failed to load single image: ${allImages[0]}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-6xl">{allImages[0] || image}</span>
            )}
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
