# Chatter - Real-Time Chat Application

A full-stack real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Socket.io for real-time communication.

![Chatter App Screenshot](screenshots/app-screenshot.png)

## Features

- Real-time messaging
- User authentication and authorization
- Create public and private chat rooms
- Direct messaging between users
- Message notifications
- User profile customization
- Message history
- Online/offline status indicators
- Typing indicators
- Emoji support
- File sharing capabilities

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Socket.io client
- Material-UI / Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT for authentication

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/chatter.git
cd chatter
```

2. Install dependencies for backend
```bash
cd server
npm install
```

3. Install dependencies for frontend
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with these variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the development servers

For backend:
```bash
cd server
npm run dev
```

For frontend:
```bash
cd client
npm start
```

## Usage

1. Register a new account or login with existing credentials
2. Join existing chat rooms or create a new one
3. Start chatting with other users in real-time
4. Use the search functionality to find users or chat rooms
5. Customize your profile in the settings page

## API Documentation

API endpoints are documented using Swagger and can be accessed at `/api-docs` when the server is running.

### Main Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/chats` - Chat room operations
- `/api/messages` - Message operations

## Deployment

The application can be deployed using services like:

- Frontend: Netlify, Vercel, or AWS S3
- Backend: Heroku, AWS EC2, or Digital Ocean
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - Sajal_Garg

Project Link: [https://github.com/SajalGarg035/chatter](https://github.com/SajalGarg035/chatter)

## Acknowledgements

- [Socket.io](https://socket.io/)
- [React.js](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
```

