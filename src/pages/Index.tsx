import { useState } from "react";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import SearchBar from "@/components/SearchBar";
import AdminPanel from "@/components/AdminPanel";
import CheckoutForm from "@/components/CheckoutForm";
import OrderManagement from "@/components/OrderManagement";
import OwnerLogin from "@/components/OwnerLogin";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductGrid from "@/components/ProductGrid";
import FeaturesSection from "@/components/FeaturesSection";
import EnquiryButton from "@/components/EnquiryButton";
import EnquiryForm from "@/components/EnquiryForm";
import FeedbackButton from "@/components/FeedbackButton";
import FeedbackForm from "@/components/FeedbackForm";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { EnquiryProvider } from "@/contexts/EnquiryContext";
import { useCartManagement } from "@/hooks/useCartManagement";
import { initialFlowers, Flower } from "@/data/flowersData";

const IndexContent = () => {
  const { user, signOut, isOwner } = useAuth();
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderManagementOpen, setIsOrderManagementOpen] = useState(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  } = useCartManagement(flowers);

  const updateFlower = (id: string, updates: Partial<Flower>) => {
    setFlowers(prev => prev.map(flower => 
      flower.id === id ? { ...flower, ...updates } : flower
    ));
  };

  const addFlower = (newFlower: Omit<Flower, 'id'>) => {
    const id = Date.now().toString();
    setFlowers(prev => [...prev, { ...newFlower, id }]);
  };

  const deleteFlower = (id: string) => {
    setFlowers(prev => prev.filter(flower => flower.id !== id));
  };

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
        onOrderManagementClick={() => setIsOrderManagementOpen(true)}
        onOwnerLoginClick={() => setIsOwnerLoginOpen(true)}
        onSignOut={signOut}
        userEmail={user?.email}
        isAdmin={isOwner}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoriesSection 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ProductGrid
          flowers={flowers}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onAddToCart={addToCart}
        />
        <FeaturesSection />
      </main>

      {/* Enquiry System */}
      <EnquiryButton />
      <EnquiryForm />

      {/* Feedback System */}
      <FeedbackButton onClick={() => setIsFeedbackOpen(true)} />
      <FeedbackForm 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />

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

      {/* Owner Login Dialog */}
      <OwnerLogin
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
      />

      {/* Admin/Owner Panels - Only show if user is owner */}
      {isOwner && (
        <>
          <AdminPanel
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            flowers={flowers}
            onUpdateFlower={updateFlower}
            onAddFlower={addFlower}
            onDeleteFlower={deleteFlower}
          />

          <OrderManagement
            isOpen={isOrderManagementOpen}
            onClose={() => setIsOrderManagementOpen(false)}
          />
        </>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <PaymentProvider>
          <EnquiryProvider>
            <IndexContent />
          </EnquiryProvider>
        </PaymentProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default Index;
