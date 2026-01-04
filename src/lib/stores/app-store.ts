import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  homePageLoadCount: number
  hasInitialLoadCompleted: boolean
  incrementHomePageLoadCount: () => void
  setHasInitialLoadCompleted: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      homePageLoadCount: 0,
      hasInitialLoadCompleted: false,
      incrementHomePageLoadCount: () =>
        set((state) => ({ homePageLoadCount: state.homePageLoadCount + 1 })),
      setHasInitialLoadCompleted: (value) =>
        set({ hasInitialLoadCompleted: value }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
