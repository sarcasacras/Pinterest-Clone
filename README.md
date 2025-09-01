# 📌 Pinterest Clone - Full-Stack Social Media Platform

A feature-rich Pinterest clone built with modern web technologies, showcasing advanced full-stack development skills and production-ready architecture.

![Pinterest Clone](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🌟 Live Demo

🔗 **[View Live Demo](Coming Soon!)**  

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure JWT-based authentication with HTTP-only cookies
- User registration and login with email validation
- Profile management with avatar upload and updating
- Password hashing with bcrypt security

### 📌 **Content Management**
- **Pin Creation:** Upload and share images with titles, descriptions, and tags
- **Image Editing:** Built-in image editor with crop, flip and rotate functionality
- **Board System:** Organize pins into custom collections
- **Search Functionality:** Find pins by tags, title and description with a functional search

### 🤝 **Social Features**
- **Like & Comment:** Interact with pins through likes and comments
- **Notifications:** Real-time notifications for likes and comments
- **Messaging:** Direct messaging system with message deletion and update functionality

### 🎨 **User Experience**
- **Responsive Design:** Mobile-first approach with adaptive layouts
- **Infinite Scroll:** Smooth browsing experience with lazy loading
- **Real-time Updates:** Optimistic UI updates with TanStack Query
- **Custom Error Handling:** Beautiful error modals instead of browser alerts

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **React Router v7** - Client-side routing with protected routes
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client with interceptors
- **CSS Modules** - Component-scoped styling

### **Backend**
- **Node.js & Express.js** - RESTful API with ES modules
- **MongoDB & Mongoose** - Document database with ODM
- **JWT** - Secure authentication with HTTP-only cookies
- **ImageKit** - Cloud image storage and optimization
- **Helmet.js** - Security headers and protection
- **Express Rate Limit** - API rate limiting protection

### **Security & DevOps**
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing configuration
- **Input Validation** - XSS protection and sanitization
- **Environment Validation** - Startup configuration validation
- **ESLint** - Code quality and consistency

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Frontend    │    │     Backend     │    │    Database     │
│   React + Vite  │◄──►│  Node.js + API  │◄──►│   MongoDB       │
│   Port: 5173    │    │   Port: 3000    │    │   Atlas Cloud   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Image Storage │
                    │    ImageKit     │
                    └─────────────────┘
```

### **Key Architectural Decisions:**
- **Separation of Concerns:** Clean separation between frontend, backend, and data layers
- **Security-First:** HTTP-only cookies, rate limiting, input validation
- **Scalable State Management:** React Context for global state of the user data
- **Performance Optimized:** Image optimization, lazy loading, caching strategies

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MongoDB Atlas account
- ImageKit account
- Git

### **1. Clone & Install**
```bash
git clone https://github.com/sarcasacras/pinterest-clone.git
cd pinterest-clone

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### **2. Environment Setup**

**Backend (.env):**
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
MONGO=mongodb+srv://username:password@cluster.mongodb.net/pinterest-clone

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_your_public_key_here
IMAGEKIT_PRIVATE_KEY=private_your_private_key_here  
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

### **3. Run Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

## 📋 API Endpoints

### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get current user profile

### **Pins**
- `GET /pins` - Get all pins (paginated)
- `POST /pins` - Create new pin
- `GET /pins/:id` - Get pin by ID or slug
- `PUT /pins/:id` - Update pin
- `DELETE /pins/:id` - Delete pin
- `POST /pins/:id/like` - Toggle like on pin

### **Boards**
- `GET /boards/user/:userId` - Get user's boards
- `POST /boards` - Create new board
- `PUT /boards/:id` - Update board
- `DELETE /boards/:id` - Delete board

### **Social Features**
- `GET /notifications` - Get user notifications
- `POST /messages` - Send message
- `GET /messages/conversations` - Get conversations

## 🔒 Security Features

### **Authentication Security**
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Secure cookie settings (production-ready)
- Token expiration handling

### **API Protection**
- Rate limiting per endpoint type
- Input validation and sanitization
- XSS protection
- CORS configuration
- Security headers with Helmet.js

### **Data Validation**
- Mongoose schema validation
- Express-validator middleware
- File upload security
- Image URL validation


## 📱 Screenshots

<img width="1425" height="810" alt="Screenshot 2025-09-01 at 12 07 47" src="https://github.com/user-attachments/assets/01cd3117-0030-4295-b01f-043a35bc4325" />
<img width="317" height="688" alt="Screenshot 2025-09-01 at 12 42 03" src="https://github.com/user-attachments/assets/b43153a5-e551-46e4-ae37-9c55270ec3e1" />
<img width="1440" height="810" alt="Screenshot 2025-09-01 at 12 07 59" src="https://github.com/user-attachments/assets/31fedecd-d987-43c5-a091-5e5393699d9d" />
<img width="1427" height="810" alt="Screenshot 2025-09-01 at 12 08 17" src="https://github.com/user-attachments/assets/41319b7c-d725-4beb-9c32-4649165e62e5" />
<img width="305" height="688" alt="Screenshot 2025-09-01 at 12 42 28" src="https://github.com/user-attachments/assets/27d07dd9-5346-40aa-87e0-1e5987e81047" />
<img width="1440" height="810" alt="Screenshot 2025-09-01 at 12 11 22" src="https://github.com/user-attachments/assets/acd8b2c8-de7b-4683-bcdd-b7b1ccb13b70" />
<img width="1427" height="810" alt="Screenshot 2025-09-01 at 12 10 20" src="https://github.com/user-attachments/assets/197c8be0-3665-49b5-81e7-f923da7dee6d" />

### **Key Pages:**
- **Home Feed** - Infinite scroll of pins
- **Pin Detail** - Comments, Likes, Save to Board functionality  
- **Profile Page** - User pins and boards
- **Create Pin** - Upload and edit interface
- **Messages** - Real-time chat system

## 🧪 Testing

```bash
# Frontend linting
cd frontend
npm run lint

# Build test
npm run build
npm run preview
```

## 📂 Project Structure

```
pinterest-clone/
├── backend/                # Node.js API server
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB schemas  
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & validation
│   └── utils/             # Helper functions
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── api/           # API client functions
│   │   └── hooks/         # Custom React hooks
└── README.md
```

## 🤝 Contributing

This is a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 👨‍💻 About the Developer

Created by **Andrei Davidovich** as a portfolio project demonstrating:
- Full-stack development expertise
- Modern React and Node.js patterns
- Production-ready security practices
- Clean, maintainable code architecture

### **Connect with me:**
- 💼 **LinkedIn:** [https://www.linkedin.com/in/andrei-davidovich/]
- 📧 **Email:** [sarcasacras@icloud.com]
- 🐙 **GitHub:** [https://github.com/sarcasacras]

---

⭐ **If you found this project interesting, please give it a star!**
