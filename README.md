# 🎵 Spotify Clone - Full-Stack Web Application

> A complete music streaming platform built with Node.js, Express, MongoDB, and React  
> Demonstration of modern web development practices and MERN stack implementation

**Author**: Himanshu Verma (B.Tech 3rd Year Student)  
**Project Type**: Academic - Web Development Assignment  
**Version**: 1.0.0 | **Last Updated**: April 15, 2024

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Installation & Setup](#-installation--setup)
5. [Project Structure](#-project-structure)
6. [API Documentation](#-api-documentation)
7. [Database Schema](#-database-schema)
8. [Authentication & Security](#-authentication--security)
9. [Usage Guide](#-usage-guide)
10. [Development Guidelines](#-development-guidelines)

---

## 🎯 Project Overview

**Spotify Clone** is a full-stack music streaming web application demonstrating MERN stack proficiency. It implements a two-role platform where:

- **Users (Listeners)**: Browse, play, and download songs
- **Artists**: Upload, manage, and track song performance

This project showcases:
- Full MERN stack implementation
- RESTful API design
- JWT authentication and authorization
- MongoDB schema design
- React component architecture
- File upload handling
- Real-time audio playback
- Professional code organization

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens (7-day expiration)
- ✅ Role-based access control (User/Artist)
- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ Protected routes requiring authentication

### 🎵 Music Library
- ✅ Browse all uploaded songs
- ✅ Filter songs (All Songs / My Uploads)
- ✅ View song metadata (title, artist, genre, duration)
- ✅ Real-time play and download tracking

### 🎙️ Artist Features
- ✅ Upload audio files with metadata
- ✅ Manage uploaded songs (edit, delete)
- ✅ View personal song statistics
- ✅ File size validation (max 100MB)

### 🎧 Audio Playback
- ✅ HTML5 audio player integration
- ✅ Play/pause controls
- ✅ Progress bar with seek functionality
- ✅ Current time and duration display
- ✅ Automatic play count tracking

### 🎨 User Interface
- ✅ Spotify-inspired dark theme
- ✅ Responsive modern design
- ✅ Toast notifications
- ✅ Smooth animations and transitions

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v22.19.0 | JavaScript runtime |
| Express.js | v4.18.2 | Web framework |
| MongoDB | Atlas | NoSQL database |
| Mongoose | v7.0.3 | MongoDB ODM |
| bcryptjs | v2.4.3 | Password hashing |
| jsonwebtoken | v9.0.0 | JWT authentication |
| Multer | v1.4.5 | File upload |
| Swagger | v1.0.0 | API docs |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | v18.2.0 | UI framework |
| Vite | v4.5.14 | Build tool |
| React Router | v6.8.0 | Routing |
| Axios | v1.3.2 | HTTP client |
| React Hot Toast | v2.4.0 | Notifications |
| React Icons | v4.11.0 | Icons |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Free Tier](https://www.mongodb.com/cloud/atlas))

### Backend Setup
```bash
cd spotify-clone/backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spotify-clone
# JWT_SECRET=your-secret-key-here
# PORT=5001

# Start development server
npm run dev

# Server runs on http://localhost:5001
# API docs at http://localhost:5001/api/v1/docs
```

### Frontend Setup
```bash
cd spotify-clone/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Frontend runs on http://localhost:3001
```

### Access the Application
1. Open **http://localhost:3001**
2. Create a new account
3. Choose User or Artist role
4. Start using the application!

---

## 📁 Project Structure

```
spotify-clone/
│
├── backend/
│   ├── uploads/              # Uploaded audio files
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Song.model.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── song.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── song.routes.js
│   │   └── middleware/
│   │       └── auth.middleware.js
│   ├── server.js
│   ├── swagger.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Library.jsx
│   │   │   └── Upload.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api/v1
```

### Headers (Protected Routes)
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

### 🔐 Authentication Endpoints

#### POST /auth/register
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

#### POST /auth/login
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### GET /auth/me
Get current user profile (requires auth token)

### 🎵 Song Endpoints

#### GET /songs
Get all songs in library

#### POST /songs
Upload new song (multipart/form-data, Artist only)

#### GET /songs/:id
Get specific song details

#### POST /songs/:id/play
Increment play counter

#### POST /songs/:id/download
Increment download counter

#### PUT /songs/:id
Update song metadata (Artist only)

#### DELETE /songs/:id
Delete song (Artist only)

#### GET /songs/my-songs
Get artist's uploaded songs (Artist only)

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Required, 2-50 chars
  email: String,          // Required, unique
  password: String,       // Hashed with bcryptjs
  role: 'user'|'artist',  // Default: 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### Song Collection
```javascript
{
  _id: ObjectId,
  title: String,          // Required, 1-100 chars
  artist: ObjectId,       // Reference to User
  description: String,    // Max 500 chars
  genre: String,          // Predefined genres
  duration: Number,       // In seconds
  fileUrl: String,        // Path to audio file
  coverUrl: String,       // Cover art URL
  plays: Number,          // Default: 0
  downloads: Number,      // Default: 0
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication & Security

### Password Hashing
- Algorithm: bcryptjs
- Salt rounds: 12
- Minimum length: 6 characters

### JWT Tokens
- Algorithm: HS256
- Expiration: 7 days
- Contains: User ID and role
- Storage: localStorage (client)
- Transmission: Authorization header

### Authorization
- Token-based authentication
- Role-based access control
- Artist-only endpoints protected
- Protected route middleware

---

## 👨‍💻 Development Guidelines

### Code Standards
- **Models**: `Name.model.js`
- **Controllers**: `feature.controller.js`
- **Routes**: `feature.routes.js`
- **Components**: `ComponentName.jsx`

### Error Handling
```javascript
// Success
res.json({
  success: true,
  message: 'Operation successful',
  data: resultData
});

// Error
res.status(400).json({
  success: false,
  message: 'Descriptive error message'
});
```

### Database Indexes
```javascript
// Improves query performance
songSchema.index({ artist: 1, createdAt: -1 });
songSchema.index({ title: 'text', description: 'text' });
```

---

## 🚀 Future Enhancements

### High Priority
- Actual file download streaming
- Search functionality
- Pagination for large datasets
- User profiles
- Playlist management

### Medium Priority
- Song recommendations
- Social features (likes, follows)
- Comments on songs
- Email verification
- Advanced filtering

### Advanced Features
- Real-time notifications
- Offline mode
- Payment integration
- Cloud storage (AWS S3)
- Live streaming
- Mobile app

---

## 📝 Notes

- All `.env` files are excluded from git (add to .gitignore)
- Use `.env.example` files as templates
- MongoDB queries use Mongoose ODM
- API responses are JSON formatted
- All dates are ISO 8601 format
- Swagger documentation available at /api/v1/docs

---

## 🎓 What I Learned

✅ MERN Stack Architecture  
✅ RESTful API Design  
✅ JWT Authentication  
✅ MongoDB Schema Design  
✅ React State Management  
✅ File Upload Handling  
✅ Security Best Practices  
✅ Error Handling & Validation  

---

**Build with ❤️ by Himanshu Verma**
