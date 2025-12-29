import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Package, Clock, CheckCircle, Truck, XCircle, CreditCard, RefreshCw, MapPin, Phone, User } from "lucide-react";

interface OrderManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderManagement = ({ isOpen, onClose }: OrderManagementProps) => {
  const { allOrders, isLoadingOrders, updateOrderStatus, fetchAllOrders } = usePayment();
  const { isOwner, user } = useAuth();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (isOpen && isOwner && user) {
      fetchAllOrders();
    }
  }, [isOpen, isOwner, user, fetchAllOrders]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CreditCard className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatOrderId = (id: string) => {
    return id.slice(-8).toUpperCase();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus as any);
      toast({
        title: "Status Updated",
        description: `Order status changed to ${getStatusLabel(newStatus)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.status === statusFilter);

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Order counts by status
  const orderCounts = {
    all: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    paid: allOrders.filter(o => o.status === 'paid').length,
    processing: allOrders.filter(o => o.status === 'processing').length,
    shipped: allOrders.filter(o => o.status === 'shipped').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
  };

  if (!isOwner || !user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">You do not have permission to access order management.</p>
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Order Management
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllOrders()}
              disabled={isLoadingOrders}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
              <Badge variant="secondary" className="ml-2">
                {orderCounts[status]}
              </Badge>
            </Button>
          ))}
        </div>
        
        {isLoadingOrders ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {statusFilter === 'all' ? 'No orders found' : `No ${getStatusLabel(statusFilter).toLowerCase()} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{formatOrderId(order.id)}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                        disabled={updatingOrderId === order.id}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Details */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Details
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{order.customerInfo.name}</p>
                      <p className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {order.customerInfo.phone}
                      </p>
                      <p className="flex items-start gap-1 text-gray-600">
                        <MapPin className="w-3 h-3 mt-0.5" />
                        <span>
                          {order.customerInfo.address}
                          {order.customerInfo.landmark && <>, {order.customerInfo.landmark}</>}
                          <br />
                          {order.customerInfo.city} - {order.customerInfo.pincode}
                        </span>
                      </p>
                      {order.customerInfo.latitude && order.customerInfo.longitude && (
                        <a 
                          href={`https://www.google.com/maps?q=${order.customerInfo.latitude},${order.customerInfo.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View on Map →
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="text-sm space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>
                            {item.name} x {item.quantity}
                            {item.tiedLength && ` (${item.tiedLength} ft)`}
                            {item.ballQuantity && ` (${item.ballQuantity} balls)`}
                          </span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 font-semibold flex justify-between text-base">
                        <span>Total</span>
                        <span className="text-pink-600">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Info */}
                {order.paymentId && (
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex items-center gap-4">
                    <span>Payment: {order.paymentMethod?.toUpperCase()}</span>
                    <span>ID: {order.paymentId}</span>
                  </div>
                )}

                {/* Delivery Notes */}
                {order.customerInfo.deliveryNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Delivery Notes:</span> {order.customerInfo.deliveryNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderManagement;
