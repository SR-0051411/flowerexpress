
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
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        imageFile: file,
        imageFileUrl: imageUrl
      }));
      
      toast({
        title: "Main Image Selected",
        description: "Primary product image ready to upload!",
      });
    }
  };

  const handleAdditionalImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => {
        const newAdditionalImages = [...(prev.additionalImages || [])];
        newAdditionalImages[index] = { file, url: imageUrl };
        return {
          ...prev,
          additionalImages: newAdditionalImages
        };
      });
      
      toast({
        title: `Additional Image ${index + 1} Selected`,
        description: "Extra product image ready to upload!",
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setNewProduct(prev => {
      const newAdditionalImages = [...(prev.additionalImages || [])];
      if (newAdditionalImages[index]?.url) {
        URL.revokeObjectURL(newAdditionalImages[index].url!);
      }
      newAdditionalImages.splice(index, 1);
      return {
        ...prev,
        additionalImages: newAdditionalImages
      };
    });
  };

  const addMoreImageSlots = () => {
    if ((newProduct.additionalImages?.length || 0) < 3) {
      setNewProduct(prev => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), { file: null, url: '' }]
      }));
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.customName || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide product name and price",
        variant: "destructive",
      });
      return;
    }

    // Ensure we have either an image file or emoji
    if (!newProduct.imageFileUrl && !newProduct.image) {
      toast({
        title: "Image Required",
        description: "Please upload a main image or provide an emoji",
        variant: "destructive",
      });
      return;
    }

    const flowerToAdd: Omit<Flower, 'id'> = {
      nameKey: newProduct.nameKey || 'custom',
      customName: newProduct.customName,
      price: newProduct.price,
      image: newProduct.image || '🌸',
      imageFileUrl: newProduct.imageFileUrl,
      imageFile: newProduct.imageFile,
      additionalImages: newProduct.additionalImages?.filter(img => img.url) || [],
      descKey: newProduct.descKey || 'custom',
      customDesc: newProduct.customDesc,
      category: newProduct.category,
      available: newProduct.available,
      isCustom: true,
      tiedLength: newProduct.tiedLength > 0 ? newProduct.tiedLength : undefined,
      ballQuantity: newProduct.ballQuantity > 0 ? newProduct.ballQuantity : undefined
    };

    onAddFlower(flowerToAdd);

    // Clean up the object URLs after adding
    if (newProduct.imageFileUrl) {
      setTimeout(() => {
        URL.revokeObjectURL(newProduct.imageFileUrl);
      }, 1000);
    }
    newProduct.additionalImages?.forEach(img => {
      if (img.url) {
        setTimeout(() => {
          URL.revokeObjectURL(img.url!);
        }, 1000);
      }
    });

    setNewProduct(initialNewProduct);
    onToggleForm();
    
    toast({
      title: "Fresh Product Added! 🌸",
      description: "New product with images is now available for customers",
    });
  };

  if (!showAddForm) {
    return (
      <Button 
        onClick={onToggleForm}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Fresh Product
      </Button>
    );
  }

  return (
    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
      <h3 className="text-lg font-semibold mb-4 text-green-800">📸 Add Fresh Daily Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="new-name">Product Name *</Label>
          <Input
            id="new-name"
            value={newProduct.customName}
            onChange={(e) => setNewProduct(prev => ({...prev, customName: e.target.value}))}
            placeholder="Enter fresh product name"
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
            placeholder="Enter today's price"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new-image">Backup Emoji/Icon</Label>
          <Input
            id="new-image"
            value={newProduct.image}
            onChange={(e) => setNewProduct(prev => ({...prev, image: e.target.value}))}
            placeholder="🌸 (fallback if no photo)"
            className="mt-1"
          />
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
            placeholder="Describe the freshness and quality of your product"
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={newProduct.available}
            onCheckedChange={(checked) => setNewProduct(prev => ({...prev, available: checked}))}
          />
          <Label className="text-green-700">Available Today</Label>
        </div>
      </div>

      {/* Main Image Section */}
      <div className="mt-6 border-t pt-6">
        <h4 className="text-md font-semibold text-green-800 mb-4">📸 Product Images</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="new-image-file" className="text-green-700 font-semibold">Main Product Photo *</Label>
            <Input
              id="new-image-file"
              type="file"
              accept="image/*"
              onChange={handleNewImageFileChange}
              className="mt-1 border-green-300"
            />
            {newProduct.imageFileUrl && (
              <div className="mt-3">
                <img
                  src={newProduct.imageFileUrl}
                  alt="Main product preview"
                  className="w-32 h-32 rounded object-cover border-2 border-green-300"
                />
                <span className="block text-xs text-green-600 mt-1">✅ Main image ready!</span>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-green-700 font-semibold">Additional Photos</Label>
              {(newProduct.additionalImages?.length || 0) < 3 && (
                <Button
                  type="button"
                  onClick={addMoreImageSlots}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-300"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Image
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {newProduct.additionalImages?.map((img, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAdditionalImageChange(index, e)}
                    className="flex-1 border-green-300 text-xs"
                  />
                  <Button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Additional Images Preview */}
            {newProduct.additionalImages?.some(img => img.url) && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {newProduct.additionalImages.map((img, index) => (
                  img.url && (
                    <div key={index} className="relative">
                      <img
                        src={img.url}
                        alt={`Additional preview ${index + 1}`}
                        className="w-20 h-20 rounded object-cover border border-green-300"
                      />
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-6">
        <Button onClick={handleAddProduct} className="bg-green-500 hover:bg-green-600">
          🌸 Add Fresh Product
        </Button>
        <Button onClick={onToggleForm} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
