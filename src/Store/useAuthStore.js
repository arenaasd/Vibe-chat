import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client'

const BASE_URL = "https://chat-app-backend-roan-three.vercel.app"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningup: false,
    isLogingin: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            get().connectSocket()
        } catch (error) {
            console.error("Error in checkAuth:", error.response?.data || error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningup: true })
        try {
            const res = await axiosInstance.post("/auth/signin", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");

            get().connectSocket();
        } catch (error) {
            console.error("Error in signup:", error.response?.data || error.message);
            toast.error("Something went wrong");
        } finally {
            set({ isSigningup: false });
        }
    },

    login: async (data) => {
        set({ isLogingin: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            console.error("Error in login:", error.response?.data || error.message);
            toast.error("Something went wrong");
        } finally {
            set({ isLogingin: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success('Logged out successfully');
            get().disconnectSocket();
        } catch (error) {
            console.error("Error in logout:", error.response?.data || error.message);
            toast.error("Something went wrong");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Update profile successfully");
        } catch (error) {
            console.error("Error in update profile:", error.response?.data || error.message);
            toast.error("Something went wrong");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}));
