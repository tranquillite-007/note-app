# Fullstack Application

Full-stack application with secure authentication and seamless user experience.

## 🚀 Live Demo

Project-Link: https://mern-gamma-lemon.vercel.app/login

## ✨ Features

### 🔐 Authentication

- **Email/OTP Login**: Secure authentication with one-time passwords
- **Google OAuth**: Sign in with Google account integration
- **JWT Protection**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation and error handling

### 📋 Notes Management

- **Create Notes**: Add new notes with title and content
- **Delete Notes**: Remove notes with confirmation
- **Real-time Updates**: Instant UI updates for all operations
- **User-specific Data**: Notes are private to each user

### 🎨 User Experience

- **Mobile Responsive**: Works seamlessly on all devices
- **Modern UI**: Clean and intuitive user interface
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading indicators

## 🛠️ Technology Stack

### Frontend

- **React.js** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **Context API** - State management

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Nodemailer** - Email sending functionality
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 API Endpoints

### Authentication

- POST /api/auth/request-otp - Request OTP for email
- POST /api/auth/verify-otp - Verify OTP and login
- POST /api/auth/google - Google OAuth authentication

### Notes

- GET /api/notes - Get all user notes
- POST /api/notes - Create a new note
- DELETE /api/notes/:id - Delete a note

## 🎯 Usage

1.  **Sign Up/Login**: Use email/OTP or Google authentication
2.  **Create Notes**: Click "Create note" button and add content
3.  **Manage Notes**: View all your notes in the dashboard
4.  **Delete Notes**: Click trash icon to remove notes
5.  **Responsive Design**: Use on mobile, tablet, or desktop

## 📱 Mobile Support

Fully responsive design that works on:

- 📱 Mobile phones (320px+)
- 📟 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🔒 Security Features

- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Secure password hashing

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch (git checkout -b feature/amazing-feature)
3.  Commit your changes (git commit -m 'Add amazing feature')
4.  Push to the branch (git push origin feature/amazing-feature)
5.  Open a Pull Request

**Happy Coding!** 📝✨
