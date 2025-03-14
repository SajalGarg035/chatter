import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import MessageInput from './MessageInput';

function ChatWindow() {
  const { selectedUser, messages, loading } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  // Group messages by date for display
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.createdAt ? format(new Date(message.createdAt), 'MMMM d, yyyy') : 'Today';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // If no user is selected, show welcome screen
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center max-w-md p-8">
          <div className="w-64 h-64 mx-auto mb-6 bg-[#25d366] bg-opacity-10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-[#25d366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-gray-800 mb-3">Welcome to Anonymous Chat</h1>
          <p className="text-gray-600">
            Select a conversation to start messaging. All messages are encrypted and can be sent anonymously.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col bg-[#efeae2]">
      {/* Chat header - WhatsApp style */}
      <div className="bg-[#f0f2f5] py-3 px-4 flex items-center border-l border-gray-300">
        <div className="flex items-center flex-1">
          <div className="relative">
            <img 
              src={selectedUser.profilepic || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
              alt={selectedUser.name || 'User'} 
              className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
            />
            <div className="absolute bottom-0 right-2 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#f0f2f5]"></div>
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{selectedUser.name || 'User'}</h2>
            <p className="text-xs text-gray-500">online</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chat messages - WhatsApp style */}
      <div 
        className="flex-1 p-4 overflow-y-auto bg-[#efeae2] bg-opacity-90"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2325d366' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#25d366]"></div>
            <span className="ml-3 text-sm text-gray-600">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-[#dcf8c6] bg-opacity-30 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#25d366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex items-center justify-center my-4">
                  <div className="bg-white text-xs text-gray-500 font-medium px-3 py-1 rounded-full shadow-sm">
                    {date}
                  </div>
                </div>
                <div className="space-y-1">
                  {dateMessages.map((message) => {
                    const isSentByMe = message.sender === user?.id || message.sender === user?._id;
                    return (
                      <div 
                        key={message._id} 
                        className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                            isSentByMe 
                              ? 'bg-[#dcf8c6] rounded-tr-none' 
                              : 'bg-white rounded-tl-none'
                          }`}
                        >
                          {message.isAnonymous && !isSentByMe && (
                            <span className="text-xs font-medium text-[#25d366] mb-1 block">Anonymous</span>
                          )}
                          <p className="text-sm text-gray-800">{message.content}</p>
                          <div className="flex justify-end items-center mt-1 space-x-1">
                            <span className="text-[10px] text-gray-500">
                              {message.createdAt ? format(new Date(message.createdAt), 'h:mm a') : 'Now'}
                            </span>
                            {isSentByMe && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#25d366]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          {/* Triangle for speech bubble effect */}
                          <div 
                            className={`absolute top-0 w-4 h-4 ${
                              isSentByMe
                                ? 'right-0 bg-[#dcf8c6]'
                                : 'left-0 bg-white'
                            }`}
                            style={{
                              transform: isSentByMe ? 'translate(0, -50%) rotate(45deg)' : 'translate(-50%, 0) rotate(45deg)'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <MessageInput />
    </div>
  );
}

export default ChatWindow;