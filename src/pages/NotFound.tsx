import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
            <img 
              src="/lovable-uploads/8f5d8f7a-5451-4cb1-b6ed-30aa39799b28.png" 
              alt="FlowerExpressCo Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page not found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for seems to have wilted away. 
          Let's get you back to our beautiful flower collection!
        </p>

        {/* Decorative flowers */}
        <div className="flex justify-center space-x-4 mb-8 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>🌸</span>
          <span className="animate-bounce" style={{ animationDelay: "100ms" }}>🌺</span>
          <span className="animate-bounce" style={{ animationDelay: "200ms" }}>🌷</span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>🌹</span>
          <span className="animate-bounce" style={{ animationDelay: "400ms" }}>🌻</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white px-6 py-3 w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/all-flowers">
            <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 px-6 py-3 w-full sm:w-auto">
              <Search className="w-5 h-5 mr-2" />
              Browse Flowers
            </Button>
          </Link>
        </div>

        {/* Go Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-6 text-pink-500 hover:text-pink-600 flex items-center justify-center mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go back to previous page
        </button>

        {/* Brand Footer */}
        <p className="mt-12 text-sm text-gray-500">
          🌸 <span className="font-medium text-pink-600">FlowerExpressCo</span> - Premium Flower Delivery 🌸
        </p>
      </div>
    </div>
  );
};

export default NotFound;