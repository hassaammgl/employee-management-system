/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import type { Employee } from "@/types";
import { getErrorMessage } from "@/utils/zustandError";

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Partial<Employee>) => Promise<void>;
  updateEmployee: (
    id: string,
    updates: Partial<Employee> & { fatherName?: string }
  ) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api/employees` : "/api/employees",
  withCredentials: true,
});

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/", {
        headers: { "Cache-Control": "no-cache" },
      });
      set({ isLoading: false, employees: data.data });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  addEmployee: async (employee) => {
    try {
      set({ isLoading: true, error: null });

      const payload = {
        name: employee.name,
        jobTitle: employee.role,
        fatherName: employee.fatherName,
        email: employee.email,
        password: employee.password,
        department: employee.department,
        status: employee.status,
        joinDate: employee.joinDate,
        salary: employee.salary,
      };

      await api.post("/", payload);
      await get().fetchEmployees();
      set({ isLoading: false });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateEmployee: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await api.patch(`/${id}`, updates);
      await get().fetchEmployees();
      set({ isLoading: false });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteEmployee: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/${id}`);
      await get().fetchEmployees();
      set({ isLoading: false });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
