function EmptyChat() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="text-center max-w-md p-6">
          <div className="mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-indigo-300 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Welcome to Anonymous Chat!
          </h3>
          <p className="text-gray-600 mb-4">
            Select a user from the sidebar to start a new conversation. You can choose to send messages anonymously or reveal your identity.
          </p>
          <p className="text-sm text-gray-500">
            Your privacy and security are important to us. 
            All anonymous messages are protected and cannot be traced back to you.
          </p>
        </div>
      </div>
    );
  }
  
  export default EmptyChat;