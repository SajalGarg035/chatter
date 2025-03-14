import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const { users, selectUser, selectedUser, onlineUsers, fetchUsers } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Safe filtering that handles undefined values or properties
  const filteredUsers = users.filter((chatUser) => {
    if (!chatUser || !chatUser.name) return false;
    return chatUser.name.toLowerCase().includes((searchQuery || '').toLowerCase());
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
  };

  return (
    <div className="w-96 flex flex-col border-r border-gray-300 bg-white">
      {/* Header */}
      <div className="bg-[#00a884] py-3 px-4 flex items-center justify-between">
        <div className="relative">
          <div onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img 
              src={user?.profilepic || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
              alt={user?.name || 'User'} 
              className="w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-white"
            />
          </div>
          {showProfileMenu && (
            <div className="absolute top-12 left-0 z-10 bg-white rounded-md shadow-lg w-56">
              <div className="py-2 px-4 border-b border-gray-200">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3 text-white">
          <button className="p-2 rounded-full hover:bg-[#128c7e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-[#128c7e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </button>
          
          <button className="p-2 rounded-full hover:bg-[#128c7e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-[#f0f2f5]">
        <div className="bg-white rounded-lg flex items-center px-3 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 px-2 py-1 w-full focus:outline-none text-sm"
          />
        </div>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((chatUser) => {
            const isSelected = selectedUser?._id === chatUser._id;
            const isOnline = onlineUsers?.includes(chatUser._id);
            
            return (
              <div 
                key={chatUser._id} 
                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'bg-[#f0f2f5]' : ''
                }`}
                onClick={() => selectUser(chatUser)}
              >
                <div className="relative">
                  <img 
                    src={chatUser.profilepic || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                    alt={chatUser.name || 'User'} 
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-[#25d366] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chatUser.name}</h3>
                    <span className="text-xs text-gray-500">12:45 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Click to start chatting</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;