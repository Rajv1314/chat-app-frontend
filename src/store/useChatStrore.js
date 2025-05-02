import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./userAuthStore";
const token = localStorage.getItem("token");
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: null,
  isMessagesLoading: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/message/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        set({ users: response.data.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messages: response.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        set({ messages: [...messages, response.data.data] });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  
  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
