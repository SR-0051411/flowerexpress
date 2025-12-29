import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-900 via-rose-800 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-300">
                <img 
                  src="/lovable-uploads/8f5d8f7a-5451-4cb1-b6ed-30aa39799b28.png" 
                  alt="FlowerExpressCo Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">FlowerExpressCo</h3>
            </div>
            <p className="text-pink-200 text-sm">
              Your premium flower delivery service. Fresh flowers, garlands, and seasonal arrangements delivered with care.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/all-flowers" className="text-pink-200 hover:text-white transition-colors">
                  All Flowers
                </Link>
              </li>
              <li>
                <Link to="/garlands" className="text-pink-200 hover:text-white transition-colors">
                  Flower Garlands
                </Link>
              </li>
              <li>
                <Link to="/tied-flowers" className="text-pink-200 hover:text-white transition-colors">
                  Tied Flowers
                </Link>
              </li>
              <li>
                <Link to="/seasonal" className="text-pink-200 hover:text-white transition-colors">
                  Seasonal Flowers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-pink-200 hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-pink-200 hover:text-white transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-pink-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/data-deletion" className="text-pink-200 hover:text-white transition-colors">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-300" />
                <a href="mailto:support@flowerexpressco.com" className="text-pink-200 hover:text-white transition-colors">
                  support@flowerexpressco.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-300" />
                <a href="tel:+1234567890" className="text-pink-200 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pink-300 mt-0.5" />
                <span className="text-pink-200">
                  123 Flower Street,<br />
                  Garden City, GC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-pink-200 text-sm">
            © {new Date().getFullYear()} FlowerExpressCo. All rights reserved.
          </p>
          <p className="text-pink-200 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-400 fill-red-400" /> for flower lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;