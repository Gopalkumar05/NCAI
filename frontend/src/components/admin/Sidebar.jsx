// import { NavLink } from 'react-router-dom';
// import {
//   HomeIcon,
//   UsersIcon,
//   ShoppingBagIcon,
//  ClipboardDocumentListIcon,
//   CogIcon,
//   ChartBarIcon,
// } from '@heroicons/react/24/outline';

// const Sidebar = () => {
//   const navItems = [
//     { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
//     { to: '/admin/users', icon: UsersIcon, label: 'Users' },
//     { to: '/admin/products-page', icon: ShoppingBagIcon, label: 'Products' },
//     { to: '/admin/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
//     { to: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
//     { to: '/admin/settings', icon: CogIcon, label: 'Settings' },
//   ];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
//       <nav className="p-4">
//         <ul className="space-y-2">
//           {navItems.map((item) => (
//             <li key={item.to}>
//               <NavLink
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `flex items-center px-4 py-3 rounded-lg transition-colors ${
//                     isActive
//                       ? 'bg-primary-50 text-primary-600'
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`
//                 }
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 {item.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/admin/users', icon: UsersIcon, label: 'Users' },
    { to: '/admin/products-page', icon: ShoppingBagIcon, label: 'Products' },
    { to: '/admin/orders', icon: ClipboardDocumentListIcon, label: 'Orders' },
    { to: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { to: '/admin/settings', icon: CogIcon, label: 'Settings' },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-end p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Close menu"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {/* Desktop Logo/Title */}
        <div className="hidden lg:block mb-6 p-2">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </div>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`
                }
                end={item.to === '/admin/dashboard'}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="px-2 sm:px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              System Status
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 truncate">Last Updated</span>
              <span className="text-sm font-medium text-gray-900 ml-2">Just now</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 truncate">Uptime</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                99.9%
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;


// import { NavLink, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {
//   HomeIcon,
//   UsersIcon,
//   ShoppingBagIcon,
//   ClipboardDocumentListIcon,
//   CogIcon,
//   ChartBarIcon,
//   DocumentTextIcon,
//   TagIcon,
//   CalendarIcon,
//   InboxIcon,
//   CreditCardIcon,
//   QuestionMarkCircleIcon,
//   ArrowRightOnRectangleIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   Bars3Icon,
//   BellIcon,
//   UserCircleIcon,
// } from "@heroicons/react/24/outline";
// import {
//   HomeIcon as HomeIconSolid,
//   UsersIcon as UsersIconSolid,
//   ShoppingBagIcon as ShoppingBagIconSolid,
//   ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
//   CogIcon as CogIconSolid,
//   ChartBarIcon as ChartBarIconSolid,
// } from "@heroicons/react/24/solid";

// const Sidebar = ({ isMobile, onItemClick }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const location = useLocation();
//   const [activeSubmenu, setActiveSubmenu] = useState(null);

//   // Auto-collapse on mobile
//   useEffect(() => {
//     if (isMobile) {
//       setCollapsed(false);
//     }
//   }, [isMobile]);

//   const mainNavItems = [
//     {
//       to: "/admin/dashboard",
//       icon: collapsed || hovered ? HomeIcon : HomeIconSolid,
//       activeIcon: HomeIconSolid,
//       label: "Dashboard",
//       count: null,
//     },
//     {
//       to: "/admin/users",
//       icon: collapsed || hovered ? UsersIcon : UsersIconSolid,
//       activeIcon: UsersIconSolid,
//       label: "Users",
//       count: 24,
//     },
//     {
//       to: "/admin/products",
//       icon: collapsed || hovered ? ShoppingBagIcon : ShoppingBagIconSolid,
//       activeIcon: ShoppingBagIconSolid,
//       label: "Products",
//       count: 156,
//       submenu: [
//         { to: "/admin/products/all", label: "All Products" },
//         { to: "/admin/products/categories", label: "Categories" },
//         { to: "/admin/products/inventory", label: "Inventory" },
//         { to: "/admin/products/reviews", label: "Reviews" },
//       ],
//     },
//     {
//       to: "/admin/orders",
//       icon:
//         collapsed || hovered
//           ? ClipboardDocumentListIcon
//           : ClipboardDocumentListIconSolid,
//       activeIcon: ClipboardDocumentListIconSolid,
//       label: "Orders",
//       count: 42,
//       badge: "new",
//     },
//     {
//       to: "/admin/analytics",
//       icon: collapsed || hovered ? ChartBarIcon : ChartBarIconSolid,
//       activeIcon: ChartBarIconSolid,
//       label: "Analytics",
//       count: null,
//     },
//   ];

//   const secondaryNavItems = [
//     {
//       to: "/admin/settings",
//       icon: collapsed || hovered ? CogIcon : CogIconSolid,
//       activeIcon: CogIconSolid,
//       label: "Settings",
//       submenu: [
//         { to: "/admin/settings/general", label: "General" },
//         { to: "/admin/settings/payments", label: "Payments" },
//         { to: "/admin/settings/shipping", label: "Shipping" },
//         { to: "/admin/settings/notifications", label: "Notifications" },
//       ],
//     },
//     {
//       to: "/admin/support",
//       icon: QuestionMarkCircleIcon,
//       activeIcon: QuestionMarkCircleIcon,
//       label: "Help & Support",
//     },
//   ];

//   const quickStats = [
//     { label: "Today's Orders", value: "12", color: "bg-green-500" },
//     { label: "Pending Orders", value: "8", color: "bg-yellow-500" },
//     { label: "Revenue Today", value: "$1,240", color: "bg-blue-500" },
//   ];

//   const getActiveIcon = (item, isActive) => {
//     return isActive ? item.activeIcon : item.icon;
//   };

//   const toggleSubmenu = (itemLabel) => {
//     setActiveSubmenu(activeSubmenu === itemLabel ? null : itemLabel);
//   };

//   const isSubmenuActive = (submenu) => {
//     return submenu?.some((item) => location.pathname === item.to) || false;
//   };

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside
//         className={`hidden md:flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out h-screen sticky top-0 ${
//           collapsed ? "w-20" : "w-64"
//         } ${hovered && collapsed ? "w-64" : ""}`}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {/* Logo and Toggle */}
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           {!collapsed || hovered ? (
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <ShoppingBagIconSolid className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
//                 FloristPro
//               </span>
//             </div>
//           ) : (
//             <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
//               <ShoppingBagIconSolid className="w-5 h-5 text-white" />
//             </div>
//           )}

//           {(!collapsed || hovered) && (
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//               aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             >
//               <ChevronLeftIcon
//                 className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
//               />
//             </button>
//           )}
//         </div>

//         {/* Quick Stats - Only visible when expanded */}
//         {(!collapsed || hovered) && (
//           <div className="px-4 py-3 border-b border-gray-200">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//               Quick Stats
//             </h3>
//             <div className="space-y-2">
//               {quickStats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100"
//                 >
//                   <span className="text-sm text-gray-600">{stat.label}</span>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-semibold text-gray-900">
//                       {stat.value}
//                     </span>
//                     <div className={`w-2 h-2 ${stat.color} rounded-full`}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Main Navigation */}
//         <nav className="flex-1 overflow-y-auto py-4 px-2">
//           <div className="space-y-1">
//             <h3
//               className={`text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 ${
//                 collapsed && !hovered ? "text-center" : ""
//               }`}
//             >
//               {!collapsed || hovered ? "Main Menu" : "•"}
//             </h3>

//             {mainNavItems.map((item) => {
//               const isActive = location.pathname.startsWith(item.to);
//               const hasSubmenu = item.submenu && (!collapsed || hovered);
//               const isSubmenuOpen = activeSubmenu === item.label;
//               const isSubmenuItemActive = isSubmenuActive(item.submenu);

//               return (
//                 <div key={item.to} className="relative">
//                   <NavLink
//                     to={item.to}
//                     onClick={(e) => {
//                       if (hasSubmenu) {
//                         e.preventDefault();
//                         toggleSubmenu(item.label);
//                       } else {
//                         if (isMobile) onItemClick?.();
//                       }
//                     }}
//                     className={({ isActive: navIsActive }) =>
//                       `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
//                         navIsActive || isSubmenuItemActive
//                           ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-100"
//                           : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                       } ${collapsed && !hovered ? "justify-center px-3" : ""}`
//                     }
//                   >
//                     <div className="relative">
//                       {(() => {
//                         const Icon = getActiveIcon(
//                           item,
//                           isActive || isSubmenuItemActive,
//                         );
//                         return (
//                           <Icon
//                             className={`w-5 h-5 ${collapsed && !hovered ? "" : "mr-3"}`}
//                           />
//                         );
//                       })()}

//                       {item.badge && (!collapsed || hovered) && (
//                         <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                       )}
//                     </div>

//                     {(!collapsed || hovered) && (
//                       <>
//                         <span className="font-medium flex-1">{item.label}</span>
//                         <div className="flex items-center space-x-2">
//                           {item.count !== null && (
//                             <span
//                               className={`text-xs px-2 py-1 rounded-full ${
//                                 isActive || isSubmenuItemActive
//                                   ? "bg-primary-200 text-primary-800"
//                                   : "bg-gray-200 text-gray-700"
//                               }`}
//                             >
//                               {item.count}
//                             </span>
//                           )}
//                           {hasSubmenu && (
//                             <ChevronRightIcon
//                               className={`w-4 h-4 transition-transform ${isSubmenuOpen ? "rotate-90" : ""}`}
//                             />
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </NavLink>

//                   {/* Submenu */}
//                   {hasSubmenu && isSubmenuOpen && (
//                     <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-gray-200">
//                       {item.submenu.map((subItem) => (
//                         <NavLink
//                           key={subItem.to}
//                           to={subItem.to}
//                           onClick={() => {
//                             if (isMobile) onItemClick?.();
//                           }}
//                           className={({ isActive }) =>
//                             `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                               isActive
//                                 ? "bg-primary-50 text-primary-600 font-medium"
//                                 : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                             }`
//                           }
//                         >
//                           <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
//                           {subItem.label}
//                         </NavLink>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Secondary Navigation */}
//           <div className="mt-8 space-y-1">
//             <h3
//               className={`text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 ${
//                 collapsed && !hovered ? "text-center" : ""
//               }`}
//             >
//               {!collapsed || hovered ? "System" : "••"}
//             </h3>

//             {secondaryNavItems.map((item) => {
//               const isActive = location.pathname.startsWith(item.to);
//               const hasSubmenu = item.submenu && (!collapsed || hovered);
//               const isSubmenuOpen = activeSubmenu === item.label;
//               const isSubmenuItemActive = isSubmenuActive(item.submenu);

//               return (
//                 <div key={item.to} className="relative">
//                   <NavLink
//                     to={item.to}
//                     onClick={(e) => {
//                       if (hasSubmenu) {
//                         e.preventDefault();
//                         toggleSubmenu(item.label);
//                       } else {
//                         if (isMobile) onItemClick?.();
//                       }
//                     }}
//                     className={({ isActive: navIsActive }) =>
//                       `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
//                         navIsActive || isSubmenuItemActive
//                           ? "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-100"
//                           : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                       } ${collapsed && !hovered ? "justify-center px-3" : ""}`
//                     }
//                   >
//                     {(() => {
//                       const Icon = getActiveIcon(
//                         item,
//                         isActive || isSubmenuItemActive,
//                       );
//                       return (
//                         <Icon
//                           className={`w-5 h-5 ${collapsed && !hovered ? "" : "mr-3"}`}
//                         />
//                       );
//                     })()}

//                     {(!collapsed || hovered) && (
//                       <>
//                         <span className="font-medium flex-1">{item.label}</span>
//                         {hasSubmenu && (
//                           <ChevronRightIcon
//                             className={`w-4 h-4 transition-transform ${isSubmenuOpen ? "rotate-90" : ""}`}
//                           />
//                         )}
//                       </>
//                     )}
//                   </NavLink>

//                   {/* Submenu */}
//                   {hasSubmenu && isSubmenuOpen && (
//                     <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-gray-200">
//                       {item.submenu.map((subItem) => (
//                         <NavLink
//                           key={subItem.to}
//                           to={subItem.to}
//                           onClick={() => {
//                             if (isMobile) onItemClick?.();
//                           }}
//                           className={({ isActive }) =>
//                             `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
//                               isActive
//                                 ? "bg-gray-50 text-gray-700 font-medium"
//                                 : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                             }`
//                           }
//                         >
//                           <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3"></div>
//                           {subItem.label}
//                         </NavLink>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </nav>

//         {/* User Profile & Logout - Only visible when expanded */}
//         {(!collapsed || hovered) && (
//           <div className="p-4 border-t border-gray-200">
//             <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
//               <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 A
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   Admin User
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">
//                   admin@floristpro.com
//                 </p>
//               </div>
//             </div>

//             <button className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//               <ArrowRightOnRectangleIcon className="w-5 h-5" />
//               <span>Logout</span>
//             </button>
//           </div>
//         )}
//       </aside>

//       {/* Mobile Bottom Navigation */}
//       {isMobile && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
//           <div className="flex justify-around items-center h-16">
//             {mainNavItems.slice(0, 4).map((item) => {
//               const isActive = location.pathname.startsWith(item.to);

//               return (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   onClick={onItemClick}
//                   className={({ isActive: navIsActive }) =>
//                     `flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
//                       navIsActive ? "text-primary-600" : "text-gray-500"
//                     }`
//                   }
//                 >
//                   <div className="relative">
//                    {(() => {
//   const Icon = getActiveIcon(item, isActive);
//   return <Icon className="w-6 h-6" />;
// })()}

//                     {item.badge && (
//                       <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                     )}
//                   </div>
//                   <span className="text-xs mt-1">{item.label}</span>
//                 </NavLink>
//               );
//             })}

//             {/* More menu for additional items */}
//             <button
//               onClick={() =>
//                 setActiveSubmenu(activeSubmenu === "more" ? null : "more")
//               }
//               className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500"
//             >
//               <Bars3Icon className="w-6 h-6" />
//               <span className="text-xs mt-1">More</span>
//             </button>
//           </div>

//           {/* Mobile More Menu Dropdown */}
//           {activeSubmenu === "more" && (
//             <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
//               <div className="p-4 grid grid-cols-2 gap-2">
//                 {[...mainNavItems.slice(4), ...secondaryNavItems].map(
//                   (item) => {
//                     const isActive = location.pathname.startsWith(item.to);

//                     return (
//                       <NavLink
//                         key={item.to}
//                         to={item.to}
//                         onClick={() => {
//                           setActiveSubmenu(null);
//                           onItemClick?.();
//                         }}
//                         className={`flex items-center space-x-2 p-3 rounded-lg ${
//                           isActive
//                             ? "bg-primary-50 text-primary-600"
//                             : "text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                        {(() => {
//   const Icon = getActiveIcon(item, isActive);
//   return <Icon className="w-5 h-5" />;
// })()}

//                         <span className="font-medium">{item.label}</span>
//                       </NavLink>
//                     );
//                   },
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// // Optional: Skeleton loader for sidebar
// export const SidebarSkeleton = () => (
//   <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 animate-pulse">
//     <div className="p-6 border-b border-gray-200">
//       <div className="h-8 bg-gray-300 rounded w-32"></div>
//     </div>
//     <nav className="flex-1 p-4">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="h-12 bg-gray-200 rounded-lg mb-2"></div>
//       ))}
//     </nav>
//     <div className="p-4 border-t border-gray-200">
//       <div className="h-10 bg-gray-200 rounded"></div>
//     </div>
//   </aside>
// );

// export default Sidebar;
