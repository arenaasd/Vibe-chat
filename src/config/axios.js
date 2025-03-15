import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-backend-roan-three.vercel.app/api",
    withCredentials: true
})