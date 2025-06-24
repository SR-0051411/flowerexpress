
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { NewProduct, initialNewProduct, categories, Flower } from "./types";

interface ProductFormProps {
  showAddForm: boolean;
  onToggleForm: () => void;
  onAddFlower: (flower: Omit<Flower, 'id'>) => void;
}

const ProductForm = ({ showAddForm, onToggleForm, onAddFlower }: ProductFormProps) => {
  const [newProduct, setNewProduct] = useState<NewProduct>(initialNewProduct);

  const handleNewImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        imageFile: file,
        imageFileUrl: imageUrl
      }));
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.customName || (!newProduct.image && !newProduct.imageFileUrl) || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddFlower({
      nameKey: newProduct.nameKey,
      customName: newProduct.customName,
      price: newProduct.price,
      image: newProduct.image,
      imageFileUrl: newProduct.imageFileUrl,
      descKey: newProduct.descKey,
      customDesc: newProduct.customDesc,
      category: newProduct.category,
      available: newProduct.available,
      isCustom: true,
      tiedLength: newProduct.tiedLength > 0 ? newProduct.tiedLength : undefined,
      ballQuantity: newProduct.ballQuantity > 0 ? newProduct.ballQuantity : undefined
    });

    if (newProduct.imageFileUrl) {
      URL.revokeObjectURL(newProduct.imageFileUrl);
    }

    setNewProduct(initialNewProduct);
    onToggleForm();
    
    toast({
      title: "Product Added",
      description: "New product has been added successfully",
    });
  };

  if (!showAddForm) {
    return (
      <Button 
        onClick={onToggleForm}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Product
      </Button>
    );
  }

  return (
    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
      <h3 className="text-lg font-semibold mb-4 text-green-800">Add New Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="new-name">Product Name *</Label>
          <Input
            id="new-name"
            value={newProduct.customName}
            onChange={(e) => setNewProduct(prev => ({...prev, customName: e.target.value}))}
            placeholder="Enter product name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new-category">Category *</Label>
          <Select
            value={newProduct.category}
            onValueChange={(value) => setNewProduct(prev => ({...prev, category: value}))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="new-price">Price (₹) *</Label>
          <Input
            id="new-price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
            placeholder="Enter price"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new-image-file">Product Image (optional, real photo)</Label>
          <Input
            id="new-image-file"
            type="file"
            accept="image/*"
            onChange={handleNewImageFileChange}
            className="mt-1"
          />
          {newProduct.imageFileUrl && (
            <img
              src={newProduct.imageFileUrl}
              alt="Preview"
              className="w-20 h-20 rounded object-cover mt-2 border"
            />
          )}
          <span className="block text-xs text-gray-400 mt-1">You can use real images for product photos. If no image uploaded, emoji/icon will be shown.</span>
        </div>
        <div>
          <Label htmlFor="new-image">Emoji/Icon *</Label>
          <Input
            id="new-image"
            value={newProduct.image}
            onChange={(e) => setNewProduct(prev => ({...prev, image: e.target.value}))}
            placeholder="🥥 (Enter emoji or icon)"
            className="mt-1"
          />
          <span className="block text-xs text-gray-400 mt-1">If you don't upload an image, the icon/emoji will be used.</span>
        </div>
        <div>
          <Label htmlFor="new-tied-length">Tied Length (ft)</Label>
          <Input
            id="new-tied-length"
            type="number"
            step="0.5"
            value={newProduct.tiedLength}
            onChange={(e) => setNewProduct(prev => ({...prev, tiedLength: parseFloat(e.target.value) || 0}))}
            placeholder="e.g., 4"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new-ball-quantity">Flower Balls</Label>
          <Input
            id="new-ball-quantity"
            type="number"
            value={newProduct.ballQuantity}
            onChange={(e) => setNewProduct(prev => ({...prev, ballQuantity: parseInt(e.target.value) || 0}))}
            placeholder="e.g., 1"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="new-desc">Description</Label>
          <Textarea
            id="new-desc"
            value={newProduct.customDesc}
            onChange={(e) => setNewProduct(prev => ({...prev, customDesc: e.target.value}))}
            placeholder="Enter product description"
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={newProduct.available}
            onCheckedChange={(checked) => setNewProduct(prev => ({...prev, available: checked}))}
          />
          <Label>Available</Label>
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600">
          Add Product
        </Button>
        <Button onClick={onToggleForm} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
