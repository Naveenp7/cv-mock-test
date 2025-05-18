import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaUserPlus } from 'react-icons/fa';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Register = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { register, error, clearErrors, isAuthenticated } = authContext;
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
    name: '',
    email: '',
    password: '',
    password2: '',
    college: ''
  });

  const { name, email, password, password2, college } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '' || college === '') {
      setAlert('Please enter all fields', 'danger');
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else if (password.length < 6) {
      setAlert('Password must be at least 6 characters', 'danger');
    } else {
      register({
        name,
        email,
        password,
        college
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
          <FaUserPlus className="inline-block mr-2" /> Create an Account
        </h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label">
              <FaUser className="inline-block mr-2" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
          
          <div className="mb-4">
            <label htmlFor="college" className="form-label">
              <FaUniversity className="inline-block mr-2" /> College Name
            </label>
            <input
              type="text"
              name="college"
              id="college"
              value={college}
              onChange={onChange}
              className="form-input"
              placeholder="Enter your college name"
              required
            />
          </div>
          
          <div className="mb-4">
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
            <label htmlFor="password2" className="form-label">
              <FaLock className="inline-block mr-2" /> Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={password2}
              onChange={onChange}
              className="form-input"
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Register
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register; 