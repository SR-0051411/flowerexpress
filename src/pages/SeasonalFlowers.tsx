
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Cart from "@/components/Cart";
import CheckoutForm from "@/components/CheckoutForm";
import AdminPanel from "@/components/AdminPanel";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { FlowersProvider, useFlowers } from "@/contexts/FlowersContext";
import { useCartManagement } from "@/hooks/useCartManagement";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SeasonalFlowersContent = () => {
  const { user, signOut, isOwner } = useAuth();
  const { flowers } = useFlowers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

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
        onAdminPanelClick={() => setIsAdminPanelOpen(true)}
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
        
        <div className="mb-6 text-center bg-orange-100 p-4 rounded-lg border border-orange-200">
          <h1 className="text-3xl font-bold text-orange-800 mb-2">
            🌸 பருவகால பூக்கள் (Seasonal Flowers) 🌸
          </h1>
          <p className="text-orange-700">
            சீசன் அடிப்படையில் மட்டுமே கிடைக்கும் சிறப்பு பூக்கள் - Special flowers available only in specific seasons
          </p>
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

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
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
