
import React, { createContext, useContext, useState } from 'react';

interface EnquiryContextType {
  isEnquiryOpen: boolean;
  setIsEnquiryOpen: (open: boolean) => void;
  selectedProduct: string | null;
  setSelectedProduct: (productId: string | null) => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <EnquiryContext.Provider value={{
      isEnquiryOpen,
      setIsEnquiryOpen,
      selectedProduct,
      setSelectedProduct
    }}>
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};
