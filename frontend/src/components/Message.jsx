import { format } from 'date-fns';

function Message({ message, isOwnMessage }) {
  const formattedTime = format(new Date(message.createdAt), 'p');

  return (
    <div className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-indigo-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.isAnonymous && !isOwnMessage && <div className="text-xs mb-1 font-medium text-gray-500">Anonymous</div>}
        <div>{message.content}</div>
        <div className={`text-xs mt-1 text-right ${isOwnMessage ? 'text-indigo-100' : 'text-gray-500'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;