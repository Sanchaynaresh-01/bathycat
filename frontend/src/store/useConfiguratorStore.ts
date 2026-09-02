import { create } from 'zustand';
import { Product, Component, ComponentCategory } from '@/types';

interface ConfiguratorState {
  selectedProduct: Product | null;
  categories: ComponentCategory[];
  selectedComponents: Record<number, Component[]>; // category_id -> components[]
  totalPrice: number;
  
  setCategories: (categories: ComponentCategory[]) => void;
  setProduct: (product: Product) => void;
  addComponent: (categoryId: number, component: Component, isMultipleAllowed: boolean) => void;
  removeComponent: (categoryId: number, componentId: number) => void;
  resetConfiguration: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  selectedProduct: null,
  categories: [],
  selectedComponents: {},
  totalPrice: 0,

  setCategories: (categories) => set({ categories }),
  
  setProduct: (product) => {
    set((state) => {
      // Recalculate total price
      let newTotal = product.base_price;
      Object.values(state.selectedComponents).flat().forEach((c) => {
        newTotal += c.price_modifier;
      });
      return { selectedProduct: product, totalPrice: newTotal };
    });
  },

  addComponent: (categoryId, component, isMultipleAllowed) => {
    set((state) => {
      const currentSelection = state.selectedComponents[categoryId] || [];
      
      // If not multiple allowed, replace existing
      let newSelection = [];
      if (isMultipleAllowed) {
        // Prevent exact duplicates
        if (currentSelection.find((c) => c.id === component.id)) {
            return state;
        }
        newSelection = [...currentSelection, component];
      } else {
        newSelection = [component];
      }

      const newSelectedComponents = {
        ...state.selectedComponents,
        [categoryId]: newSelection,
      };

      // Recalculate price
      let newTotal = state.selectedProduct?.base_price || 0;
      Object.values(newSelectedComponents).flat().forEach((c) => {
        newTotal += c.price_modifier;
      });

      return {
        selectedComponents: newSelectedComponents,
        totalPrice: newTotal,
      };
    });
  },

  removeComponent: (categoryId, componentId) => {
    set((state) => {
      const currentSelection = state.selectedComponents[categoryId] || [];
      const newSelection = currentSelection.filter((c) => c.id !== componentId);

      const newSelectedComponents = {
        ...state.selectedComponents,
        [categoryId]: newSelection,
      };

      // Recalculate price
      let newTotal = state.selectedProduct?.base_price || 0;
      Object.values(newSelectedComponents).flat().forEach((c) => {
        newTotal += c.price_modifier;
      });

      return {
        selectedComponents: newSelectedComponents,
        totalPrice: newTotal,
      };
    });
  },

  resetConfiguration: () => set({ selectedProduct: null, selectedComponents: {}, totalPrice: 0 }),
}));
