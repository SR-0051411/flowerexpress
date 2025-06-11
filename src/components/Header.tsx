
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FlowerExpress</h1>
              <p className="text-sm text-gray-500">Fresh flowers delivered fast</p>
            </div>
          </div>
          
          <Button 
            onClick={onCartClick}
            className="relative bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 text-lg"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
