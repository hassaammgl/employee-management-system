/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User, Role } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    employeeCode: string
  ) => Promise<boolean>;
  register: (payload: {
    name: string;
    fatherName: string;
    email: string;
    password: string;
    role: Role;
    employeeId?: string;
  }) => Promise<boolean>;
  me: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password, employeeCode) => {
        try {
          const { data } = await api.post("/auth/login", {
            email,
            password,
            employeeCode,
          });
          const apiUser = data?.data as any;
          const user = apiUser
            ? ({
                id: apiUser._id ?? apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                employeeId: apiUser.employeeId ?? undefined,
                password: "",
              } as User)
            : null;
          set({ user, isAuthenticated: !!user });
          if (user) {
            toast({
              title: "Login successful",
              description: `Welcome back, ${user.name}!`,
            });
          }
          return true;
        } catch {
          toast({
            title: "Login failed",
            description: "Invalid credentials.",
            variant: "destructive",
          });
          return false;
        }
      },
      register: async (payload) => {
        try {
          const { data } = await api.post("/auth/register", payload);
          const apiUser = data?.data as any;
          const user = apiUser
            ? ({
                id: apiUser._id ?? apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                employeeId: apiUser.employeeId ?? undefined,
                password: "",
              } as User)
            : null;
          set({ user, isAuthenticated: !!user });
          if (user) {
            toast({ title: "Account created", description: "Welcome aboard!" });
          }
          return true;
        } catch {
          toast({
            title: "Signup failed",
            description: "Please verify your details.",
            variant: "destructive",
          });
          return false;
        }
      },
      me: async () => {
        try {
          const { data } = await api.get("/auth/me");
          const apiUser = data?.data as any;
          const user = apiUser
            ? ({
                id: apiUser._id ?? apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                employeeId: apiUser.employeeId ?? undefined,
                password: "",
              } as User)
            : null;
          set({ user, isAuthenticated: !!user });
        } catch {
          // try refresh once
          try {
            await api.post("/auth/refresh");
            const { data } = await api.get("/auth/me");
            const apiUser = data?.data as any;
            const user = apiUser
              ? ({
                  id: apiUser._id ?? apiUser.id,
                  name: apiUser.name,
                  email: apiUser.email,
                  role: apiUser.role,
                  employeeId: apiUser.employeeId ?? undefined,
                  password: "",
                } as User)
              : null;
            set({ user, isAuthenticated: !!user });
            if (user) {
              toast({
                title: "Session restored",
                description: `Welcome back, ${user.name}!`,
              });
            }
          } catch {
            set({ user: null, isAuthenticated: false });
            toast({
              title: "Session expired",
              description: "Please sign in again.",
              variant: "destructive",
            });
          }
        }
      },
      logout: async () => {
        try {
          await api.post("/auth/logout");
          toast({
            title: "Logged out",
            description: "You have been signed out.",
          });
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
