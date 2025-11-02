import type React from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type UIState = {
  // Sidebar state
  isSidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void

  // Modal state
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  openModal: (content: React.ReactNode) => void
  closeModal: () => void

  // Loading state
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // Toast/notification state
  notifications: Array<{
    id: string
    message: string
    type: "success" | "error" | "info" | "warning"
  }>
  addNotification: (message: string, type: "success" | "error" | "info" | "warning") => void
  removeNotification: (id: string) => void
}

/**
 * UI Store - Manages global UI state
 * Handles sidebar, modals, loading states, and notifications
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),

      // Modal
      isModalOpen: false,
      modalContent: null,
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),

      // Loading
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Notifications
      notifications: [],
      addNotification: (message, type) =>
        set((state) => ({
          notifications: [...state.notifications, { id: Date.now().toString(), message, type }],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
)
