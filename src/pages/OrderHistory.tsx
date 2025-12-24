
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, CreditCard } from "lucide-react";

const OrderHistory = () => {
  const { orders } = usePayment();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CreditCard className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'paid':
        return 'Payment Received';
      case 'processing':
        return 'Being Prepared';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        </div>

        {sortedOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-4">Your order history will appear here once you make a purchase.</p>
              <Button onClick={() => navigate("/")} className="bg-pink-500 hover:bg-pink-600">
                Browse Flowers
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* Order Status Timeline */}
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex items-center justify-between text-sm">
                      <div className={`flex flex-col items-center ${order.status !== 'cancelled' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status !== 'cancelled' ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="mt-1 text-xs">Ordered</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 ${['paid', 'processing', 'delivered'].includes(order.status) ? 'bg-green-200' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center ${['paid', 'processing', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['paid', 'processing', 'delivered'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="mt-1 text-xs">Confirmed</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 ${['processing', 'delivered'].includes(order.status) ? 'bg-green-200' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center ${['processing', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['processing', 'delivered'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="mt-1 text-xs">Preparing</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' ? 'bg-green-200' : 'bg-gray-200'}`} />
                      <div className={`flex flex-col items-center ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="mt-1 text-xs">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                            {item.tiedLength && ` • ${item.tiedLength} ft`}
                            {item.ballQuantity && ` • ${item.ballQuantity} balls`}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-pink-600">₹{order.total}</span>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.name}<br />
                      {order.customerInfo.address}<br />
                      {order.customerInfo.city} - {order.customerInfo.pincode}<br />
                      Phone: {order.customerInfo.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
