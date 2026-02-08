import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  /* ================= CHECK AUTH ================= */
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= TOKEN EFFECT ================= */
  useEffect(() => {
    if (!token) return;

    axios.defaults.headers.common["token"] = token;
    checkAuth();
  }, [token]);

  /* ================= SOCKET CLEANUP ================= */
  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  /* ================= LOGIN / SIGNUP ================= */
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);

        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("token", data.token);

        connectSocket();
        toast.success(data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    setSocket(null);

    toast.success("Logged out successfully");
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Profile update failed";
      toast.error(message);
    }
  };

  /* ================= SOCKET ================= */
  const connectSocket = () => {
    if (!token || socket?.connected) return;

    const newSocket = io(backendUrl, {
      auth: { token },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
