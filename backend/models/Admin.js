const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries by default
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: {
      values: ['super_admin', 'admin', 'manager', 'support'],
      message: 'Invalid admin role'
    },
    default: 'admin'
  },
  
  permissions: {
    // Product Management
    canManageProducts: {
      type: Boolean,
      default: true
    },
    canCreateProducts: {
      type: Boolean,
      default: true
    },
    canEditProducts: {
      type: Boolean,
      default: true
    },
    canDeleteProducts: {
      type: Boolean,
      default: true
    },
    
    // Order Management
    canManageOrders: {
      type: Boolean,
      default: true
    },
    canViewOrders: {
      type: Boolean,
      default: true
    },
    canUpdateOrderStatus: {
      type: Boolean,
      default: true
    },
    canCancelOrders: {
      type: Boolean,
      default: true
    },
    
    // User Management
    canManageUsers: {
      type: Boolean,
      default: true
    },
    canViewUsers: {
      type: Boolean,
      default: true
    },
    canEditUsers: {
      type: Boolean,
      default: true
    },
    canDeleteUsers: {
      type: Boolean,
      default: true
    },
    
    // Category & Inventory
    canManageCategories: {
      type: Boolean,
      default: true
    },
    canManageInventory: {
      type: Boolean,
      default: true
    },
    
    // Content Management
    canManageContent: {
      type: Boolean,
      default: true
    },
    canManageBlog: {
      type: Boolean,
      default: true
    },
    canManageBanners: {
      type: Boolean,
      default: true
    },
    
    // Analytics & Reports
    canViewAnalytics: {
      type: Boolean,
      default: true
    },
    canGenerateReports: {
      type: Boolean,
      default: true
    },
    
    // System Settings
    canManageSettings: {
      type: Boolean,
      default: false
    },
    canManageAdmins: {
      type: Boolean,
      default: false
    }
  },
  
  // Profile Information
  profileImage: {
    url: String,
    public_id: String
  },
  
  department: {
    type: String,
    enum: ['operations', 'sales', 'customer_service', 'inventory', 'marketing', 'management'],
    default: 'operations'
  },
  
  designation: {
    type: String,
    trim: true,
    maxlength: [100, 'Designation cannot exceed 100 characters']
  },
  
  // Security and Access
  lastLogin: {
    type: Date
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Two-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  twoFactorSecret: {
    type: String,
    select: false
  },
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Account Verification
  verificationToken: String,
  verificationTokenExpires: Date,
  
  // Activity Tracking
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  ipAddress: String,
  userAgent: String,
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for admin status
adminSchema.virtual('isSuperAdmin').get(function() {
  return this.role === 'super_admin';
});

// Virtual for isLocked
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ role: 1 });
adminSchema.index({ department: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ createdAt: -1 });
adminSchema.index({ lastLogin: -1 });

// Pre-save middleware
adminSchema.pre('save', async function() {
  // Update timestamps
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      
      // Reset login attempts on password change
      this.loginAttempts = 0;
      this.lockUntil = undefined;
    } catch (error) {
      return error;
    }
  }
  
  // Generate verification token for new admins
  if (this.isNew && !this.isVerified) {
    this.verificationToken = crypto.randomBytes(32).toString('hex');
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  }
  
 
});

