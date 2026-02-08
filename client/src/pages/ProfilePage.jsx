import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // ⛔ Prevent crash on refresh
  if (!authUser) return null;

  const [selectedImg, setSelectedImg] = useState(null);
  const [preview, setPreview] = useState(authUser.profilePic || "");
  const [fullName, setFullName] = useState(authUser.fullName || "");
  const [bio, setBio] = useState(authUser.bio || "");

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!selectedImg) return;

    const objectUrl = URL.createObjectURL(selectedImg);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImg]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // No image change
    if (!selectedImg) {
      await updateProfile({ fullName, bio });
      navigate("/");
      return;
    }

    // Image update
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      await updateProfile({
        profilePic: reader.result,
        fullName,
        bio,
      });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>

          {/* ================= AVATAR ================= */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={preview || assets.avatar_icon}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            Upload profile image
          </label>

          <input
            type="text"
            required
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            required
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* ================= PREVIEW ================= */}
        <img
          src={preview || assets.logo_icon}
          alt="preview"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
