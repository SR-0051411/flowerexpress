
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Cart from "@/components/Cart";
import CheckoutForm from "@/components/CheckoutForm";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { FlowersProvider, useFlowers } from "@/contexts/FlowersContext";
import { useCartManagement } from "@/hooks/useCartManagement";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";

const FlowerGarlandsContent = () => {
  const { user, signOut, isOwner } = useAuth();
  const { flowers } = useFlowers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  } = useCartManagement(flowers);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)}
        onAdminPanelClick={() => {}}
        onOrderManagementClick={() => {}}
        onOwnerLoginClick={() => {}}
        onSignOut={signOut}
        userEmail={user?.email}
        isAdmin={isOwner}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            மீண்டும் பிரதான பக்கம் (Back to Home)
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Custom Tagline Section */}
        <div className="mb-8 text-center bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100 rounded-2xl p-8 border-2 border-pink-200 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-pink-600 animate-pulse" />
            <Heart className="w-6 h-6 text-rose-500" />
            <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-3">
            உங்கள் கனவு மாலைகள், எங்கள் கைவண்ணம்
          </h1>
          
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Your Dream Garlands, Our Craftsmanship
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-200">
            <p className="text-lg text-pink-800 font-medium mb-2">
              🌸 விருப்பம் போல் வடிவமைக்கப்படும் மாலைகள் 🌸
            </p>
            <p className="text-base text-gray-600">
              <span className="font-semibold text-rose-600">Fully Customizable Garlands</span> - Tell us your vision, we'll weave it into reality
            </p>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full font-medium">
              🎨 Custom Designs
            </span>
            <span className="bg-rose-200 text-rose-800 px-3 py-1 rounded-full font-medium">
              🌺 Fresh Flowers
            </span>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-medium">
              ✨ Premium Quality
            </span>
          </div>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <ProductGrid
          flowers={flowers}
          searchTerm={searchTerm}
          selectedCategory="garland"
          onAddToCart={addToCart}
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={cartTotal}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

const FlowerGarlands = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PaymentProvider>
          <FlowersProvider>
            <FlowerGarlandsContent />
          </FlowersProvider>
        </PaymentProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default FlowerGarlands;
