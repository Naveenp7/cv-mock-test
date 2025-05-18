import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Login = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { login, error, clearErrors, isAuthenticated } = authContext;
  const { setAlert } = alertContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, navigate]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      login({
        email,
        password
      });
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <motion.div 
        className="card w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          <FaSignInAlt className="inline-block mr-2" /> Login to Your Account
        </h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="inline-block mr-2" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="form-label">
              <FaLock className="inline-block mr-2" /> Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              className="form-input"
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Login
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 