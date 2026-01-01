
import { useState } from "react";
import { X, Send, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEnquiry } from "@/contexts/EnquiryContext";
import { toast } from "@/hooks/use-toast";

const EnquiryForm = () => {
  const { isEnquiryOpen, setIsEnquiryOpen, selectedProduct, setSelectedProduct } = useEnquiry();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    enquiryType: "general"
  });

  const enquiryTypes = [
    { id: "general", label: "பொது விசாரணை (General Enquiry)", icon: MessageCircle },
    { id: "product", label: "தயாரிப்பு விவரங்கள் (Product Details)", icon: MessageCircle },
    { id: "price", label: "விலை விசாரணை (Price Enquiry)", icon: MessageCircle },
    { id: "bulk", label: "மொத்த ஆர்டர் (Bulk Order)", icon: MessageCircle },
    { id: "custom", label: "தனிப்பயன் ஆர்டர் (Custom Order)", icon: MessageCircle }
  ];

  // =========================================
  // 🔧 OWNER CONTACT DETAILS - UPDATE HERE
  // =========================================
  const OWNER_WHATSAPP = "+91XXXXXXXXXX"; // Replace with your WhatsApp number (with country code)
  // =========================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const selectedType = enquiryTypes.find(type => type.id === formData.enquiryType);
    const message = `🌸 *மலர் கடை விசாரணை / Flower Shop Enquiry* 🌸

*பெயர் / Name:* ${formData.name}
*தொலைபேசி / Phone:* ${formData.phone}
*மின்னஞ்சல் / Email:* ${formData.email}

*விசாரணை வகை / Enquiry Type:* ${selectedType?.label}

*செய்தி / Message:*
${formData.message}

${selectedProduct ? `*தயாரிப்பு ID / Product ID:* ${selectedProduct}` : ''}

நன்றி! / Thank you!`;

    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "விசாரணை அனுப்பப்பட்டது! (Enquiry Sent!)",
      description: "உங்கள் விசாரணை WhatsApp மூலம் அனுப்பப்பட்டது (Your enquiry has been sent via WhatsApp)",
    });

    // Reset form
    setFormData({ name: "", phone: "", email: "", message: "", enquiryType: "general" });
    setSelectedProduct(null);
    setIsEnquiryOpen(false);
  };

  if (!isEnquiryOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-pink-700">விசாரணை படிவம்</h2>
              <p className="text-sm text-gray-600">Enquiry Form</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEnquiryOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                பெயர் (Name) *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="உங்கள் பெயரை உள்ளிடுக (Enter your name)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                தொலைபேசி எண் (Phone Number) *
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                மின்னஞ்சல் (Email)
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                விசாரணை வகை (Enquiry Type)
              </label>
              <div className="space-y-2">
                {enquiryTypes.map((type) => (
                  <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="enquiryType"
                      value={type.id}
                      checked={formData.enquiryType === type.id}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="text-pink-500"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                செய்தி (Message) *
              </label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="உங்கள் விசாரணையை விவரமாக எழுதுக (Describe your enquiry in detail)"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEnquiryOpen(false)}
                className="flex-1"
              >
                ரத்து (Cancel)
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                <Send className="w-4 h-4 mr-1" />
                அனுப்பு (Send)
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <Phone className="w-4 h-4" />
              <span>WhatsApp மூலம் உடனடி பதில் பெறுங்கள்!</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Get instant replies via WhatsApp!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;
