
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [flowers, setFlowers] = useState<Flower[]>(() => {
    // Load from localStorage on startup
    const savedFlowers = localStorage.getItem('dailyFlowers');
    if (savedFlowers) {
      try {
        return JSON.parse(savedFlowers);
      } catch (error) {
        console.error('Error loading saved flowers:', error);
        return initialFlowers;
      }
    }
    return initialFlowers;
  });

  // Save to localStorage whenever flowers change
  useEffect(() => {
    try {
      // Create a version without File objects for storage
      const flowersForStorage = flowers.map(flower => ({
        ...flower,
        imageFile: null // Don't store File objects
      }));
      localStorage.setItem('dailyFlowers', JSON.stringify(flowersForStorage));
      console.log('Flowers saved to localStorage:', flowersForStorage.length, 'products');
    } catch (error) {
      console.error('Error saving flowers to localStorage:', error);
    }
  }, [flowers]);

  const updateFlower = (id: string, updates: Partial<Flower>) => {
    setFlowers(prev => prev.map(flower => 
      flower.id === id ? { ...flower, ...updates } : flower
    ));
    console.log('Flower updated:', id, updates);
  };

  const addFlower = (newFlower: Omit<Flower, 'id'>) => {
    const id = Date.now().toString();
    const flowerWithId = { ...newFlower, id };
    setFlowers(prev => [...prev, flowerWithId]);
    console.log('New flower added:', flowerWithId);
  };

  const deleteFlower = (id: string) => {
    setFlowers(prev => {
      const flowerToDelete = prev.find(f => f.id === id);
      if (flowerToDelete?.imageFileUrl && flowerToDelete.imageFileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(flowerToDelete.imageFileUrl);
      }
      return prev.filter(flower => flower.id !== id);
    });
    console.log('Flower deleted:', id);
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