// Instance Methods
adminSchema.methods = {
  // Compare password
  comparePassword: async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },
  
  // Generate password reset token
  createPasswordResetToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
  },
  
  // Generate verification token
  createVerificationToken: function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.verificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return verificationToken;
  },
  
  // Increment login attempts
  incrementLoginAttempts: function() {
    // If lock has expired, reset attempts
    if (this.lockUntil && this.lockUntil < Date.now()) {
      this.loginAttempts = 1;
      this.lockUntil = undefined;
      return this.save();
    }
    
    // Increase login attempts
    this.loginAttempts += 1;
    
    // Lock account if too many failed attempts
    if (this.loginAttempts >= 5 && !this.isLocked) {
      this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
    }
    
    return this.save();
  },
  
  // Reset login attempts
  resetLoginAttempts: function() {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLogin = Date.now();
    return this.save();
  },
  
  // Check if admin has permission
  hasPermission: function(permission) {
    if (this.role === 'super_admin') {
      return true;
    }
    
    // Check specific permission
    if (this.permissions && this.permissions[permission] !== undefined) {
      return this.permissions[permission];
    }
    
    // Default to false if permission not found
    return false;
  },
  
  // Get all permissions
  getAllPermissions: function() {
    const permissions = {};
    
    // Super admin has all permissions
    if (this.role === 'super_admin') {
      Object.keys(this.permissions).forEach(key => {
        permissions[key] = true;
      });
    } else {
      // Regular admin has permissions as defined
      Object.keys(this.permissions).forEach(key => {
        permissions[key] = this.permissions[key];
      });
    }
    
    return permissions;
  },
  
  // Check if admin can access route
  canAccessRoute: function(route) {
    const routePermissions = {
      '/api/admin/products': 'canManageProducts',
      '/api/admin/products/create': 'canCreateProducts',
      '/api/admin/products/:id/edit': 'canEditProducts',
      '/api/admin/products/:id/delete': 'canDeleteProducts',
      '/api/admin/orders': 'canManageOrders',
      '/api/admin/users': 'canManageUsers',
      '/api/admin/categories': 'canManageCategories',
      '/api/admin/inventory': 'canManageInventory',
      '/api/admin/analytics': 'canViewAnalytics',
      '/api/admin/settings': 'canManageSettings',
      '/api/admin/admins': 'canManageAdmins'
    };
    
    const permissionNeeded = routePermissions[route];
    if (!permissionNeeded) {
      return false; // Route not defined in permissions
    }
    
    return this.hasPermission(permissionNeeded);
  }
};

// Static Methods
adminSchema.statics = {
  // Find admin by email
  findByEmail: function(email) {
    return this.findOne({ email: email.toLowerCase() });
  },
  
  // Create initial super admin
  createSuperAdmin: async function(data) {
    const existingSuperAdmin = await this.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      throw new Error('Super admin already exists');
    }
    
    const superAdmin = new this({
      ...data,
      role: 'super_admin',
      isVerified: true,
      isActive: true
    });
    
    // Grant all permissions to super admin
    Object.keys(superAdmin.permissions).forEach(key => {
      superAdmin.permissions[key] = true;
    });
    
    return superAdmin.save();
  },
  
  // Get active admins
  getActiveAdmins: function() {
    return this.find({ isActive: true }).sort({ createdAt: -1 });
  },
  
  // Search admins
  searchAdmins: function(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { designation: regex }
      ],
      isActive: true
    });
  },
  
  // Get admin statistics
  getAdminStats: async function() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null,
          totalAdmins: { $sum: 1 },
          activeAdmins: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          superAdmins: {
            $sum: { $cond: [{ $eq: ['$role', 'super_admin'] }, 1, 0] }
          },
          admins: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          managers: {
            $sum: { $cond: [{ $eq: ['$role', 'manager'] }, 1, 0] }
          },
          support: {
            $sum: { $cond: [{ $eq: ['$role', 'support'] }, 1, 0] }
          }
        }
      }
    ]);
    
    return stats[0] || {
      totalAdmins: 0,
      activeAdmins: 0,
      superAdmins: 0,
      admins: 0,
      managers: 0,
      support: 0
    };
  }
};

// Query Helpers
adminSchema.query = {
  // Filter by role
  byRole: function(role) {
    return this.where({ role });
  },
  
  // Filter by department
  byDepartment: function(department) {
    return this.where({ department });
  },
  
  // Filter active only
  activeOnly: function() {
    return this.where({ isActive: true });
  },
  
  // Exclude super admins
  excludeSuperAdmins: function() {
    return this.where({ role: { $ne: 'super_admin' } });
  }
};

// Middleware to update updatedBy
adminSchema.pre('findOneAndUpdate', function() {
  if (this._update) {
    this._update.updatedAt = Date.now();
  }
 
});

// Export the model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;