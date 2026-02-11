// // pages/Profile.js
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import ProtectedRoute from '../../components/auth/ProtectedRoute';

// const UProfile = () => {
//   const { user, updateProfile, updateAddress, removeAddress, error, success, clearMessages } = useAuth();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [profileForm, setProfileForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [addressForm, setAddressForm] = useState({
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//     isDefault: false,
//   });

//   useEffect(() => {
//     if (user) {
//       setProfileForm({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         password: '',
//         confirmPassword: '',
//       });
//     }
//   }, [user]);

//   const handleProfileChange = (e) => {
//     setProfileForm({
//       ...profileForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleAddressChange = (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setAddressForm({
//       ...addressForm,
//       [e.target.name]: value,
//     });
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     clearMessages();
    
//     if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     const data = {
//       name: profileForm.name,
//       email: profileForm.email,
//       phone: profileForm.phone,
//       ...(profileForm.password && { password: profileForm.password }),
//     };

//     try {
//       await updateProfile(data);
//       setProfileForm({
//         ...profileForm,
//         password: '',
//         confirmPassword: '',
//       });
//     } catch (err) {
//       // Error handled in context
//     }
//   };

//   const handleAddressSubmit = async (e) => {
//     e.preventDefault();
//     clearMessages();
    
//     try {
//       await updateAddress(addressForm);
//       setAddressForm({
//         street: '',
//         city: '',
//         state: '',
//         country: '',
//         zipCode: '',
//         isDefault: false,
//       });
//     } catch (err) {
//       // Error handled in context
//     }
//   };

//   const handleRemoveAddress = async (index) => {
//     if (window.confirm('Are you sure you want to remove this address?')) {
//       try {
//         await removeAddress(index);
//       } catch (err) {
//         // Error handled in context
//       }
//     }
//   };

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//               <p className="mt-1 text-sm text-gray-500">
//                 Manage your account settings and addresses
//               </p>
//             </div>

//             <div className="border-t border-gray-200">
//               <div className="sm:flex">
//                 <div className="sm:w-1/4">
//                   <nav className="space-y-1">
//                     <button
//                       onClick={() => setActiveTab('profile')}
//                       className={`${
//                         activeTab === 'profile'
//                           ? 'bg-purple-50 border-purple-500 text-purple-700'
//                           : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                       } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
//                     >
//                       <svg
//                         className={`${
//                           activeTab === 'profile'
//                             ? 'text-purple-500'
//                             : 'text-gray-400 group-hover:text-gray-500'
//                         } mr-3 h-6 w-6`}
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                       Personal Information
//                     </button>
                    
//                     <button
//                       onClick={() => setActiveTab('address')}
//                       className={`${
//                         activeTab === 'address'
//                           ? 'bg-purple-50 border-purple-500 text-purple-700'
//                           : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                       } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
//                     >
//                       <svg
//                         className={`${
//                           activeTab === 'address'
//                             ? 'text-purple-500'
//                             : 'text-gray-400 group-hover:text-gray-500'
//                         } mr-3 h-6 w-6`}
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       Addresses
//                     </button>
//                   </nav>
//                 </div>

//                 <div className="sm:w-3/4 p-6">
//                   {error && (
//                     <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
//                       {error}
//                     </div>
//                   )}
//                   {success && (
//                     <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
//                       {success}
//                     </div>
//                   )}

//                   {activeTab === 'profile' && (
//                     <div>
//                       <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
//                       <form onSubmit={handleProfileSubmit} className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Name</label>
//                             <input
//                               type="text"
//                               name="name"
//                               value={profileForm.name}
//                               onChange={handleProfileChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>
                          
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Email</label>
//                             <input
//                               type="email"
//                               name="email"
//                               value={profileForm.email}
//                               onChange={handleProfileChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Phone</label>
//                             <input
//                               type="tel"
//                               name="phone"
//                               value={profileForm.phone}
//                               onChange={handleProfileChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
//                             <input
//                               type="password"
//                               name="password"
//                               value={profileForm.password}
//                               onChange={handleProfileChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               placeholder="Leave blank to keep current"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                             <input
//                               type="password"
//                               name="confirmPassword"
//                               value={profileForm.confirmPassword}
//                               onChange={handleProfileChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               placeholder="Confirm new password"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex justify-end">
//                           <button
//                             type="submit"
//                             className="bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                           >
//                             Update Profile
//                           </button>
//                         </div>
//                       </form>
//                     </div>
//                   )}

//                   {activeTab === 'address' && (
//                     <div>
//                       <h2 className="text-lg font-medium text-gray-900 mb-4">My Addresses</h2>
                      
