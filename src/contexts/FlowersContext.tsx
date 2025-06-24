
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialFlowers, Flower } from '@/data/flowersData';

interface FlowersContextType {
  flowers: Flower[];
  updateFlower: (id: string, updates: Partial<Flower>) => void;
  addFlower: (flower: Omit<Flower, 'id'>) => void;
  deleteFlower: (id: string) => void;
}

const FlowersContext = createContext<FlowersContextType | undefined>(undefined);

export const useFlowers = () => {
  const context = useContext(FlowersContext);
  if (!context) {
    throw new Error('useFlowers must be used within a FlowersProvider');
  }
  return context;
};

interface FlowersProviderProps {
  children: ReactNode;
}

export const FlowersProvider = ({ children }: FlowersProviderProps) => {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);

  const updateFlower = (id: string, updates: Partial<Flower>) => {
    setFlowers(prev => prev.map(flower => 
      flower.id === id ? { ...flower, ...updates } : flower
    ));
  };

  const addFlower = (newFlower: Omit<Flower, 'id'>) => {
    const id = Date.now().toString();
    setFlowers(prev => [...prev, { ...newFlower, id }]);
  };

  const deleteFlower = (id: string) => {
    setFlowers(prev => prev.filter(flower => flower.id !== id));
  };

  return (
    <FlowersContext.Provider value={{
      flowers,
      updateFlower,
      addFlower,
      deleteFlower
    }}>
      {children}
    </FlowersContext.Provider>
  );
};
