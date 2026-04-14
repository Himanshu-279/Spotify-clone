/**
 * ============================================
 * SPOTIFY CLONE - MAIN APPLICATION COMPONENT
 * ============================================
 * 
 * Author: Himanshu Verma (B.Tech 3rd Year Student)
 * 
 * This is the root React component that sets up:
 * - React Router for navigation
 * - Toast notifications
 * - Route protection for authenticated users
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Library from './pages/Library'
import Upload from './pages/Upload'

/**
 * PrivateRoute Component
 * ==========================================
 * Higher-Order Component (HOC) that protects routes
 * Redirects unauthenticated users to login page
 * 
 * Usage: <PrivateRoute><ProtectedComponent /></PrivateRoute>
 */
const PrivateRoute = ({ children }) => {
  // Check if JWT token exists in localStorage
  const isAuthenticated = localStorage.getItem('token');
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Main App Component
 * ==========================================
 * Renders the entire application with routing
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Toast notification container - appears at top-right */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Application routes */}
      <Routes>
        {/* Default route - redirect to library */}
        <Route path="/" element={<Navigate to="/library" />} />
        
        {/* Public routes (no authentication required) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes (require authentication) */}
        <Route 
          path="/library" 
          element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
