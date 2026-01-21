import { create } from 'zustand';

interface CursorState {
  variant: 'default' | 'hover' | 'text' | 'hidden';
  color: string | null;
  text: string | null;
  setCursorVariant: (variant: 'default' | 'hover' | 'text' | 'hidden') => void;
  setCursorColor: (color: string | null) => void;
  setCursorText: (text: string | null) => void;
  resetCursor: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  variant: 'default',
  color: null,
  text: null,
  setCursorVariant: (variant) => set({ variant }),
  setCursorColor: (color) => set({ color }),
  setCursorText: (text) => set({ text }),
  resetCursor: () => set({ variant: 'default', color: null, text: null }),
}));
