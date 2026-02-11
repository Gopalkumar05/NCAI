// // contexts/AuthContext.js
// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import { authService } from '../services/authService';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Clear messages after timeout
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   // Initialize authentication
//   const initAuth = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const userType = localStorage.getItem('userType');
      
//       if (token && userType) {
//         if (userType === 'admin') {
//           const response = await authService.getCurrentAdmin();
//           const adminData = response.data?.data || response.data || response;
//           setUser(adminData);
//           setIsAdmin(true);
//         } else {
//           const response = await authService.getUserProfile();
//           const userData = response.data?.data || response.data || response;
//           setUser(userData);
//           setIsAdmin(false);
//         }
//       }
//     } catch (error) {
//       console.error('Auth initialization error:', error);
//       clearAuth();
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     initAuth();
//   }, [initAuth]);

//   // Clear authentication data
//   const clearAuth = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsAdmin(false);
//     setError(null);
//     setSuccess(null);
//   };

//   // Helper to set token and user data
//   const setAuthData = (token, userData, userType) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('userType', userType);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//     setIsAdmin(userType === 'admin');
//   };

//   // User login
//   const login = async (email, password) => {
//     try {
//       setError(null);
//       const response = await authService.loginUser(email, password);
//       const { token, user: userData } = response.data?.data || response.data || response;
      
//       if (token) {
//         setAuthData(token, userData, 'user');
//         setSuccess('Login successful!');
//       }
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Login failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Admin login
//   const loginAsAdmin = async (email, password) => {
//     try {
//       setError(null);
//       const response = await authService.loginAdmin(email, password);
//       const { token, admin: adminData } = response.data?.data || response.data || response;
      
//       if (token) {
//         setAuthData(token, adminData, 'admin');
//         setSuccess('Admin login successful!');
//       }
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Admin login failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // User registration
//   const register = async (userData) => {
//     try {
//       setError(null);
//       const response = await authService.registerUser(userData);
//       setSuccess('Registration successful! Please check your email to verify your account.');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Admin registration
//   const registerAdmin = async (adminData) => {
//     try {
//       setError(null);
//       const response = await authService.registerAdmin(adminData);
//       setSuccess('Admin registered successfully! Please check your email to verify your account.');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Admin registration failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       if (isAdmin) {
//         await authService.logout();
//       } else {
//         await authService.logoutUser();
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       clearAuth();
//       setSuccess('Logged out successfully');
//     }
//   };

//   // Update profile
//   const updateProfile = async (data) => {
//     try {
//       setError(null);
//       const response = isAdmin 
//         ? await authService.updateAdminProfile(data)
//         : await authService.updateUserProfile(data);
      
//       const updatedUser = response.data?.data || response.data || response;
//       setUser(prev => ({ ...prev, ...updatedUser }));
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setSuccess('Profile updated successfully!');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Profile update failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Change password
//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       setError(null);
//       const data = { currentPassword, newPassword };
//       const response = isAdmin 
//         ? await authService.changeAdminPassword(data)
//         : await authService.changeUserPassword(data);
      
//       setSuccess('Password changed successfully!');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Password change failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Forgot password
//   const forgotPassword = async (email, isAdminUser = false) => {
//     try {
//       setError(null);
//       const response = isAdminUser
//         ? await authService.forgotAdminPassword(email)
//         : await authService.forgotUserPassword(email);
      
//       setSuccess('Password reset instructions sent to your email!');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Password reset request failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Reset password
//   const resetPassword = async (token, newPassword, isAdminUser = false) => {
//     try {
//       setError(null);
//       const data = { password: newPassword };
//       const response = isAdminUser
//         ? await authService.resetAdminPassword(token, data)
//         : await authService.resetUserPassword(token, data);
      
//       setSuccess('Password reset successfully! You can now login with your new password.');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Password reset failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Verify email
//   const verifyEmail = async (token, isAdminUser = false) => {
//     try {
//       setError(null);
//       const response = isAdminUser
//         ? await authService.verifyEmail(token)
//         : await authService.verifyUserEmail(token);
      
//       setSuccess('Email verified successfully!');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Email verification failed';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Resend verification
//   const resendVerification = async (isAdminUser = false) => {
//     try {
//       setError(null);
//       const response = isAdminUser
//         ? await authService.resendVerification()
//         : await authService.resendUserVerification();
      
//       setSuccess('Verification email sent! Please check your inbox.');
//       return response;
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || error.message || 'Failed to resend verification';
//       setError(errorMsg);
//       throw error;
//     }
//   };

//   // Validate reset token
//   const validateResetToken = async (token, isAdminUser = false) => {
//     try {
//       const response = isAdminUser
//         ? await authService.validateResetToken(token)
//         : await authService.validateResetToken(token);
//       return response.data?.valid || true;
//     } catch (error) {
//       return false;
//     }
//   };

//   // Refresh user data
//   const refreshUser = async () => {
//     try {
//       if (isAdmin) {
//         const response = await authService.getCurrentAdmin();
//         const adminData = response.data?.data || response.data || response;
//         setUser(adminData);
//       } else {
//         const response = await authService.getUserProfile();
//         const userData = response.data?.data || response.data || response;
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Refresh user error:', error);
//       clearAuth();
//     }
//   };

//   const value = {
//     user,
//     isAdmin,
//     loading,
//     error,
//     success,
//     isAuthenticated: !!user,
    