//                       <form onSubmit={handleAddressSubmit} className="space-y-6 mb-8">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700">Street Address</label>
//                             <input
//                               type="text"
//                               name="street"
//                               value={addressForm.street}
//                               onChange={handleAddressChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">City</label>
//                             <input
//                               type="text"
//                               name="city"
//                               value={addressForm.city}
//                               onChange={handleAddressChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">State</label>
//                             <input
//                               type="text"
//                               name="state"
//                               value={addressForm.state}
//                               onChange={handleAddressChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Country</label>
//                             <input
//                               type="text"
//                               name="country"
//                               value={addressForm.country}
//                               onChange={handleAddressChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Zip Code</label>
//                             <input
//                               type="text"
//                               name="zipCode"
//                               value={addressForm.zipCode}
//                               onChange={handleAddressChange}
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
//                               required
//                             />
//                           </div>

//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               name="isDefault"
//                               checked={addressForm.isDefault}
//                               onChange={handleAddressChange}
//                               className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                             />
//                             <label className="ml-2 block text-sm text-gray-900">
//                               Set as default address
//                             </label>
//                           </div>
//                         </div>

//                         <div className="flex justify-end">
//                           <button
//                             type="submit"
//                             className="bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                           >
//                             Add Address
//                           </button>
//                         </div>
//                       </form>

