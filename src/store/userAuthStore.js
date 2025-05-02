import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/getuserinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ authUser: response.data });
      get().connectedSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signupApi: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/auth/signup", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      if (response.status == 201) {
        set({ authUser: response.data.data });
        toast.success(response.data.message);
        get().connectedSocket();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  loginApi: async (data) => {
    try {
      set({ isLoggingIn: true });
      let response = await axiosInstance.post("/auth/login", data);
      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        get().checkAuth();
        toast.success(response.data.message);
        get().connectedSocket();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    set({ authUser: null });

    get().disconnectedSocket();
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const response = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        set({ authUser: response.data.data });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectedSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connect) return;
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
  disconnectedSocket: () => {
    if (get().socket?.connect) get().socket.disconnect();
  },
}));
