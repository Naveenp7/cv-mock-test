import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaUserCircle, FaSignOutAlt, FaChartBar, FaBookmark, FaTrophy, FaTools } from 'react-icons/fa';
import AuthContext from '../../context/auth/authContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  const authLinks = (
    <>
      <li>
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/exams" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          Exams
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link to="/admin" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <FaTools className="inline mr-2" /> Admin
          </Link>
        </li>
      )}
      <li>
        <Link to="/analytics" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FaChartBar className="inline mr-2" /> Analytics
        </Link>
      </li>
      <li>
        <Link to="/bookmarks" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FaBookmark className="inline mr-2" /> Bookmarks
        </Link>
      </li>
      <li>
        <Link to="/leaderboard" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FaTrophy className="inline mr-2" /> Leaderboard
        </Link>
      </li>
      <li>
        <Link to="/profile" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FaUserCircle className="inline mr-2" /> Profile
        </Link>
      </li>
      <li>
        <a onClick={onLogout} href="#!" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
          <FaSignOutAlt className="inline mr-2" /> Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/login" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          Login
        </Link>
      </li>
      <li>
        <Link to="/register" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              CV Mock Test
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Dashboard
                </Link>
                <Link to="/exams" className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Exams
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <FaTools className="inline mr-2" /> Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center">
                    {user && user.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <Link to="/analytics" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaChartBar className="inline mr-2" /> Analytics
                    </Link>
                    <Link to="/bookmarks" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaBookmark className="inline mr-2" /> Bookmarks
                    </Link>
                    <Link to="/leaderboard" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaTrophy className="inline mr-2" /> Leaderboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <FaUserCircle className="inline mr-2" /> Profile
                    </Link>
                    <a onClick={onLogout} href="#!" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  Login
                </Link>
                <Link to="/register" className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Register
                </Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={toggleDarkMode} className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button onClick={toggleMenu} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-1">
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 