//                       {user.address && user.address.length > 0 ? (
//                         <div className="space-y-4">
//                           {user.address.map((addr, index) => (
//                             <div key={index} className="border rounded-lg p-4">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <p className="font-medium">{addr.street}</p>
//                                   <p className="text-gray-600">
//                                     {addr.city}, {addr.state} {addr.zipCode}
//                                   </p>
//                                   <p className="text-gray-600">{addr.country}</p>
//                                   {addr.isDefault && (
//                                     <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
//                                       Default Address
//                                     </span>
//                                   )}
//                                 </div>
//                                 <button
//                                   onClick={() => handleRemoveAddress(index)}
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500 text-center py-4">No addresses saved yet.</p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default UProfile;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const UProfile = () => {
  const { user, error, success, clearMessages, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Load addresses
      loadAddresses();
      // Load orders
      loadOrders();
      // Load payment methods
      loadPaymentMethods();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      const response = await userService.getAddresses();
      setAddresses(response.data);
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await userService.getOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await userService.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressForm({
      ...addressForm,
      [e.target.name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      alert('New passwords do not match');
      setLoading(false);
      return;
    }

    const data = {
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    };

    // Add password data only if provided
    if (profileForm.currentPassword && profileForm.newPassword) {
      data.password = profileForm.currentPassword;
      data.newPassword = profileForm.newPassword;
    }

    try {
      await userService.updateProfile(data);
      setProfileForm({
        ...profileForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Refresh user data
      await refreshUser();
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    
    try {
      await userService.addAddress(addressForm);
      setAddressForm({
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        phone: '',
        isDefault: false,
      });
      // Reload addresses
      await loadAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding address');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (id, data) => {
    try {
      await userService.updateAddress(id, data);
      await loadAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await userService.deleteAddress(id);
        await loadAddresses();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting address');
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      await loadAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error setting default address');
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      try {
        await userService.deletePaymentMethod(id);
        await loadPaymentMethods();
      } catch (err) {
        alert(err.response?.data?.message || 'Error removing payment method');
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await userService.cancelOrder(orderId);
        await loadOrders();
        alert('Order cancelled successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Error cancelling order');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your account settings, addresses, and orders
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Member since {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="sm:flex">
                {/* Sidebar Navigation */}
                <div className="sm:w-1/4">
                  <nav className="space-y-1 p-4">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`${
                        activeTab === 'profile'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('address')}
                      className={`${
                        activeTab === 'address'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Addresses ({addresses.length})
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`${
                        activeTab === 'orders'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Orders ({orders.length})
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('payments')}
                      className={`${
                        activeTab === 'payments'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Methods
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`${
                        activeTab === 'settings'
                          ? 'bg-purple-50 border-purple-500 text-purple-700'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left`}
                    >
                      <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="sm:w-3/4 p-6">
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                      {success}
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-center mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                  )}

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Current Password</label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={profileForm.currentPassword}
                                onChange={handleProfileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter current password to change"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">New Password</label>
                              <input
                                type="password"
                                name="newPassword"
                                value={profileForm.newPassword}
                                onChange={handleProfileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter new password"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={profileForm.confirmPassword}
                                onChange={handleProfileChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Leave password fields blank if you don't want to change your password.
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                          >
                            {loading ? 'Updating...' : 'Update Profile'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'address' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">My Addresses</h2>
                        <span className="text-sm text-gray-500">{addresses.length} addresses</span>
                      </div>
                      
                      {/* Add Address Form */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-md font-medium text-gray-900 mb-4">Add New Address</h3>
                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">Street Address</label>
                              <input
                                type="text"
                                name="street"
                                value={addressForm.street}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">City</label>
                              <input
                                type="text"
                                name="city"
                                value={addressForm.city}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">State/Province</label>
                              <input
                                type="text"
                                name="state"
                                value={addressForm.state}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">Country</label>
                              <input
                                type="text"
                                name="country"
                                value={addressForm.country}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                              <input
                                type="text"
                                name="zipCode"
                                value={addressForm.zipCode}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input
                                type="tel"
                                name="phone"
                                value={addressForm.phone}
                                onChange={handleAddressChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="isDefault"
                                checked={addressForm.isDefault}
                                onChange={handleAddressChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 block text-sm text-gray-900">
                                Set as default shipping address
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={loading}
                              className="bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                              {loading ? 'Adding...' : 'Add Address'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Address List */}
                      {addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {addresses.map((address) => (
                            <div key={address._id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  {address.isDefault && (
                                    <span className="inline-block mb-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                      Default
                                    </span>
                                  )}
                                  <p className="font-medium text-gray-900">{address.street}</p>
                                  <p className="text-gray-600">
                                    {address.city}, {address.state} {address.zipCode}
                                  </p>
                                  <p className="text-gray-600">{address.country}</p>
                                  {address.phone && (
                                    <p className="text-gray-600 mt-1">📞 {address.phone}</p>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  {!address.isDefault && (
                                    <button
                                      onClick={() => handleSetDefaultAddress(address._id)}
                                      className="text-purple-600 hover:text-purple-900 text-sm"
                                    >
                                      Set Default
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteAddress(address._id)}
                                    className="text-red-600 hover:text-red-900 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                          <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">My Orders</h2>
                      
                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order._id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-medium text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.orderStatus === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {order.orderItems?.length || 0} items • Total: ${order.totalPrice?.toFixed(2) || '0.00'}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => window.location.href = `/orders/${order._id}`}
                                    className="text-purple-600 hover:text-purple-900 text-sm"
                                  >
                                    View Details
                                  </button>
                                  {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
                                    <button
                                      onClick={() => handleCancelOrder(order._id)}
                                      className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                          <div className="mt-6">
                            <button
                              onClick={() => window.location.href = '/products'}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                            >
                              Browse Products
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payments Tab */}
                  {activeTab === 'payments' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
                      
                      {paymentMethods.length > 0 ? (
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-lg">{method.card.brand === 'visa' ? '💳' : '🏦'}</span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} •••• {method.card.last4}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Expires {method.card.expMonth}/{method.card.expYear}
                                    </p>
                                    {method.isDefault && (
                                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeletePaymentMethod(method.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                          <p className="mt-1 text-sm text-gray-500">Add a payment method for faster checkout.</p>
                        </div>
                      )}
                      
                      <div className="mt-8">
                        <button
                          onClick={() => window.location.href = '/payment/methods/add'}
                          className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Payment Method
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
                      
                      <div className="space-y-6">
                        <div className="border rounded-lg p-6">
                          <h3 className="text-md font-medium text-gray-900 mb-4">Email Preferences</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="newsletter"
                                defaultChecked
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                                Newsletter and updates
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="promotions"
                                defaultChecked
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label htmlFor="promotions" className="ml-2 block text-sm text-gray-900">
                                Promotions and special offers
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="order-updates"
                                defaultChecked
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label htmlFor="order-updates" className="ml-2 block text-sm text-gray-900">
                                Order updates and tracking
                              </label>
                            </div>
                          </div>
                          <div className="mt-4">
                            <button className="bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                              Save Preferences
                            </button>
                          </div>
                        </div>

                        <div className="border rounded-lg p-6">
                          <h3 className="text-md font-medium text-gray-900 mb-4">Account Management</h3>
                          <div className="space-y-4">
                            <div>
                              <button
                                onClick={() => {
                                  const password = prompt('Enter your password to delete account:');
                                  if (password) {
                                    // Handle account deletion
                                    console.log('Delete account with password:', password);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Delete Account
                              </button>
                              <p className="mt-1 text-sm text-gray-500">
                                Permanently delete your account and all associated data.
                              </p>
                            </div>
                            <div>
                              <button
                                onClick={() => window.location.href = '/logout'}
                                className="text-gray-600 hover:text-gray-900 text-sm"
                              >
                                Logout from all devices
                              </button>
                              <p className="mt-1 text-sm text-gray-500">
                                Sign out from all devices where you're currently logged in.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UProfile;