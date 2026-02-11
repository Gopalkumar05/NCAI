import { useState, useEffect } from 'react';
import UserTable from '../../components/admin/UserTable';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { adminService } from '../../services/adminService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      showAlert('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        showAlert('success', 'User deleted successfully');
      } catch (error) {
        showAlert('error', 'Failed to delete user');
      }
    }
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser?._id) {
        const response = await adminService.updateUser(selectedUser._id, userData);
        setUsers(users.map(user => 
          user._id === selectedUser._id ? response.data : user
        ));
        showAlert('success', 'User updated successfully');
      }
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      showAlert('error', 'Failed to update user');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  if (loading) return <Loader />;

  return (
    <div>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false, type: '', message: '' })} />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            className="input-field max-w-xs"
          />
          <button className="btn-primary">
            Export Users
          </button>
        </div>
      </div>
      
      <UserTable 
        users={users} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                defaultValue={selectedUser.name}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={selectedUser.email}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                defaultValue={selectedUser.phone}
                className="input-field"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                defaultChecked={selectedUser.isActive}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Account
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(selectedUser)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;