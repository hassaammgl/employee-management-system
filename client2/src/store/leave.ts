/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";
import { getErrorMessage } from "@/utils/zustandError";

export interface Leave {
    _id: string;
    employee: any; // Populated user or ID
    startDate: string;
    endDate: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    type: "sick" | "casual" | "annual" | "other";
    createdAt: string;
}

interface LeaveState {
    leaves: Leave[];
    isLoading: boolean;
    error: string | null;
    fetchMyLeaves: () => Promise<void>;
    fetchAllLeaves: () => Promise<void>;
    applyLeave: (data: {
        startDate: string;
        endDate: string;
        reason: string;
        type: string;
    }) => Promise<void>;
    updateLeaveStatus: (id: string, status: string) => Promise<void>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || "";
const api = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api/leaves` : "/api/leaves",
    withCredentials: true,
});

export const useLeaveStore = create<LeaveState>((set, get) => ({
    leaves: [],
    isLoading: false,
    error: null,

    fetchMyLeaves: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/my-leaves");
            set({ isLoading: false, leaves: data.data });
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchAllLeaves: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/");
            set({ isLoading: false, leaves: data.data });
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
        }
    },

    applyLeave: async (leaveData) => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/", leaveData);
            await get().fetchMyLeaves();
            set({ isLoading: false });
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    updateLeaveStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            await api.patch(`/${id}/status`, { status });
            // Helper to update local state optimistically or re-fetch
            const leaves = get().leaves.map((l) =>
                l._id === id ? { ...l, status: status as any } : l
            );
            set({ isLoading: false, leaves });
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },
}));
