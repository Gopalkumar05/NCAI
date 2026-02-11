// pages/ForgotPassword.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For admin forgot password
      await forgotPassword(email, true);
      setEmailSent(true);
      showAlert('success', 'Password reset instructions have been sent to your email.');
    } catch (error) {
      showAlert('error', error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your admin email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {alert.show && (
          <Alert type={alert.type} message={alert.message} />
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow border border-gray-200 rounded-lg sm:px-10">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send reset instructions'}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 text-sm"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Check your email
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                We've sent password reset instructions to <span className="font-medium text-gray-900">{email}</span>.
                Please check your email and follow the link to reset your password.
              </p>

              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  <p className="mb-2">Didn't receive the email?</p>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Try again
                  </button>
                </div>

                <div className="pt-4">
                  <Link
                    to="/alogin"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
                  >
                    ← Return to login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs text-center text-gray-500">
            For security reasons, password reset links expire after 10 minutes.
            Make sure to check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;