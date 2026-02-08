import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  /* ================= GET USERS ================= */
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    }
  };

  /* ================= GET MESSAGES ================= */
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  };

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);

        try {
          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } catch {}
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, axios]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setMessages,
        setUnseenMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
