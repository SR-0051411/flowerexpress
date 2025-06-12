
import React, { createContext, useContext, useState } from 'react';

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled';
  paymentId?: string;
  createdAt: Date;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tiedLength?: number; // Length in feet for tied flowers
  ballQuantity?: number; // Number of flower balls
}

interface PaymentContextType {
  orders: Order[];
  isProcessingPayment: boolean;
  createOrder: (items: CartItem[], customerInfo: CustomerInfo, total: number) => Promise<string>;
  processPayment: (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking') => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const createOrder = async (items: CartItem[], customerInfo: CustomerInfo, total: number): Promise<string> => {
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newOrder: Order = {
      id: orderId,
      items,
      total,
      customerInfo,
      status: 'pending',
      createdAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
    return orderId;
  };

  const processPayment = async (orderId: string, paymentMethod: 'card' | 'upi' | 'netbanking'): Promise<boolean> => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would integrate with Stripe or other payment gateway
      const paymentSuccessful = Math.random() > 0.1; // 90% success rate for demo
      
      if (paymentSuccessful) {
        const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        updateOrderStatus(orderId, 'paid');
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, paymentId, status: 'paid' as const }
            : order
        ));
        return true;
      } else {
        updateOrderStatus(orderId, 'cancelled');
        return false;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      updateOrderStatus(orderId, 'cancelled');
      return false;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
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
      createOrder,
      processPayment,
      updateOrderStatus,
      getOrderById
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
