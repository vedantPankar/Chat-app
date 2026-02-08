import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollRef = useRef(null);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  /* ================= SELECT IMAGE ================= */
  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Send image if exists
    if (selectedImage) {
      setUploading(true);

      try {
        const compressed = await imageCompression(selectedImage, {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        const reader = new FileReader();
        reader.readAsDataURL(compressed);

        reader.onloadend = async () => {
          await sendMessage({ image: reader.result });
          cleanupImage();
        };
      } catch {
        toast.error("Image upload failed");
        cleanupImage();
      }

      return;
    }

    // Send text
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const cleanupImage = () => {
    setUploading(false);
    setSelectedImage(null);
    setImagePreview(null);
    setInput("");
  };

  /* ================= EMPTY STATE ================= */
  if (!selectedUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-lg">
        <img src={assets.logo_icon} alt="" className="max-w-16" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden backdrop-blur-lg">
      {/* ================= HEADER ================= */}
      <div className="mx-3 flex items-center gap-3 border-b border-stone-500 py-3">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <p className="flex flex-1 items-center gap-2 text-lg text-white">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="h-2 w-2 rounded-full bg-green-500" />
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="max-w-7 cursor-pointer md:hidden"
        />
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 overflow-y-auto p-3 pb-4 min-h-0">
        {messages.map((msg) => {
          const isMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              className={`mb-2 flex gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-56 rounded-lg border border-gray-700"
                />
              ) : (
                <p className="bg-violet-500/30 p-2 rounded-lg text-white">
                  {msg.text}
                </p>
              )}
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* ================= INPUT ================= */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-stone-600"
      >
        {/* IMAGE PREVIEW INSIDE INPUT */}
        {imagePreview && (
          <div className="mb-2 relative w-24">
            <img
              src={imagePreview}
              className="rounded-lg border border-gray-600"
            />
            <button
              type="button"
              onClick={cleanupImage}
              className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center rounded-full bg-gray-100/12 px-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-transparent p-3 text-sm text-white outline-none"
              disabled={uploading}
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={handleSelectImage}
            />

            <label htmlFor="image">
              <img src={assets.gallery_icon} className="w-5 cursor-pointer" />
            </label>
          </div>

          <button type="submit" disabled={uploading}>
            <img src={assets.send_button} className="w-7 cursor-pointer" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
