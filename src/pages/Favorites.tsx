import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useFlowers } from "@/contexts/FlowersContext";
import { useFavorites } from "@/hooks/useFavorites";
import FlowerCard from "@/components/FlowerCard";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flowers } = useFlowers();
  const { favoriteFlowerIds, loading, toggleFavorite } = useFavorites();

  // We'll need to pass a handler from parent - for now just log
  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const favoriteFlowers = flowers.filter((flower) =>
    favoriteFlowerIds.includes(flower.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
              <h1 className="text-2xl font-bold text-pink-800">
                விருப்பங்கள் (Favorites)
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favoriteFlowers.length === 0 ? (
          <Card className="p-12 text-center bg-white border-2 border-pink-100">
            <Heart className="h-16 w-16 text-pink-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-pink-800 mb-2">
              விருப்பங்கள் இல்லை (No Favorites Yet)
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding flowers you love to your favorites list!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Flowers
            </Button>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {favoriteFlowers.length} item{favoriteFlowers.length > 1 ? "s" : ""} in your favorites
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteFlowers.map((flower) => {
                const flowerName = flower.isCustom
                  ? flower.customName || "Unknown"
                  : flower.nameKey;
                const flowerDesc = flower.isCustom
                  ? flower.customDesc || ""
                  : flower.descKey;

                return (
                  <div key={flower.id} className="relative">
                    <FlowerCard
                      id={flower.id}
                      nameTa={flowerName.split("(")[0]?.trim() || flowerName}
                      nameEn={
                        flowerName.match(/\(([^)]+)\)/)?.[1] || flowerName
                      }
                      price={flower.price}
                      image={flower.image}
                      descTa={flowerDesc.split("-")[0]?.trim() || flowerDesc}
                      descEn={flowerDesc.split("-")[1]?.trim() || ""}
                      onAddToCart={handleAddToCart}
                      tiedLength={flower.tiedLength}
                      ballQuantity={flower.ballQuantity}
                      imageFileUrl={flower.imageFileUrl}
                      additionalImages={flower.additionalImages}
                      isFavorite={true}
                      onToggleFavorite={() =>
                        toggleFavorite(flower.id, flowerName)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
