
import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useCartManagement } from "@/hooks/useCartManagement";
import { initialFlowers, Flower } from "@/data/flowersData";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SpareFlowersContent = () => {
  const { user, signOut, isOwner } = useAuth();
  const [flowers] = useState<Flower[]>(initialFlowers);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    cartItems,
    addToCart,
    cartCount
  } = useCartManagement(flowers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => {}}
        onAdminPanelClick={() => {}}
        onOrderManagementClick={() => {}}
        onOwnerLoginClick={() => {}}
        onSignOut={signOut}
        userEmail={user?.email}
        isAdmin={isOwner}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            மீண்டும் பிரதான பக்கம் (Back to Home)
          </Link>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <ProductGrid
          flowers={flowers}
          searchTerm={searchTerm}
          selectedCategory="spare"
          onAddToCart={addToCart}
        />
      </main>
    </div>
  );
};

const SpareFlowers = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SpareFlowersContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default SpareFlowers;
