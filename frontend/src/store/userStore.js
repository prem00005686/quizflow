import { create } from 'zustand'

export const useUserStore = create((set) => ({
  profile: null,
  streak: 0,
  totalXP: 0,
  level: 1,
  
  updateProfile: (profile) => set({ profile }),
  updateStreak: (streak) => set({ streak }),
  addXP: (xp) => set((state) => ({ totalXP: state.totalXP + xp }))
}))
