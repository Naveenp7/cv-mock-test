import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              CV Mock Test
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Prepare better, score higher
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/exams" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Available Exams
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/analytics" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Performance Analytics
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Resources</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#!" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} CV Mock Test. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 