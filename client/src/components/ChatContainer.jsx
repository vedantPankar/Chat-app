import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selectedUser, messagesDummyData.length]);

  return selectedUser ? (
    <div className="flex h-full max-h-full flex-col overflow-hidden backdrop-blur-lg">
      {/* header */}
      <div className="mx-3 flex items-center gap-3 border-b border-stone-500 py-3">
        <img
          src={assets.profile_martin}
          alt=""
          className="h-8 w-8 rounded-full"
        />
        <p className="flex flex-1 items-center gap-2 text-lg text-white">
          Martin Johnson
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="max-w-7 md:hidden"
        />
        <img src={assets.help_icon} alt="" className="max-w-5 max-md:hidden" />
      </div>

      {/* chat area */}
      <div className="flex flex-1 flex-col overflow-y-auto p-3 pb-4">
        {messagesDummyData.map((msg, index) => {
          const isMe = msg.senderId === "680f50e4f10f3cd28382ecf9";

          return (
            <div
              key={index}
              className={`mb-2 flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Left side (received) avatar + message */}
              {!isMe && (
                <>
                  <div className="text-center text-xs">
                    <img
                      src={assets.profile_martin}
                      alt=""
                      className="w-7 rounded-full"
                    />
                    <p className="text-gray-500">
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt=""
                      className="mb-8 max-w-57.5 overflow-hidden rounded-lg border border-gray-700"
                    />
                  ) : (
                    <p className="mb-8 max-w-50 break-all rounded-lg bg-violet-500/30 p-2 text-white md:text-sm">
                      {msg.text}
                    </p>
                  )}
                </>
              )}

              {/* Right side (my) message + avatar */}
              {isMe && (
                <>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt=""
                      className="mb-8 max-w-57.5 overflow-hidden rounded-lg border border-gray-700"
                    />
                  ) : (
                    <p className="mb-8 max-w-50 break-all rounded-lg bg-violet-500/30 p-2 text-white md:text-sm">
                      {msg.text}
                    </p>
                  )}
                  <div className="text-center text-xs">
                    <img
                      src={assets.avatar_icon}
                      alt=""
                      className="w-7 rounded-full"
                    />
                    <p className="text-gray-500">
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className="flex items-center gap-3 p-3">
        <div className="flex flex-1 items-center rounded-full bg-gray-100/12 px-3">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
