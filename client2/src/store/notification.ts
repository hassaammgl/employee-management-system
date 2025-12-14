/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { getErrorMessage } from "@/utils/zustandError";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  user?: string;
}

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api/notifications` : "/api/notifications",
  withCredentials: true,
});

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/");
      set({ isLoading: false, notifications: data.data });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
      await api.patch(`/${id}`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
    }
  },

  markAllAsRead: async () => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
      await api.patch("/mark-all-read");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
    }
  },

  deleteNotification: async (id) => {
    try {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
      await api.delete(`/${id}`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
    }
  },
}));
