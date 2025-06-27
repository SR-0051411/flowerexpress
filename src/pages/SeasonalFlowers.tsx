
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
import { ArrowLeft, Leaf, Sun, Snowflake } from "lucide-react";

const SeasonalFlowersContent = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
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
          <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            மீண்டும் பிரதான பக்கம் (Back to Home)
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Enhanced Seasonal Section */}
        <div className="mb-8 text-center bg-gradient-to-r from-orange-100 via-yellow-50 to-rose-100 rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sun className="w-8 h-8 text-yellow-600 animate-pulse" />
            <Leaf className="w-6 h-6 text-green-500" />
            <Snowflake className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-pink-600 bg-clip-text text-transparent mb-3">
            பருவகால பூக்கள் (Seasonal Flowers)
          </h1>
          
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
            Nature's Calendar - Fresh with Every Season
          </h2>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200">
            <p className="text-lg text-orange-800 font-medium mb-2">
              🌸 சீசன் அடிப்படையில் மட்டுமே கிடைக்கும் சிறப்பு பூக்கள் 🌸
            </p>
            <p className="text-base text-gray-600">
              <span className="font-semibold text-orange-600">Special flowers available only in specific seasons</span> - Fresh, rare, and naturally timed
            </p>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-medium">
              🌞 Summer Specials
            </span>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-medium">
              🌿 Monsoon Fresh
            </span>
            <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-medium">
              🍂 Winter Blooms
            </span>
          </div>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <ProductGrid
          flowers={flowers}
          searchTerm={searchTerm}
          selectedCategory="seasonal"
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

const SeasonalFlowers = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PaymentProvider>
          <FlowersProvider>
            <SeasonalFlowersContent />
          </FlowersProvider>
        </PaymentProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default SeasonalFlowers;
