import { create } from 'zustand';

const useAppStore = create((set) => ({
  tasks: [],
  projects: [],
  notifications: [],

  setTasks: (tasks) => set({ tasks }),
  setProjects: (projects) => set({ projects }),

  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 50) })),

  updateTaskInStore: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === taskId ? { ...t, ...updates } : t)),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));

export default useAppStore;
