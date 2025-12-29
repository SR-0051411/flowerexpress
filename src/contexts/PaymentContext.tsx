import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentId?: string;
  createdAt: Date;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
  deliveryNotes?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tiedLength?: number;
  ballQuantity?: number;
}

interface PaymentContextType {
  orders: Order[];
  isProcessingPayment: boolean;
  isLoadingOrders: boolean;
  createOrder: (items: CartItem[], customerInfo: CustomerInfo, total: number) => Promise<string>;
  processPayment: (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking') => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrders: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const { user } = useAuth();

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoadingOrders(true);
    try {
      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Fetch order items for all orders
      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
      }

      // Map database orders to Order interface
      const mappedOrders: Order[] = ordersData.map(dbOrder => {
        const orderItems = (itemsData || [])
          .filter(item => item.order_id === dbOrder.id)
          .map(item => ({
            id: item.flower_id,
            name: item.flower_name,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.flower_image || '',
            tiedLength: item.tied_length || undefined,
            ballQuantity: item.ball_quantity || undefined
          }));

        return {
          id: dbOrder.id,
          items: orderItems,
          total: Number(dbOrder.total),
          customerInfo: {
            name: dbOrder.customer_name,
            phone: dbOrder.customer_phone,
            address: dbOrder.delivery_address,
            landmark: dbOrder.delivery_landmark || undefined,
            city: dbOrder.delivery_city,
            pincode: dbOrder.delivery_pincode,
            latitude: dbOrder.delivery_latitude || undefined,
            longitude: dbOrder.delivery_longitude || undefined,
            deliveryNotes: dbOrder.delivery_notes || undefined
          },
          status: dbOrder.status as Order['status'],
          paymentMethod: dbOrder.payment_method || undefined,
          paymentId: dbOrder.payment_id || undefined,
          createdAt: new Date(dbOrder.created_at)
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const createOrder = async (items: CartItem[], customerInfo: CustomerInfo, total: number): Promise<string> => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    // Insert order into database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total: total,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        delivery_address: customerInfo.address,
        delivery_landmark: customerInfo.landmark || null,
        delivery_city: customerInfo.city,
        delivery_pincode: customerInfo.pincode,
        delivery_latitude: customerInfo.latitude || null,
        delivery_longitude: customerInfo.longitude || null,
        delivery_notes: customerInfo.deliveryNotes || null,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      flower_id: item.id,
      flower_name: item.name,
      flower_image: item.image,
      price: item.price,
      quantity: item.quantity,
      tied_length: item.tiedLength || null,
      ball_quantity: item.ballQuantity || null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Order was created but items failed - we should still return the order ID
    }

    // Add to local state immediately
    const newOrder: Order = {
      id: orderData.id,
      items,
      total,
      customerInfo,
      status: 'pending',
      createdAt: new Date(orderData.created_at)
    };

    setOrders(prev => [newOrder, ...prev]);
    return orderData.id;
  };

  const processPayment = async (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking'): Promise<boolean> => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing (in production, integrate with Stripe/Razorpay)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo mode: 90% success rate
      const paymentSuccessful = Math.random() > 0.1;
      
      if (paymentSuccessful) {
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Update order in database
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_method: paymentMethod,
            payment_id: paymentId
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order payment:', error);
          return false;
        }

        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, paymentId, paymentMethod, status: 'paid' as const }
            : order
        ));
        
        return true;
      } else {
        // Update order as cancelled in database
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);

        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' as const } : order
        ));
        
        return false;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Update in database
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return;
    }

    // Update local state
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <PaymentContext.Provider value={{
      orders,
      isProcessingPayment,
      isLoadingOrders,
      createOrder,
      processPayment,
      updateOrderStatus,
      getOrderById,
      fetchOrders
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
