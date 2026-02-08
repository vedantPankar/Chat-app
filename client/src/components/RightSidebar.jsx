import React, { useContext } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = ({ selectedUser, setSelectedUser }) => {
  const { logout, onlineUsers } = useContext(AuthContext);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-auto max-md:hidden">
      <img
        onClick={() => setSelectedUser(null)}
        src={assets.arrow_icon}
        alt="close"
        className="absolute top-5 right-5 w-5 cursor-pointer"
      />

      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 aspect-square rounded-full"
        />

        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {selectedUser.fullName}
        </h1>

        <p className="px-10 mx-auto text-gray-300">
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <hr className="border-white/50 my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[320px] overflow-y-auto grid grid-cols-2 gap-4 opacity-80">
          {imagesDummyData.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded overflow-hidden"
            >
              <img
                src={url}
                alt=""
                className="w-full h-auto rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-purple-400 to-violet-600 text-white text-sm py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
