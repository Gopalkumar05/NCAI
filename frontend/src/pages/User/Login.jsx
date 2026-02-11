// // pages/Login.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const { login, error, success, clearMessages } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     clearMessages();
    
//     try {
//       await login(formData.email, formData.password);
//       navigate('/homes');
//     } catch (err) {
//       // Error handled in context
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
//             create a new account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {error && (
//             <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
//               {success}
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
//                   Forgot your password?
//                 </Link>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <span className="sr-only">Sign in with Google</span>
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
//                 </svg>
//               </button>

//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//               >
//                 <span className="sr-only">Sign in with Facebook</span>
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Mail, Lock, Flower2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const ULogin = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, isAuthenticated } = useAuth();

//   // Get the redirect path
//   const from = location.state?.from || '/homes';

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       console.log('Login attempt with:', formData.email);
      
//       // Call login function
//       const response = await login(formData.email, formData.password);
//       console.log('Login response:', response);
      
//       // Check if token was received
//       const token = localStorage.getItem('token');
//       console.log('Token stored:', token);
      
//       if (token) {
//         toast.success('Login successful!');
        
//         // Give a moment for state to update
//         setTimeout(() => {
//           console.log('Redirecting to:', from);
//           navigate(from, { replace: true });
//         }, 500);
//       } else {
//         toast.error('Login failed: No token received');
//       }
      
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // If already authenticated, redirect immediately
//   if (isAuthenticated) {
//     console.log('Already authenticated, redirecting to:', from);
//     navigate(from, { replace: true });
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
//               <Flower2 className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-gray-600">
//             Sign in to your BloomBox account
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <form onSubmit={handleSubmit}>
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-pink-600 hover:text-pink-700"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="password"
//                     required
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </div>
//           </form>

//           <div className="mt-8 pt-8 border-t border-gray-200">
//             <p className="text-center text-gray-600">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="text-pink-600 hover:text-pink-700 font-semibold"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ULogin;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Flower2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ULogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  // Get the redirect path
  const from = location.state?.from || '/homes';

  // Check authentication in useEffect, not during render
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      console.log('ULogin: Checking authentication status');
      
      // If already authenticated, redirect
      if (isAuthenticated && user) {
        console.log('ULogin: Already authenticated, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        // Also check localStorage as fallback
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          console.log('ULogin: Found auth in localStorage, redirecting');
          navigate(from, { replace: true });
        } else {
          setCheckingAuth(false);
        }
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('ULogin: Attempting login with:', formData.email);
      
      // Call login function
      const response = await login(formData.email, formData.password);
      console.log('ULogin: Login successful');
      
      toast.success('Login successful!');
      
      // Redirect after successful login
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('ULogin: Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your BloomBox account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ULogin;