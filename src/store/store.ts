import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IBearStore {
  bears: number;
  increasePopulation: () => void;
  decreasePopulation: () => void;
  removeAllBears: () => void;
}

export const useBearStore = create<IBearStore>()(
  persist(set => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    decreasePopulation: () => set((state) => ({ bears: state.bears - 1 }))
  }), {
    name: 'bear-storage'
  }))