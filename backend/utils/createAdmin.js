const Admin = require('../models/Admin');
const mongoose = require('mongoose');
require('dotenv').config();

const createInitialAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect("mongodb://localhost:27017/flower_shop");
    console.log('✅ Connected to database');
    
    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists');
      return;
    }
    
    // Create super admin
    const superAdminData = {
      firstName: 'Super',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@flowershop.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
      phone: '+1234567890',
      department: 'management',
      designation: 'System Administrator',
      isVerified: true,
      isActive: true
    };
    
    const superAdmin = await Admin.createSuperAdmin(superAdminData);
    
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Password:', process.env.DEFAULT_ADMIN_PASSWORD || 'admin123');
    console.log('⚠️ IMPORTANT: Change the password immediately after first login!');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  createInitialAdmin();
}

module.exports = createInitialAdmin;