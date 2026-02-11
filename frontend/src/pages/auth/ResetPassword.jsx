// pages/ResetPassword.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, validateResetToken } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    validateToken();
  }, [token]);

  



  // pages/ResetPassword.js - Update validateToken function
const validateToken = async () => {
  try {
    console.log('Validating token:', token);
    console.log('Token length:', token?.length);
    console.log('Full URL:', window.location.href);
    
    // For admin reset token validation
    const isValid = await validateResetToken(token, true);
    console.log('Token validation result:', isValid);
    setTokenValid(isValid);
  } catch (error) {
    console.error('Token validation error:', error);
    console.error('Error details:', error.response?.data);
    showAlert('error', 'Invalid or expired reset token');
    setTokenValid(false);
  } finally {
    setValidating(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };



  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // For admin password reset
      await resetPassword(token, formData.password, true);
      setPasswordChanged(true);
      showAlert('success', 'Password has been reset successfully!');
      
      setTimeout(() => {
        navigate('/alogin');
      }, 3000);
    } catch (error) {
      showAlert('error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h2>
          
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new reset link.
          </p>

          <div className="space-y-4">
            <Link
              to="/aforgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Request new reset link
            </Link>
            
            <div className="pt-4">
              <Link
                to="/alogin"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (passwordChanged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>

          <div className="animate-pulse">
            <div className="h-2 bg-blue-200 rounded-full w-48 mx-auto"></div>
          </div>

          <div className="mt-8">
            <Link
              to="/alogin"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
            >
              Click here to login immediately →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {alert.show && (
          <Alert type={alert.type} message={alert.message} />
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="showPassword"
                name="showPassword"
                type="checkbox"
                onChange={(e) => {
                  const inputs = document.querySelectorAll('input[type="password"]');
                  inputs.forEach(input => {
                    input.type = e.target.checked ? 'text' : 'password';
                  });
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                Show passwords
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting password...' : 'Reset password'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/alogin"
                className="font-medium text-blue-600 hover:text-blue-500 text-sm"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center">
                <svg className="h-3 w-3 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                </svg>
                At least 8 characters
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                </svg>
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center">
                <svg className="h-3 w-3 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                </svg>
                Include at least one number
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;