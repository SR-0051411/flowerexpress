
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flower } from "@/data/flowersData";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tiedLength?: number;
  ballQuantity?: number;
}

export const useCartManagement = (flowers: Flower[]) => {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (flowerId: string) => {
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

    const flowerName = flower.isCustom ? flower.customName || 'Unknown Product' : t(flower.nameKey);

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === flowerId);
      if (existingItem) {
        return prev.map(item =>
          item.id === flowerId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: flower.id,
        name: flowerName,
        price: flower.price,
        quantity: 1,
        image: flower.image,
        tiedLength: flower.tiedLength,
        ballQuantity: flower.ballQuantity
      }];
    });

    toast({
      title: t('addedToCart'),
      description: `${flowerName} ${t('addedToCartDesc')}`,
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  };
};
