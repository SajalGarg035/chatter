import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"; // Make sure this path matches your Cloudinary setup
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_attachments",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx", "mp3", "mp4"],
    resource_type: "auto"
  }
});

// Set up the upload handler
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } 
  catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password"); 
    
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const sendMessage = async (req, res) => {
  try {
    console.log(req.params);
    const { id: receiverId } = req.params;
  
    const senderId = req.user._id;
    const { content, isAnonymous = true } = req.body;
    
    
    // Get file URLs from uploaded files through Cloudinary
    const attachments = req.files ? req.files.map(file => file.path) : [];
    
    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      attachments,
      isAnonymous
    });
    
    await newMessage.save();
    
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Upload files to Cloudinary separately
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    // Return the Cloudinary URLs
    const fileUrls = req.files.map(file => file.path);
    return res.status(200).json({ files: fileUrls });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ message: "Error uploading files", error: error.message });
  }
};

// If you need a direct upload method for base64 encoded files/images
export const uploadBase64 = async (req, res) => {
  try {
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: "No file data provided" });
    }
    
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "chat_attachments",
      resource_type: "auto"
    });
    
    return res.status(200).json({ 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });
  } catch (error) {
    console.error("Error uploading base64 file:", error);
    return res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};