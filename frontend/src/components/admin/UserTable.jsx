// import { useState } from 'react';
// import { formatDate } from '../../utils/formatters';
// import {
//   PencilIcon,
//   TrashIcon,
//   EyeIcon,
//   ChevronUpIcon,
//   ChevronDownIcon
// } from '@heroicons/react/24/outline';

// const UserTable = ({ users, onEdit, onDelete, onView }) => {
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const sortedUsers = [...users].sort((a, b) => {
//     if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
//     if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
//   const paginatedUsers = sortedUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const SortIcon = ({ field }) => {
//     if (sortField !== field) return null;
//     return sortDirection === 'asc' ? 
//       <ChevronUpIcon className="w-4 h-4 ml-1" /> : 
//       <ChevronDownIcon className="w-4 h-4 ml-1" />;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('name')}
//               >
//                 <div className="flex items-center">
//                   User
//                   <SortIcon field="name" />
//                 </div>
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('email')}
//               >
//                 <div className="flex items-center">
//                   Email
//                   <SortIcon field="email" />
//                 </div>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Phone
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
//                 onClick={() => handleSort('createdAt')}
//               >
//                 <div className="flex items-center">
//                   Joined
//                   <SortIcon field="createdAt" />
//                 </div>
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedUsers.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
//                         <span className="text-primary-600 font-medium">
//                           {user.name?.charAt(0) || 'U'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {user.name}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         ID: {user._id.slice(-6)}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{user.email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {user.phone || 'N/A'}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatDate(user.createdAt)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                     user.isActive
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     {onView && (
//                       <button
//                         onClick={() => onView(user)}
//                         className="text-gray-600 hover:text-gray-900"
//                         title="View Details"
//                       >
//                         <EyeIcon className="w-5 h-5" />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => onEdit(user)}
//                       className="text-primary-600 hover:text-primary-900"
//                       title="Edit User"
//                     >
//                       <PencilIcon className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => onDelete(user._id)}
//                       className="text-red-600 hover:text-red-900"
//                       title="Delete User"
//                     >
//                       <TrashIcon className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
//               </span>{' '}
//               of <span className="font-medium">{sortedUsers.length}</span> users
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentPage(index + 1)}
//                   className={`px-3 py-1 border rounded-md text-sm font-medium ${
//                     currentPage === index + 1
//                       ? 'bg-primary-600 text-white border-primary-600'
//                       : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserTable;

import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatters';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/solid';

const UserTable = ({ users, onEdit, onDelete, onView, onStatusChange }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;

  // Detect mobile screen
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-3 h-3 ml-1" /> : 
      <ChevronDownIcon className="w-3 h-3 ml-1" />;
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user._id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;
    
    switch(action) {
      case 'activate':
        selectedUsers.forEach(id => onStatusChange?.(id, true));
        break;
      case 'deactivate':
        selectedUsers.forEach(id => onStatusChange?.(id, false));
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedUsers.length} user(s)?`)) {
          selectedUsers.forEach(id => onDelete?.(id));
        }
        break;
      default:
        break;
    }
    
    setSelectedUsers([]);
  };

  // Mobile User Card Component
  const MobileUserCard = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user._id)}
            onChange={() => handleSelectUser(user._id)}
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">ID: {user._id.slice(-6)}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          user.isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm">
          <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600 truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center text-sm">
            <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{user.phone}</span>
          </div>
        )}
        <div className="flex items-center text-sm">
          <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600">{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-2">
          {user.orders && (
            <span className="text-xs text-gray-500">
              {user.orders} orders
            </span>
          )}
          {user.totalSpent && (
            <span className="text-xs text-gray-500">
              ${user.totalSpent.toFixed(2)} spent
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {onView && (
            <button
              onClick={() => onView(user)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="View"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header with Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Users</h2>
              <p className="text-sm text-gray-600 mt-1">
                {users.length} total users • {filteredUsers.length} shown
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {/* Handle export */}}
                className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Export Users
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showMobileFilters && (
            <div className="sm:hidden bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Filters</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Active Only
                </button>
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {selectedUsers.length} user(s) selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="inline-flex items-center px-3 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100"
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="p-4">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <MobileUserCard key={user._id} user={user} />
            ))
          ) : (
            <div className="text-center py-12">
              <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'No users in the system'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                {[
                  { field: 'name', label: 'User' },
                  { field: 'email', label: 'Email' },
                  { label: 'Phone' },
                  { field: 'createdAt', label: 'Joined' },
                  { label: 'Status' },
                  { label: 'Orders' },
                  { label: 'Actions' }
                ].map((column) => (
                  <th 
                    key={column.label}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.field ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={column.field ? () => handleSort(column.field) : undefined}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.field && <SortIcon field={column.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {user._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-[200px]">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onStatusChange?.(user._id, !user.isActive)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.orders || 0} orders
                    {user.totalSpent && (
                      <div className="text-xs text-gray-400">
                        ${user.totalSpent?.toFixed(2)} spent
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(user)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1.5 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                        title="Edit User"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user._id)}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
              </span>{' '}
              of <span className="font-medium">{sortedUsers.length}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              {/* Desktop Pagination Numbers */}
              <div className="hidden sm:flex items-center space-x-1">
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                  
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1.5 text-sm rounded-lg ${
                          currentPage === i
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>
              
              {/* Mobile Pagination Info */}
              <div className="sm:hidden text-sm font-medium text-gray-900">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {paginatedUsers.length === 0 && !isMobile && (
        <div className="text-center py-16">
          <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters'
              : 'No users have registered yet'}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTable;