
import { create } from 'zustand'

// Zustand store interface
interface UserStore {
  selectedUserId: number | null
  setSelectedUserId: (id: number) => void
}

// Zustand store implementation
export const useUserStore = create<UserStore>((set) => ({
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
}))
