import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Auth pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Main pages
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import ExamList from './components/exams/ExamList';
import ExamDetail from './components/exams/ExamDetail';
import TestInterface from './components/test/TestInterface';
import TestResults from './components/test/TestResults';
import Analytics from './components/analytics/Analytics';
import Bookmarks from './components/bookmarks/Bookmarks';
import Leaderboard from './components/leaderboard/Leaderboard';
import Profile from './components/profile/Profile';
import NotFound from './components/pages/NotFound';

// Admin pages
import AdminDashboard from './components/admin/AdminDashboard';

// Context
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import ExamState from './context/exam/ExamState';
import AttemptState from './context/attempt/AttemptState';

// Utils
import setAuthToken from './utils/setAuthToken';

// Check for token
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthState>
      <AlertState>
        <ExamState>
          <AttemptState>
            <Router>
              <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <main className="container mx-auto px-4 py-6 flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/exams" 
                      element={
                        <PrivateRoute>
                          <ExamList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/exams/:id" 
                      element={
                        <PrivateRoute>
                          <ExamDetail />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/test/:attemptId" 
                      element={
                        <PrivateRoute>
                          <TestInterface />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/results/:attemptId" 
                      element={
                        <PrivateRoute>
                          <TestResults />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <PrivateRoute>
                          <Analytics />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/bookmarks" 
                      element={
                        <PrivateRoute>
                          <Bookmarks />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/leaderboard" 
                      element={
                        <PrivateRoute>
                          <Leaderboard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <ToastContainer position="bottom-right" autoClose={3000} />
              </div>
            </Router>
          </AttemptState>
        </ExamState>
      </AlertState>
    </AuthState>
  );
}

export default App; 