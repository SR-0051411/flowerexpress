import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFlowers } from "@/contexts/FlowersContext";
import { toast } from "@/hooks/use-toast";
import ProductForm from "./admin/ProductForm";
import ProductCard from "./admin/ProductCard";
import PasswordChangeForm from "./admin/PasswordChangeForm";
import { Flower } from "./admin/types";
import { Settings, Lock } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { logout } = useAuth();
  const { flowers, updateFlower, addFlower, deleteFlower } = useFlowers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [editingFlowers, setEditingFlowers] = useState<{[key: string]: Flower}>({});

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
      updateFlower(flowerId, updatedFlower);
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

  const handlePasswordChange = (newPassword: string) => {
    console.log('Owner password updated successfully');
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
              <Button 
                onClick={() => setShowPasswordChange(true)}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <ProductForm 
                showAddForm={showAddForm}
                onToggleForm={() => setShowAddForm(!showAddForm)}
                onAddFlower={addFlower}
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
                onDeleteFlower={deleteFlower}
              />
            ))}
          </div>
        </div>

        <PasswordChangeForm
          isOpen={showPasswordChange}
          onClose={() => setShowPasswordChange(false)}
          onPasswordChange={handlePasswordChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
