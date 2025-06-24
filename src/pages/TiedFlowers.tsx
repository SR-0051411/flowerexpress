
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

const TiedFlowersContent = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
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
          <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            மீண்டும் பிரதான பக்கம் (Back to Home)
          </Link>
          <LanguageSwitcher />
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <ProductGrid
          flowers={flowers}
          searchTerm={searchTerm}
          selectedCategory="tied"
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

const TiedFlowers = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PaymentProvider>
          <FlowersProvider>
            <TiedFlowersContent />
          </FlowersProvider>
        </PaymentProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default TiedFlowers;
