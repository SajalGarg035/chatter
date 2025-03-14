import express from 'express';
import cors from 'cors';
import auth from './routes/auth.route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import message from './routes/message.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectdb from './lib/db.js';
import jwt from 'jsonwebtoken';
import Message from './models/message.model.js'; // Import the Message model
import User from './models/user.model.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', auth); 
app.use('/api/message', message);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track online users
const onlineUsers = new Map(); // userId -> socketId

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);
  
  // Broadcast online users to all connected clients
  io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));

  // Handle new message
  // Handle new message
socket.on('sendMessage', async (messageData) => {
  try {
    const { recipientId, content, isAnonymous } = messageData;
    
    // Create and save the message to database
    const newMessage = new Message({
      sender: socket.userId,
      receiver: recipientId,  // Changed from recipient to receiver
      content,
      isAnonymous,
      createdAt: new Date()
    });
    
    const savedMessage = await newMessage.save();
    const populatedMessage = {
      ...savedMessage._doc,
      sender: await User.findById(socket.userId).select('name email profilepic'),
      receiver: await User.findById(recipientId).select('name email profilepic')
    };
    // If recipient is online, send them the message
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', populatedMessage);
    }
    
    // Also send back to sender so UI updates
    socket.emit('messageSent', populatedMessage);
  } catch (error) {
    console.error('Error handling message:', error);
    socket.emit('messageError', { error: error.message });
  }
});
  
  // Handle read receipts
  socket.on('messageRead', async ({ messageId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { read: true });
      
      const message = await Message.findById(messageId);
      const senderSocketId = onlineUsers.get(message.sender.toString());
      
      if (senderSocketId) {
        io.to(senderSocketId).emit('messageReadUpdate', { messageId });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', ({ recipientId, isTyping }) => {
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('userTyping', { 
        userId: socket.userId, 
        isTyping 
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    onlineUsers.delete(socket.userId);
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Chat server running');
});

connectdb().then(() => {
  console.log('Connected to db');
  
  // Use httpServer instead of app.listen
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});