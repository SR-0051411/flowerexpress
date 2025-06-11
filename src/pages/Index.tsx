
import { useState } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import FlowerCard from "@/components/FlowerCard";
import Cart from "@/components/Cart";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Flower {
  id: string;
  nameKey: string;
  price: number;
  image: string;
  descKey: string;
  category: string;
}

const IndexContent = () => {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample flower data with translation keys
  const flowers: Flower[] = [
    {
      id: "1",
      nameKey: "redRoses",
      price: 299,
      image: "🌹",
      descKey: "redRosesDesc",
      category: "roses"
    },
    {
      id: "2",
      nameKey: "sunflowers",
      price: 199,
      image: "🌻",
      descKey: "sunflowersDesc",
      category: "sunflowers"
    },
    {
      id: "3",
      nameKey: "whiteLilies",
      price: 249,
      image: "🌺",
      descKey: "whiteLiliesDesc",
      category: "lilies"
    },
    {
      id: "4",
      nameKey: "pinkTulips",
      price: 279,
      image: "🌷",
      descKey: "pinkTulipsDesc",
      category: "tulips"
    },
    {
      id: "5",
      nameKey: "yellowMarigolds",
      price: 149,
      image: "🌼",
      descKey: "yellowMarigoldsDesc",
      category: "marigolds"
    },
    {
      id: "6",
      nameKey: "purpleOrchids",
      price: 399,
      image: "🌸",
      descKey: "purpleOrchidsDesc",
      category: "orchids"
    }
  ];

  const categories = [
    { id: "all", titleKey: "allFlowers", image: "🌺" },
    { id: "roses", titleKey: "roses", image: "🌹" },
    { id: "sunflowers", titleKey: "sunflowers", image: "🌻" },
    { id: "lilies", titleKey: "lilies", image: "🌺" },
    { id: "tulips", titleKey: "tulips", image: "🌷" },
    { id: "marigolds", titleKey: "marigolds", image: "🌼" },
    { id: "orchids", titleKey: "orchids", image: "🌸" }
  ];

  const filteredFlowers = flowers.filter(flower => {
    const flowerName = t(flower.nameKey);
    const matchesSearch = flowerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || flower.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (flowerId: string) => {
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

    const flowerName = t(flower.nameKey);

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === flowerId);
      if (existingItem) {
        return prev.map(item =>
          item.id === flowerId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: flower.id,
        name: flowerName,
        price: flower.price,
        quantity: 1,
        image: flower.image
      }];
    });

    toast({
      title: t('addedToCart'),
      description: `${flowerName} ${t('addedToCartDesc')}`,
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    toast({
      title: t('orderPlaced'),
      description: t('orderPlacedDesc'),
    });
    setCartItems([]);
    setIsCartOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            {t('heroTitle')}
            <span className="text-pink-500"> {t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('heroSubtitle')}
          </p>
          <div className="text-6xl mb-8">🌸🌹🌺🌻🌷</div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('shopByCategory')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                title={t(category.titleKey)}
                image={category.image}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Flowers Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {selectedCategory === "all" ? t('allFlowers') : t(categories.find(c => c.id === selectedCategory)?.titleKey || 'allFlowers')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFlowers.map(flower => (
              <FlowerCard
                key={flower.id}
                id={flower.id}
                name={t(flower.nameKey)}
                price={flower.price}
                image={flower.image}
                description={t(flower.descKey)}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('whyChoose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">{t('fastDelivery')}</h3>
              <p className="text-gray-600">{t('fastDeliveryDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">{t('alwaysFresh')}</h3>
              <p className="text-gray-600">{t('alwaysFreshDesc')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">{t('perfectGifts')}</h3>
              <p className="text-gray-600">{t('perfectGiftsDesc')}</p>
            </div>
          </div>
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

export default Index;
