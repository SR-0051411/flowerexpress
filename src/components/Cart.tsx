import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tiedLength?: number;
  ballQuantity?: number;
  imageFileUrl?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) => {
  const { t } = useLanguage();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Split item name for Tamil and English
  // Assume name is like "சிவப்பு ரோஜாக்கள் (Red Roses)" if possible
  const getBallSpec = (qty: number | undefined) => {
    if (!qty) return null;
    return (
      <div className="mb-1 flex items-center gap-2">
        <div className="text-pink-700 text-base font-bold leading-tight flex items-center gap-2">
          🌸
          <span>
            {qty} பந்து ({qty} ball{qty > 1 ? "s" : ""})
          </span>
        </div>
      </div>
    );
  };

  const getTiedLengthSpec = (len: number | undefined) => {
    if (!len) return null;
    return (
      <div className="flex items-center gap-2">
        <div className="text-pink-700 text-base font-bold leading-tight flex items-center gap-2">
          📏
          <span>
            {len} முழம் ({len}ft tied length)
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Your Cart
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">🛒</span>
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-3 bg-pink-50 p-3 rounded-lg"
              >
                {item.imageFileUrl ? (
                  <img src={item.imageFileUrl} alt={item.name} className="w-10 h-10 rounded object-cover border" />
                ) : (
                  <span className="text-3xl">{item.image}</span>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-pink-600 font-bold">
                    ₹{item.price}
                  </p>

                  {(item.tiedLength || item.ballQuantity) && (
                    <div className="text-xs text-gray-600 mt-1 space-y-1">
                      {getBallSpec(item.ballQuantity)}
                      {getTiedLengthSpec(item.tiedLength)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-8 h-8 p-0 ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold text-pink-600">
                  ₹{total}
                </span>
              </div>
              <Button
                onClick={onCheckout}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-lg py-3"
              >
                Order Now
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
