/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { getErrorMessage } from "@/utils/zustandError";

export interface Activity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "employee" | "department" | "profile" | "leave" | "general";
  metadata?: any;
}

interface ActivityStore {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api/activities` : "/api/activities",
  withCredentials: true,
});

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/");
      set({ isLoading: false, activities: data.data });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
