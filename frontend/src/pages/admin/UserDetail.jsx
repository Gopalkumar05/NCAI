import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { adminService } from '../../services/adminService';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await adminService.getUserById(id);
      setUser(response.data.user);
      setOrders(response.data.orders || []);
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || '',
        isActive: response.data.user.isActive
      });
    } catch (error) {
      showAlert('error', 'Failed to fetch user data');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await adminService.updateUser(id, formData);
      setUser(response.data);
      setEditing(false);
      showAlert('success', 'User updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(id);
        showAlert('success', 'User deleted successfully');
        navigate('/admin/users');
      } catch (error) {
        showAlert('error', 'Failed to delete user');
      }
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  if (loading) return <Loader />;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-primary-600 hover:text-primary-900 mb-4 inline-flex items-center"
        >
          ← Back to Users
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditing(!editing)}
              className="btn-secondary"
            >
              {editing ? 'Cancel Edit' : 'Edit User'}
            </button>
            <button
              onClick={handleDelete}
              className="btn-secondary text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? 'Edit User Information' : 'User Information'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <p className="text-gray-900 text-sm font-mono">{user._id}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    {editing ? (
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={user.isActive}
                        disabled
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    )}
                    <span className="ml-2 text-sm text-gray-700">Active Account</span>
                  </label>
                </div>
              </div>

              {editing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                <span className="text-sm text-gray-500">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
            </div>
            <div className="p-6">
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{order._id.slice(-8)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ${order.totalPrice.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                              order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="text-primary-600 hover:text-primary-900 text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders found for this user</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - User Stats & Actions */}
        <div className="space-y-6">
          {/* User Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-900">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full btn-secondary">
                Send Welcome Email
              </button>
              <button className="w-full btn-secondary">
                Reset Password
              </button>
              <button className="w-full btn-secondary">
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;