import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface EmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailPreview = ({ isOpen, onClose }: EmailPreviewProps) => {
  const sampleOrder = {
    orderId: "ORD-A1B2C3",
    customerName: "ராஜா குமார்",
    items: [
      { name: "மல்லிகை பூ", quantity: 2, price: 120 },
      { name: "ரோஜா பூ", quantity: 1, price: 80 }
    ],
    total: 320,
    date: "29 Dec 2024"
  };

  const emailTemplates = [
    {
      id: "pending",
      label: "Order Placed",
      icon: Clock,
      subject: "🌸 Order Confirmed - " + sampleOrder.orderId,
      statusColor: "#f59e0b",
      statusText: "Order Received",
      message: "Thank you for your order! We have received your order and will begin processing it shortly."
    },
    {
      id: "processing",
      label: "Processing",
      icon: Package,
      subject: "📦 Order Being Prepared - " + sampleOrder.orderId,
      statusColor: "#3b82f6",
      statusText: "Being Prepared",
      message: "Great news! Your flowers are being carefully prepared and packaged with love."
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: Truck,
      subject: "🚚 Order Shipped - " + sampleOrder.orderId,
      statusColor: "#8b5cf6",
      statusText: "On The Way",
      message: "Your order is on its way! Our delivery partner will deliver your fresh flowers soon."
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      subject: "✅ Order Delivered - " + sampleOrder.orderId,
      statusColor: "#10b981",
      statusText: "Delivered",
      message: "Your order has been delivered! We hope you enjoy your beautiful flowers."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Email Notification Preview</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {emailTemplates.map((template) => (
              <TabsTrigger key={template.id} value={template.id} className="text-xs sm:text-sm">
                <template.icon className="w-4 h-4 mr-1 hidden sm:inline" />
                {template.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {emailTemplates.map((template) => (
            <TabsContent key={template.id} value={template.id} className="mt-4">
              {/* Email Subject Preview */}
              <div className="bg-muted/50 p-3 rounded-t-lg border border-b-0">
                <p className="text-sm text-muted-foreground">Subject:</p>
                <p className="font-medium">{template.subject}</p>
              </div>

              {/* Email Body Preview */}
              <div className="border rounded-b-lg overflow-hidden">
                <div 
                  className="p-6"
                  style={{ 
                    background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)" 
                  }}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-pink-700">🌸 Sri Mahalakshmi Flowers 🌸</h1>
                    <p className="text-pink-600 text-sm mt-1">Fresh Flowers, Delivered with Love</p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center mb-6">
                    <div 
                      className="px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2"
                      style={{ backgroundColor: template.statusColor }}
                    >
                      <template.icon className="w-5 h-5" />
                      {template.statusText}
                    </div>
                  </div>

                  {/* Main Content Card */}
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
                    <p className="text-gray-700 mb-4">
                      Dear <strong>{sampleOrder.customerName}</strong>,
                    </p>
                    <p className="text-gray-600 mb-6">{template.message}</p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Details
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Order ID: <span className="font-mono font-medium">{sampleOrder.orderId}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        Date: {sampleOrder.date}
                      </p>
                      
                      <div className="border-t pt-3">
                        {sampleOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm py-1">
                            <span>{item.name} × {item.quantity}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-gray-800 border-t mt-2 pt-2">
                          <span>Total</span>
                          <span>₹{sampleOrder.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a 
                      href="#"
                      className="block w-full text-center py-3 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: template.statusColor }}
                    >
                      Track Your Order
                    </a>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-6 text-sm text-pink-700">
                    <p>Thank you for choosing Sri Mahalakshmi Flowers!</p>
                    <p className="text-xs text-pink-600 mt-2">
                      Questions? Reply to this email or call us at +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-sm text-muted-foreground text-center mt-4">
          These emails will be sent automatically when you update order statuses in the admin panel.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreview;
