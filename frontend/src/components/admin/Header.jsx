// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// const Header = ({ user }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { logout } = useAuth();

//   return (
//     <header className="bg-white border-b border-gray-200 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <button className="relative p-2 text-gray-600 hover:text-gray-900">
//             <BellIcon className="w-6 h-6" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>
          
//           <div className="relative">
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
//             >
//               <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
//                 <span className="text-primary-600 font-medium">
//                   {user?.firstName?.charAt(0) || 'A'}
//                 </span>
//               </div>
//               <div className="text-left hidden md:block">
//                 <p className="text-sm font-medium text-gray-700">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
//               </div>
//               <ChevronDownIcon className="w-5 h-5 text-gray-400" />
//             </button>
            
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                 <Link
//                   to="/admin/profile"
//                   className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
//                 >
//                   Profile Settings
//                 </Link>
//                 <button
//                   onClick={logout}
//                   className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BellIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/solid';

const Header = ({ user, onToggleSidebar, sidebarOpen }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout } = useAuth();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock notifications data
  useEffect(() => {
    // In a real app, fetch from API
    const mockNotifications = [
      { id: 1, title: 'New Order', message: 'Order #1234 has been placed', time: '2 min ago', read: false },
      { id: 2, title: 'Low Stock', message: 'Rose Bouquet is running low', time: '1 hour ago', read: true },
      { id: 3, title: 'Payment Received', message: 'Payment for order #1230 confirmed', time: '2 hours ago', read: true },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('orders')) return 'Orders Management';
    if (path.includes('products')) return 'Products Management';
    if (path.includes('users')) return 'Users Management';
    if (path.includes('analytics')) return 'Analytics Dashboard';
    if (path.includes('settings')) return 'Settings';
    return 'Dashboard Overview';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Mobile menu button and title */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* Desktop logo/name */}
            <div className="hidden md:flex items-center">
              <Link to="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                  FloristPro
                </span>
              </Link>
              <div className="ml-6 pl-6 border-l border-gray-200">
                <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
              </div>
            </div>

            {/* Mobile title */}
            <div className="md:hidden ml-2">
              <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[200px]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center section - Search bar (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search orders, products, customers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right section - Actions and user menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Help button */}
            <button
              className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Help"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>

            {/* Notifications dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                aria-label="Notifications"
              >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <BellIcon className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-2 text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/admin/notifications"
                    className="block text-center px-4 py-3 text-sm text-primary-600 hover:bg-gray-50 border-t border-gray-200"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Settings link */}
            <Link
              to="/admin/settings"
              className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </Link>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {user?.firstName || user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ') || 'Administrator'}
                  </p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-900 truncate">
                      {user?.firstName || user?.name || 'Admin User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="w-5 h-5 mr-3">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      My Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-3" />
                      Settings
                    </Link>
                    <Link
                      to="/admin/help"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
                      Help & Support
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <div className="w-5 h-5 mr-3">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="lg:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search orders, products, customers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;