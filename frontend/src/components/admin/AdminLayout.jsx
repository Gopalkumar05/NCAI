





// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { useAuth } from '../../context/AuthContext';

// const AdminLayout = () => {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header user={user} />
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Close sidebar on desktop resize
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [sidebarOpen, isMobile]);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <Header 
        user={user} 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:w-64`}
        >
          <Sidebar onClose={closeSidebar} />
        </aside>

        {/* Main Content */}
        <main 
          className={`flex-1 w-full min-h-screen transition-all duration-300 ${
            sidebarOpen && isMobile ? 'lg:blur-0' : ''
          }`}
        >
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;