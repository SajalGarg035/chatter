import express from "express";
import authenticate from "../middlewares/auth.middle.js"; // Corrected middleware import
import { getMessages, 
    getUsersForSidebar, 
    sendMessage, 
    upload,
    uploadFiles,
    uploadBase64 } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", authenticate, getUsersForSidebar);
router.get("/:id", authenticate, getMessages);
router.post("/send/:id", authenticate, sendMessage);



// Route for sending a message with attachments
router.post("/send/:id/with-files", authenticate, upload.array('files', 5), sendMessage);

// Route for uploading files separately to Cloudinary
router.post("/upload", authenticate, upload.array('files', 5), uploadFiles);

// Route for uploading base64 encoded files directly
router.post("/upload-base64", authenticate, uploadBase64);

export default router;