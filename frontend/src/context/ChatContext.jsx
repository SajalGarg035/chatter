import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const ChatContext = createContext();
const API_URL = 'http://localhost:5000';

export const ChatProvider = ({ children }) => {
  const { token, user, initialCheckDone } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    let socketInstance = null;
    
    // Only try to connect if we have completed the auth check and have a user and token
    if (initialCheckDone && user && token) {
      try {
        console.log("Setting up socket connection with token");
        
        socketInstance = io(API_URL, {
          auth: { token },
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        });
        
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          setSocketConnected(true);
        });
        
        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setSocketConnected(false);
        });
        
        setSocket(socketInstance);
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    }
    
    return () => {
      if (socketInstance) {
        console.log('Disconnecting socket');
        socketInstance.disconnect();
      }
    };
  }, [user, token, initialCheckDone]); // Only re-run when these dependencies change

  // Socket event listeners
  useEffect(() => {
    if (socket && socketConnected) {
      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socket.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });
      
      return () => {
        socket.off('getOnlineUsers');
        socket.off('newMessage');
      };
    }
  }, [socket, socketConnected]);

  // Use useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/message/users`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch users only when user or token changes
  useEffect(() => {
    if (initialCheckDone && user && token) {
      fetchUsers();
    }
  }, [initialCheckDone, user, token, fetchUsers]);

  const fetchMessages = useCallback(async (userId) => {
    if (!token || !userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/message/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sendMessage = useCallback(async (content, isAnonymous = true) => {
    if (!token || !selectedUser) return;
    console.log("sendMessage: selectedUser", selectedUser);
    try {
      // Use socket if available, otherwise fall back to REST API
      if (socket && socketConnected) {
        socket.emit('sendMessage', {
          recipientId: selectedUser._id,
          content,
          isAnonymous
        });
        
        const newMessage = {
          _id: Date.now().toString(),
          sender: user.id || user._id,
          recipient: selectedUser._id,
          content,
          isAnonymous,
          createdAt: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      } else {
        const response = await fetch(`${API_URL}/api/message/send/${selectedUser._id}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ content, isAnonymous })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send message');
        
        setMessages(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [token, selectedUser, socket, socketConnected, user]);

  const selectUser = useCallback(async (user) => {
    setSelectedUser(user);
    if (user && user._id) {
      await fetchMessages(user._id);
    }
  }, [fetchMessages]);

  const value = {
    users,
    messages,
    selectedUser,
    onlineUsers,
    loading,
    socketConnected,
    fetchUsers,
    fetchMessages,
    sendMessage,
    selectUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};