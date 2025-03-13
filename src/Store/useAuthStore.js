import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client'

const BASE_URL = "http://localhost:3000"

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
            console.error("Full Axios Error:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },



    signup: async (data) => {
        set({ isSigningup: true })
        try {
            const res = await axiosInstance.post("/auth/signin", data);
            set({ authUser: res.data })
            toast.success("Account created successfully");

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningup: false })
        }
    },

    login: async (data) => {
        set({ isLogingin: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data })
            toast.success("Logged in successfully");

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLogingin: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null })
            toast.success('Logged out successfully');
            get().disconnectSocket()
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data });
            toast.success("Update profile successfully")
        } catch (error) {
            console.log("error in update profile", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}))