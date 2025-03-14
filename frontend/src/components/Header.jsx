import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from './ProfileSettings';

function Header() {
  const { user, logout } = useAuth();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  return (
    <>
      <header className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-white">Anonymous Chat</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer bg-indigo-700 hover:bg-indigo-800 py-2 px-3 rounded-md transition-colors duration-200"
                onClick={() => setShowProfileSettings(true)}
              >
                <img 
                  src={user?.profilepic || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                  alt={user?.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-300"
                />
                <span className="text-white font-medium text-sm hidden md:block">{user?.name || 'User'}</span>
              </div>
              
              <button
                onClick={logout}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}
    </>
  );
}

export default Header;