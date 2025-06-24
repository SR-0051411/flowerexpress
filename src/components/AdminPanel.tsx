import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ProductForm from "./admin/ProductForm";
import ProductCard from "./admin/ProductCard";
import { Flower, AdminPanelProps } from "./admin/types";

const AdminPanel = ({ isOpen, onClose, flowers, onUpdateFlower, onAddFlower, onDeleteFlower }: AdminPanelProps) => {
  const { isOwner, logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFlowers, setEditingFlowers] = useState<{[key: string]: Flower}>({});

  if (!isOwner) return null;

  const handleUpdateFlower = (flowerId: string, field: keyof Flower, value: any) => {
    setEditingFlowers(prev => ({
      ...prev,
      [flowerId]: {
        ...flowers.find(f => f.id === flowerId)!,
        ...prev[flowerId],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = (flowerId: string) => {
    const updatedFlower = editingFlowers[flowerId];
    if (updatedFlower) {
      onUpdateFlower(flowerId, updatedFlower);
      setEditingFlowers(prev => {
        const newState = { ...prev };
        delete newState[flowerId];
        return newState;
      });
      toast({
        title: "Product Updated",
        description: "Changes have been saved successfully",
      });
    }
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Owner Dashboard - Product Management
            </DialogTitle>
            <div className="flex space-x-2">
              <ProductForm 
                showAddForm={showAddForm}
                onToggleForm={() => setShowAddForm(!showAddForm)}
                onAddFlower={onAddFlower}
              />
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Existing Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Products ({flowers.length})</h3>
            {flowers.map((flower) => (
              <ProductCard
                key={flower.id}
                flower={flower}
                editingFlowers={editingFlowers}
                onUpdateFlower={handleUpdateFlower}
                onSaveChanges={handleSaveChanges}
                onDeleteFlower={onDeleteFlower}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
