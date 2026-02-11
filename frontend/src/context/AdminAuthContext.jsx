import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  loginAdmin,
  logout as adminLogout,
  getCurrentAdmin 
} from '../services/authService';
import { adminService } from '../services/adminService';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    dashboard: false,
    users: false,
    products: false,
    orders: false,
    admins: false,
    analytics: false,
    settings: false
  });

  // Initialize admin authentication
  useEffect(() => {
    const initAdminAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const adminData = await getCurrentAdmin();
          setAdmin(adminData.admin || adminData);
        }
      } catch (error) {
        console.error('Admin auth initialization error:', error);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };
    
    initAdminAuth();
  }, []);

  // Authentication methods
  const login = async (email, password) => {
    try {
      const response = await loginAdmin(email, password);
      localStorage.setItem('adminToken', response.token || response.data?.token);
      setAdmin(response.admin || response.data?.admin || response);
      return response;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
      // Clear all state on logout
      setDashboardStats(null);
      setUsers([]);
      setProducts([]);
      setOrders([]);
      setAdmins([]);
      setAnalytics(null);
      setSettings(null);
    }
  };

  // Dashboard methods
  const fetchDashboardStats = async () => {
    setLoadingStates(prev => ({ ...prev, dashboard: true }));
    try {
      const response = await adminService.getDashboardStats();
      setDashboardStats(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, dashboard: false }));
    }
  };

  // User management methods
  const fetchUsers = async () => {
    setLoadingStates(prev => ({ ...prev, users: true }));
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, users: false }));
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await adminService.getUserById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const updateUser = async (id, data) => {
    try {
      const response = await adminService.updateUser(id, data);
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, ...data } : user
      ));
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      // Remove from local state
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Product management methods
  const fetchProducts = async () => {
    setLoadingStates(prev => ({ ...prev, products: true }));
    try {
      const response = await adminService.getProducts();
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, products: false }));
    }
  };

  const createProduct = async (data) => {
    try {
      const response = await adminService.createProduct(data);
      // Add to local state
      setProducts(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await adminService.updateProduct(id, data);
      // Update local state
      setProducts(prev => prev.map(product => 
        product._id === id ? { ...product, ...data } : product
      ));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await adminService.deleteProduct(id);
      // Remove from local state
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Order management methods
  const fetchOrders = async () => {
    setLoadingStates(prev => ({ ...prev, orders: true }));
    try {
      const response = await adminService.getOrders();
      setOrders(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchOrderById = async (id) => {
    try {
      const response = await adminService.getOrderById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, data) => {
    try {
      const response = await adminService.updateOrderStatus(id, data);
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === id ? { ...order, ...data } : order
      ));
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // Analytics methods
  const fetchAnalytics = async (params = {}) => {
    setLoadingStates(prev => ({ ...prev, analytics: true }));
    try {
      const response = await adminService.getAnalytics(params);
      setAnalytics(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, analytics: false }));
    }
  };

  // Settings methods
  const fetchSettings = async () => {
    setLoadingStates(prev => ({ ...prev, settings: true }));
    try {
      const response = await adminService.getSettings();
      setSettings(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, settings: false }));
    }
  };

  const updateSettings = async (data) => {
    try {
      const response = await adminService.updateSettings(data);
      setSettings(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // File upload method
  const uploadImage = async (file) => {
    try {
      const response = await adminService.uploadImage(file);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Admin management methods (for super admin)
  const fetchAdmins = async () => {
    setLoadingStates(prev => ({ ...prev, admins: true }));
    try {
      const response = await adminService.getAdmins();
      setAdmins(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, admins: false }));
    }
  };

  const createAdmin = async (data) => {
    try {
      const response = await adminService.createAdmin(data);
      setAdmins(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  const updateAdmin = async (id, data) => {
    try {
      const response = await adminService.updateAdmin(id, data);
      setAdmins(prev => prev.map(admin => 
        admin._id === id ? { ...admin, ...data } : admin
      ));
      return response.data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  };

  const deleteAdmin = async (id) => {
    try {
      await adminService.deleteAdmin(id);
      setAdmins(prev => prev.filter(admin => admin._id !== id));
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  };

  // Value object with all methods and state
  const value = {
    // Auth state
    admin,
    loading,
    isAuthenticated: !!admin,
    
    // Data state
    dashboardStats,
    users,
    products,
    orders,
    admins,
    analytics,
    settings,
    loadingStates,
    
    // Authentication methods
    login,
    logout,
    
    // Dashboard methods
    fetchDashboardStats,
    
    // User management methods
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    
    // Product management methods
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Order management methods
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    
    // Analytics methods
    fetchAnalytics,
    
    // Settings methods
    fetchSettings,
    updateSettings,
    
    // File upload
    uploadImage,
    
    // Admin management methods (super admin only)
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    
    // Helper methods
    refetchAll: async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchUsers(),
        fetchProducts(),
        fetchOrders(),
        fetchAnalytics(),
        fetchSettings(),
        fetchAdmins()
      ]);
    },
    
    // Reset methods
    resetData: () => {
      setDashboardStats(null);
      setUsers([]);
      setProducts([]);
      setOrders([]);
      setAdmins([]);
      setAnalytics(null);
      setSettings(null);
    }
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};