import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../server.js";

/* ================= GET USERS FOR SIDEBAR ================= */
export const getUsersForSidebar = async (req, res) => {
  try {
    const myId = req.user._id;

    const users = await User.find({ _id: { $ne: myId } }).select("-password");

    const unseenMessages = {};

    await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          senderId: user._id,
          recieverId: myId,
          seen: false,
        });

        if (count > 0) {
          unseenMessages[user._id] = count;
        }
      })
    );

    return res.status(200).json({
      success: true,
      users,
      unseenMessages,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* ================= GET MESSAGES ================= */
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUser } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: selectedUser },
        { senderId: selectedUser, recieverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // mark messages as seen
    await Message.updateMany(
      {
        senderId: selectedUser,
        recieverId: myId,
        seen: false,
      },
      { $set: { seen: true } }
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/* ================= MARK MESSAGE AS SEEN ================= */
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
};

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = null;

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      text: text || "",
      image: imageUrl,
      seen: false,
    });

    // emit socket event if receiver is online
    const recieverSocketId = userSocketMap[recieverId];
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
