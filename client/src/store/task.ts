/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { getErrorMessage } from "@/utils/zustandError";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api/tasks` : "/api/tasks",
  withCredentials: true,
});

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/");
      set({ isLoading: false, tasks: data.data });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  toggleTask: async (id, completed) => {
    try {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed } : t
        ),
      }));
      await api.patch(`/${id}`, { completed });
    } catch (err: any) {
      // Revert on failure could be added here
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
    }
  },

  addTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/", task);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      await api.delete(`/${id}`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
    }
  },
}));
