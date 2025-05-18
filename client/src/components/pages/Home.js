import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartBar, FaBookmark, FaTrophy, FaUserGraduate, FaClock, FaChartLine } from 'react-icons/fa';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loadUser } = authContext;

  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, []);

  const features = [
    {
      icon: <FaUserGraduate className="text-blue-500 text-3xl" />,
      title: 'Comprehensive Question Bank',
      description: 'Access a vast collection of CV exam questions from previous years and subject units.'
    },
    {
      icon: <FaClock className="text-green-500 text-3xl" />,
      title: 'Timed Mock Tests',
      description: 'Practice under exam conditions with configurable timers and realistic test environment.'
    },
    {
      icon: <FaChartBar className="text-purple-500 text-3xl" />,
      title: 'Detailed Analytics',
      description: 'Track your performance with in-depth analytics and identify areas for improvement.'
    },
    {
      icon: <FaBookmark className="text-red-500 text-3xl" />,
      title: 'Bookmark Questions',
      description: 'Save difficult questions for later review and focused practice.'
    },
    {
      icon: <FaTrophy className="text-yellow-500 text-3xl" />,
      title: 'College Leaderboard',
      description: 'Compete with fellow students from your college and track your ranking.'
    },
    {
      icon: <FaChartLine className="text-indigo-500 text-3xl" />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time with comprehensive progress reports.'
    }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
                Ace Your CV Exams with Confidence
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Practice with real exam questions, track your progress, and improve your performance with our comprehensive mock test platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link to="/exams" className="btn btn-primary text-center">
                    Start Practicing
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary text-center">
                      Sign Up Free
                    </Link>
                    <Link to="/login" className="btn btn-secondary text-center">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="/images/hero-image.svg" 
                alt="Student studying" 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=CV+Mock+Test';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Features to Help You Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform is designed to give you the best preparation experience for your CV exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Improve Your Exam Performance?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have boosted their scores with our mock test platform.
          </p>
          {isAuthenticated ? (
            <Link to="/exams" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Practicing Now
            </Link>
          ) : (
            <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Sign Up Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 