//     // Actions
//     login,
//     loginAsAdmin,
//     register,
//     registerAdmin,
//     logout,
//     updateProfile,
//     changePassword,
//     forgotPassword,
//     resetPassword,
//     verifyEmail,
//     resendVerification,
//     validateResetToken,
//     refreshUser,
//     clearAuth,
    
//     // Helper functions
//     getUserRole: () => user?.role,
//     getUserEmail: () => user?.email,
//     getUserName: () => user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || user?.username,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// contexts/AuthContext.js


import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // In your AuthContext.js, add this:
useEffect(() => {
  console.log('Auth Context State Updated:', {
    user,
    loading,
    isAdmin,
    isAuthenticated: !!user,
    token: localStorage.getItem('token')
  });
}, [user, loading, isAdmin]);
  // Clear messages manually
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };



  
  // Initialize authentication
  const initAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (token && userType) {
        if (userType === 'admin') {
          const response = await authService.getCurrentAdmin();
          const adminData = response.data?.data || response.data || response;
          setUser(adminData);
          setIsAdmin(true);
        } else {
          const response = await authService.getUserProfile();
          const userData = response.data?.data || response.data || response;
          setUser(userData);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Clear authentication data
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    setError(null);
    setSuccess(null);
  };

  // Helper to set token and user data
  const setAuthData = (token, userData, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAdmin(userType === 'admin');
  };

  // User login
  const login = async (email, password) => {
    try {
      clearMessages();
      const response = await authService.loginUser(email, password);
      const { token, user: userData } = response.data?.data || response.data || response;
      
      if (token) {
        setAuthData(token, userData, 'user');
        setSuccess('Login successful!');
      }
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Admin login
  const loginAsAdmin = async (email, password) => {
    try {
      clearMessages();
      const response = await authService.loginAdmin(email, password);
      const { token, admin: adminData } = response.data?.data || response.data || response;
      
      if (token) {
        setAuthData(token, adminData, 'admin');
        setSuccess('Admin login successful!');
      }
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Admin login failed';
      setError(errorMsg);
      throw error;
    }
  };

  // User registration
  const register = async (userData) => {
    try {
      clearMessages();
      const response = await authService.registerUser(userData);
      setSuccess('Registration successful! Please check your email to verify your account.');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Admin registration
  const registerAdmin = async (adminData) => {
    try {
      clearMessages();
      const response = await authService.registerAdmin(adminData);
      setSuccess('Admin registered successfully! Please check your email to verify your account.');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Admin registration failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (isAdmin) {
        await authService.logout();
      } else {
        await authService.logoutUser();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setSuccess('Logged out successfully');
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      clearMessages();
      const response = isAdmin 
        ? await authService.updateAdminProfile(data)
        : await authService.updateUserProfile(data);
      
      const updatedUser = response.data?.data || response.data || response;
      setUser(prev => ({ ...prev, ...updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Profile update failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      clearMessages();
      const data = { currentPassword, newPassword };
      const response = isAdmin 
        ? await authService.changeAdminPassword(data)
        : await authService.changeUserPassword(data);
      
      setSuccess('Password changed successfully!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Password change failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email, isAdminUser = false) => {
    try {
      clearMessages();
      const response = isAdminUser
        ? await authService.forgotAdminPassword(email)
        : await authService.forgotUserPassword(email);
      
      setSuccess('Password reset instructions sent to your email!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Password reset request failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword, isAdminUser = false) => {
    try {
      clearMessages();
      const data = { password: newPassword };
      const response = isAdminUser
        ? await authService.resetAdminPassword(token, data)
        : await authService.resetUserPassword(token, data);
      
      setSuccess('Password reset successfully! You can now login with your new password.');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Password reset failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Verify email
  const verifyEmail = async (token, isAdminUser = false) => {
    try {
      clearMessages();
      const response = isAdminUser
        ? await authService.verifyEmail(token)
        : await authService.verifyUserEmail(token);
      
      setSuccess('Email verified successfully!');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Email verification failed';
      setError(errorMsg);
      throw error;
    }
  };

  // Resend verification
  const resendVerification = async (isAdminUser = false) => {
    try {
      clearMessages();
      const response = isAdminUser
        ? await authService.resendVerification()
        : await authService.resendUserVerification();
      
      setSuccess('Verification email sent! Please check your inbox.');
      return response;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to resend verification';
      setError(errorMsg);
      throw error;
    }
  };

  // Validate reset token
  const validateResetToken = async (token, isAdminUser = false) => {
    try {
      const response = isAdminUser
        ? await authService.validateResetToken(token)
        : await authService.validateResetToken(token);
      return response.data?.valid || true;
    } catch (error) {
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (isAdmin) {
        const response = await authService.getCurrentAdmin();
        const adminData = response.data?.data || response.data || response;
        setUser(adminData);
      } else {
        const response = await authService.getUserProfile();
        const userData = response.data?.data || response.data || response;
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      clearAuth();
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    error,
    success,
    isAuthenticated: !!user,
    
    // Actions
    login,
    loginAsAdmin,
    register,
    registerAdmin,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    validateResetToken,
    refreshUser,
    clearAuth,
    clearMessages, // Added missing function
    
    // Helper functions
    getUserRole: () => user?.role,
    getUserEmail: () => user?.email,
    getUserName: () => user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || user?.username,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};