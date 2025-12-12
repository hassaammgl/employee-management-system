import { create } from "zustand";
import axiosInstance from "../utils/axios.ts";
import type { User } from "@/types";

export interface Email {
    _id: string;
    sender: User;
    recipient: User;
    subject: string;
    body: string;
    isRead: boolean;
    createdAt: string;
}

interface EmailState {
    inbox: Email[];
    sent: Email[];
    isLoading: boolean;
    error: string | null;

    fetchInbox: () => Promise<void>;
    fetchSent: () => Promise<void>;
    sendEmail: (recipientId: string, subject: string, body: string) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteEmail: (id: string) => Promise<void>;
}

export const useEmailStore = create<EmailState>((set, get) => ({
    inbox: [],
    sent: [],
    isLoading: false,
    error: null,

    fetchInbox: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get("/emails/inbox");
            set({ inbox: data.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch inbox", isLoading: false });
        }
    },

    fetchSent: async () => {
        set({ isLoading: true });
        try {
            const { data } = await axiosInstance.get("/emails/sent");
            set({ sent: data.data, isLoading: false });
        } catch (error) {
            set({ error: "Failed to fetch sent emails", isLoading: false });
        }
    },

    sendEmail: async (recipientId, subject, body) => {
        try {
            const { data } = await axiosInstance.post("/emails/send", {
                recipientId,
                subject,
                body,
            });
            // Don't necessarily need to update sent list immediately unless we are looking at it, but good practice.
            const { sent } = get();
            set({ sent: [data.data, ...sent] });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    markAsRead: async (id) => {
        try {
            await axiosInstance.put(`/emails/${id}/read`);
            const { inbox } = get();
            set({
                inbox: inbox.map((email) =>
                    email._id === id ? { ...email, isRead: true } : email
                ),
            });
        } catch (error) {
            console.error(error);
        }
    },

    deleteEmail: async (id) => {
        try {
            await axiosInstance.delete(`/emails/${id}`);
            const { inbox, sent } = get();
            set({
                inbox: inbox.filter((e) => e._id !== id),
                sent: sent.filter((e) => e._id !== id),
            });
        } catch (error) {
            console.error(error);
        }
    },
}));
