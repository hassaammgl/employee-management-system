import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User, Role } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  register: (payload: { name: string; fatherName: string; email: string; password: string; role: Role; employeeId?: string; }) => Promise<boolean>;
  me: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password, _role) => {
        try {
          const { data } = await api.post("/auth/login", { email, password });
          const apiUser = data?.data as any;
          const user = apiUser ? ({
            id: apiUser._id ?? apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            role: apiUser.role,
            employeeId: apiUser.employeeId ?? undefined,
            password: "",
          } as User) : null;
          set({ user, isAuthenticated: !!user });
          return true;
        } catch {
          return false;
        }
      },
      register: async (payload) => {
        try {
          const { data } = await api.post("/auth/register", payload);
          const apiUser = data?.data as any;
          const user = apiUser ? ({
            id: apiUser._id ?? apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            role: apiUser.role,
            employeeId: apiUser.employeeId ?? undefined,
            password: "",
          } as User) : null;
          set({ user, isAuthenticated: !!user });
          return true;
        } catch {
          return false;
        }
      },
      me: async () => {
        try {
          const { data } = await api.get("/auth/me");
          const apiUser = data?.data as any;
          const user = apiUser ? ({
            id: apiUser._id ?? apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            role: apiUser.role,
            employeeId: apiUser.employeeId ?? undefined,
            password: "",
          } as User) : null;
          set({ user, isAuthenticated: !!user });
        } catch {
          // try refresh once
          try {
            await api.post("/auth/refresh");
            const { data } = await api.get("/auth/me");
            const apiUser = data?.data as any;
            const user = apiUser ? ({
              id: apiUser._id ?? apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              role: apiUser.role,
              employeeId: apiUser.employeeId ?? undefined,
              password: "",
            } as User) : null;
            set({ user, isAuthenticated: !!user });
          } catch {
            set({ user: null, isAuthenticated: false });
          }
        }
      },
      logout: async () => {
        try {
          await api.post("/auth/logout");
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
    }
  )
);


