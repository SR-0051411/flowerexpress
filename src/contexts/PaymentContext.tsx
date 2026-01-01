import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentId?: string;
  createdAt: Date;
  userId?: string;
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
  allOrders: Order[];
  isProcessingPayment: boolean;
  isLoadingOrders: boolean;
  createOrder: (items: CartItem[], customerInfo: CustomerInfo, total: number) => Promise<string>;
  processPayment: (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking') => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const { user, isOwner } = useAuth();

  // Map database order to Order interface
  const mapDbOrderToOrder = useCallback((dbOrder: any, orderItems: any[] = []): Order => {
    const items = orderItems
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
      items,
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
      createdAt: new Date(dbOrder.created_at),
      userId: dbOrder.user_id
    };
  }, []);

  // Fetch user's own orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingOrders(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
      }

      const mappedOrders = ordersData.map(dbOrder => 
        mapDbOrderToOrder(dbOrder, itemsData || [])
      );

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user, mapDbOrderToOrder]);

  // Fetch all orders (for admins)
  const fetchAllOrders = useCallback(async () => {
    if (!user || !isOwner) return;
    
    setIsLoadingOrders(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching all orders:', ordersError);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setAllOrders([]);
        return;
      }

      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
      }

      const mappedOrders = ordersData.map(dbOrder => 
        mapDbOrderToOrder(dbOrder, itemsData || [])
      );

      setAllOrders(mappedOrders);
    } catch (error) {
      console.error('Error in fetchAllOrders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user, isOwner, mapDbOrderToOrder]);

  // Subscribe to real-time order updates - use user.id in channel name to ensure uniqueness
  useEffect(() => {
    if (!user) return;

    const channelName = `orders-realtime-${user.id}`;
    
    // Remove any existing channel with the same name first
    const existingChannel = supabase.channel(channelName);
    supabase.removeChannel(existingChannel);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('Real-time order update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new;
            
            // Update user's orders
            setOrders(prev => prev.map(order => 
              order.id === updatedOrder.id 
                ? { ...order, status: updatedOrder.status as Order['status'], paymentMethod: updatedOrder.payment_method, paymentId: updatedOrder.payment_id }
                : order
            ));
            
            // Update all orders (for admins)
            setAllOrders(prev => prev.map(order => 
              order.id === updatedOrder.id 
                ? { ...order, status: updatedOrder.status as Order['status'], paymentMethod: updatedOrder.payment_method, paymentId: updatedOrder.payment_id }
                : order
            ));
          } else if (payload.eventType === 'INSERT') {
            // Refetch to get full order data with items - triggered inside callback, no need for deps
            fetchOrders();
            if (isOwner) {
              fetchAllOrders();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Only depend on user.id to prevent re-subscriptions

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setAllOrders([]);
    }
  }, [user, fetchOrders]);

  const createOrder = async (items: CartItem[], customerInfo: CustomerInfo, total: number): Promise<string> => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

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
    }

    const newOrder: Order = {
      id: orderData.id,
      items,
      total,
      customerInfo,
      status: 'pending',
      createdAt: new Date(orderData.created_at),
      userId: user.id
    };

    setOrders(prev => [newOrder, ...prev]);
    return orderData.id;
  };

  const processPayment = async (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking'): Promise<boolean> => {
    setIsProcessingPayment(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const paymentSuccessful = Math.random() > 0.1;
      
      if (paymentSuccessful) {
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
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

        // Local state will be updated via real-time subscription
        return true;
      } else {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
        
        return false;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
    
    // Local state will be updated via real-time subscription
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId) || 
           allOrders.find(order => order.id === orderId);
  };

  return (
    <PaymentContext.Provider value={{
      orders,
      allOrders,
      isProcessingPayment,
      isLoadingOrders,
      createOrder,
      processPayment,
      updateOrderStatus,
      getOrderById,
      fetchOrders,
      fetchAllOrders
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
