
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface Flower {
  id: string;
  nameKey: string;
  price: number;
  image: string;
  descKey: string;
  category: string;
  available?: boolean;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: Flower[];
  onUpdateFlower: (id: string, updates: Partial<Flower>) => void;
}

const AdminPanel = ({ isOpen, onClose, flowers, onUpdateFlower }: AdminPanelProps) => {
  const { t } = useLanguage();
  const { isOwner, logout } = useAuth();
  const [editingFlower, setEditingFlower] = useState<Flower | null>(null);

  if (!isOwner) return null;

  const handleUpdateFlower = (flowerId: string, field: keyof Flower, value: any) => {
    onUpdateFlower(flowerId, { [field]: value });
    toast({
      title: "Product Updated",
      description: `${field} has been updated successfully`,
    });
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Owner Dashboard - Product Management
            </DialogTitle>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {flowers.map((flower) => (
            <div key={flower.id} className="border rounded-lg p-4 bg-pink-50">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{flower.image}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t(flower.nameKey)}</h3>
                  <p className="text-sm text-gray-600">{flower.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`available-${flower.id}`}>Available</Label>
                  <Switch
                    id={`available-${flower.id}`}
                    checked={flower.available !== false}
                    onCheckedChange={(checked) => 
                      handleUpdateFlower(flower.id, 'available', checked)
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`price-${flower.id}`}>Price (₹)</Label>
                  <Input
                    id={`price-${flower.id}`}
                    type="number"
                    value={flower.price}
                    onChange={(e) => 
                      handleUpdateFlower(flower.id, 'price', parseInt(e.target.value) || 0)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`category-${flower.id}`}>Category</Label>
                  <Input
                    id={`category-${flower.id}`}
                    value={flower.category}
                    onChange={(e) => 
                      handleUpdateFlower(flower.id, 'category', e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
