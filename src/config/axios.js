import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chat-app-backend-theta-seven.vercel.app/api",
    withCredentials: true
})