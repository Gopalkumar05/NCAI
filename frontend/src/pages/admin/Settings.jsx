import { useState } from 'react';
import Alert from '../../components/common/Alert';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Floral Heaven',
    siteEmail: 'support@floralheaven.com',
    currency: 'USD',
    timezone: 'UTC',
    maintenanceMode: false,
    allowRegistration: true,
    enableReviews: true,
    notificationEmail: true,
    notificationOrder: true,
    notificationUser: true
  });

  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Save settings to API
      showAlert('success', 'Settings saved successfully');
    } catch (error) {
      showAlert('error', 'Failed to save settings');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  return (
    <div>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['General', 'Store', 'Email', 'Notifications', 'Security'].map((tab) => (
              <button
                key={tab}
                className="py-4 px-6 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* General Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="siteEmail"
                    value={settings.siteEmail}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Store Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Store Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Maintenance Mode</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow User Registration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableReviews"
                    checked={settings.enableReviews}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Product Reviews</span>
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notificationEmail"
                    checked={settings.notificationEmail}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notificationOrder"
                    checked={settings.notificationOrder}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Order Updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notificationUser"
                    checked={settings.notificationUser}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">New User Registration</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-secondary mr-3"
                >
                  Reset to Default
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;