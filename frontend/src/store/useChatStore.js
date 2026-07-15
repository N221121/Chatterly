import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,
    typingUser: null,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data })
        }
        catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: false });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data })
        }
        catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);

            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text || "",
            image: messageData.image || "",
            voice: messageData.voice || "",   // <-- ADD THIS
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        set(state => ({
            messages: [...state.messages, optimisticMessage],
        }));

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            set(state => ({
                messages: state.messages.map(msg =>
                    msg._id === tempId ? res.data : msg
                ),
            }));

        } catch (error) {

            set(state => ({
                messages: state.messages.filter(msg => msg._id !== tempId),
            }));

            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();

        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        // Receive new messages
        socket.on("newMessage", (newMessage) => {
            const currentMessages = get().messages;

            set({
                messages: [...currentMessages, newMessage],
            });

            if (isSoundEnabled) {
                const notificationSound = new Audio("/sounds/notify.mp3");

                notificationSound.currentTime = 0;

                notificationSound.play().catch((e) => {
                    console.log(e);
                });
            }
        });

        // User started typing
        socket.on("userTyping", ({ senderId }) => {
            if (senderId === selectedUser._id) {
                set({
                    typingUser: senderId,
                });
            }
        });

        // User stopped typing
        socket.on("userStoppedTyping", ({ senderId }) => {
            if (senderId === selectedUser._id) {
                set({
                    typingUser: null,
                });
            }
        });
        socket.on("messageDeleted", (updatedMessage) => {
            set({
                messages: get().messages.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ),
            });
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userStoppedTyping");
        socket.off("messageDeleted");
    },
    setTyping: (value) => set({ isTyping: value }),

    sendTyping: () => {
        const socket = useAuthStore.getState().socket;
        const { selectedUser } = get();

        if (!socket || !selectedUser) return;

        socket.emit("typing", {
            receiverId: selectedUser._id,
        });
    },

    sendStopTyping: () => {
        const socket = useAuthStore.getState().socket;
        const { selectedUser } = get();

        if (!socket || !selectedUser) return;

        socket.emit("stopTyping", {
            receiverId: selectedUser._id,
        });
    },
    deleteMessage: async (messageId) => {
        try {
            const res = await axiosInstance.delete(`/messages/${messageId}`);

            set({
                messages: get().messages.map((msg) =>
                    msg._id === messageId ? res.data : msg
                ),
            });

            toast.success("Message deleted");
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    },
}))