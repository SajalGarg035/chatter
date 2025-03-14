import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';

import EmojiPicker from 'emoji-picker-react';

function MessageInput() {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const { sendMessage, selectedUser } = useChat();
  const fileInputRef = useRef(null);
  const API_URL = 'http://localhost:5000'; // or your backend URL

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Create previews for images
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews(prev => [...prev, {
              id: Date.now() + Math.random().toString(),
              name: file.name,
              preview: e.target.result,
              type: 'image'
            }]);
          };
          reader.readAsDataURL(file);
        } else {
          // Non-image files just show name
          setPreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: file.type,
            size: file.size
          }]);
        }
      });
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!message.trim() && files.length === 0) || !selectedUser || sending) return;

    try {
      setSending(true);
      
      if (files.length > 0) {
        // Send message with files
        const formData = new FormData();
        formData.append('content', message);
        formData.append('isAnonymous', isAnonymous);
        
        files.forEach(file => {
          formData.append('files', file);
        });
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/message/send/${selectedUser._id}/with-files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send message with files');
        }
        
        // Clear files after sending
        setFiles([]);
        setPreviews([]);
      } else {
        // Send text-only message
        await sendMessage(message.trim(), isAnonymous);
      }
      
      setMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] py-3 px-4 border-t border-gray-200">
      {/* File previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto p-2">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group">
              {preview.type === 'image' ? (
                <div className="w-20 h-20 rounded overflow-hidden">
                  <img src={preview.preview} alt={preview.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-xs text-center px-1">{preview.name}</span>
                </div>
              )}
              <button 
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Emoji button */}
        <button 
          type="button" 
          className="p-2 text-gray-500 rounded-full hover:bg-gray-200"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        {/* Anonymous toggle */}
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`p-2 rounded-full ${isAnonymous ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:bg-gray-200'}`}
          title={isAnonymous ? "Anonymous mode on" : "Anonymous mode off"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            {!isAnonymous && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />}
          </svg>
        </button>
        
        {/* Attachment button */}
        <button 
          type="button" 
          className="p-2 text-gray-500 rounded-full hover:bg-gray-200"
          onClick={() => fileInputRef.current.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
        </button>
        
        {/* Message input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full rounded-full pl-4 pr-10 py-2 focus:outline-none"
            disabled={sending}
          />
        </div>
        
        {/* Send/Mic button */}
        <button
          type="submit"
          disabled={sending || (!message.trim() && files.length === 0)}
          className={`p-2 rounded-full ${message.trim() || files.length > 0 ? 'bg-[#00a884] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
        >
          {message.trim() || files.length > 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;