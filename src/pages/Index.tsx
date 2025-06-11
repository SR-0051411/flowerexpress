
import { useState } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import FlowerCard from "@/components/FlowerCard";
import Cart from "@/components/Cart";
import SearchBar from "@/components/SearchBar";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Flower {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample flower data - in a real app, this would come from your backend
  const flowers: Flower[] = [
    {
      id: "1",
      name: "Red Roses",
      price: 299,
      image: "🌹",
      description: "Beautiful red roses perfect for any occasion",
      category: "roses"
    },
    {
      id: "2",
      name: "Sunflowers",
      price: 199,
      image: "🌻",
      description: "Bright and cheerful sunflowers",
      category: "sunflowers"
    },
    {
      id: "3",
      name: "White Lilies",
      price: 249,
      image: "🌺",
      description: "Elegant white lilies for special moments",
      category: "lilies"
    },
    {
      id: "4",
      name: "Pink Tulips",
      price: 279,
      image: "🌷",
      description: "Fresh pink tulips from Holland",
      category: "tulips"
    },
    {
      id: "5",
      name: "Yellow Marigolds",
      price: 149,
      image: "🌼",
      description: "Vibrant yellow marigolds",
      category: "marigolds"
    },
    {
      id: "6",
      name: "Purple Orchids",
      price: 399,
      image: "🌸",
      description: "Exotic purple orchids",
      category: "orchids"
    }
  ];

  const categories = [
    { id: "all", title: "All Flowers", image: "🌺" },
    { id: "roses", title: "Roses", image: "🌹" },
    { id: "sunflowers", title: "Sunflowers", image: "🌻" },
    { id: "lilies", title: "Lilies", image: "🌺" },
    { id: "tulips", title: "Tulips", image: "🌷" },
    { id: "marigolds", title: "Marigolds", image: "🌼" },
    { id: "orchids", title: "Orchids", image: "🌸" }
  ];

  const filteredFlowers = flowers.filter(flower => {
    const matchesSearch = flower.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || flower.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (flowerId: string) => {
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

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
        name: flower.name,
        price: flower.price,
        quantity: 1,
        image: flower.image
      }];
    });

    toast({
      title: "Added to cart!",
      description: `${flower.name} has been added to your cart.`,
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
      title: "Order placed!",
      description: "Your flowers will be delivered within 30 minutes.",
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
            Fresh Flowers
            <span className="text-pink-500"> Delivered Fast</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Beautiful flowers delivered to your doorstep in minutes
          </p>
          <div className="text-6xl mb-8">🌸🌹🌺🌻🌷</div>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                title={category.title}
                image={category.image}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Flowers Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {selectedCategory === "all" ? "All Flowers" : categories.find(c => c.id === selectedCategory)?.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFlowers.map(flower => (
              <FlowerCard
                key={flower.id}
                id={flower.id}
                name={flower.name}
                price={flower.price}
                image={flower.image}
                description={flower.description}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose FlowerExpress?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Fresh flowers delivered within 30 minutes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Always Fresh</h3>
              <p className="text-gray-600">Directly sourced from local flower gardens</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">Perfect for Gifts</h3>
              <p className="text-gray-600">Beautiful arrangements for every occasion</p>
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

export default Index;
