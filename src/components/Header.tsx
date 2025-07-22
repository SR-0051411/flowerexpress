
import { ShoppingCart, Settings, Package, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminPanelClick: () => void;
  onOrderManagementClick: () => void;
  onOwnerLoginClick: () => void;
  onSignOut: () => void;
  userEmail?: string;
  isAdmin?: boolean;
}

const Header = ({ 
  cartCount, 
  onCartClick, 
  onAdminPanelClick, 
  onOrderManagementClick, 
  onOwnerLoginClick,
  onSignOut,
  userEmail,
  isAdmin
}: HeaderProps) => {
  const { t } = useLanguage();
  const { isOwner, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
              <img 
                src="/lovable-uploads/8f5d8f7a-5451-4cb1-b6ed-30aa39799b28.png" 
                alt="FlowerExpress Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('appName')}</h1>
              <p className="text-sm text-gray-500">{t('tagline')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Owner/Admin Controls - Only show if user is owner */}
            {isOwner ? (
              <div className="flex space-x-2">
                <Button 
                  onClick={onAdminPanelClick}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
                <Button 
                  onClick={onOrderManagementClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            ) : (
              // Only show Owner Login button if no user is signed in AND not owner
              !user && !isOwner && (
                <Button 
                  onClick={onOwnerLoginClick}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Owner Login
                </Button>
              )
            )}
            
            <Button 
              onClick={onCartClick}
              className="relative bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 text-lg"
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              {t('cart')}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User dropdown - Only show if user is signed in */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{userEmail?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {userEmail}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="focus:bg-pink-50"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
