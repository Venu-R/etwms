import { create } from 'zustand'

const useAppStore = create((set) => ({
  tasks: [],
  notifications: [],

  setTasks: (tasks) => set({ tasks }),

  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications].slice(0, 50),
    })),

  updateTaskInStore: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t._id === id ? { ...t, ...updates } : t
      ),
    })),
}))

export default useAppStore