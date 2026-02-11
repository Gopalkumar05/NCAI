// Date Formatters
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return date.toLocaleDateString('en-US', mergedOptions);
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Currency Formatters
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyCompact = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '';
  
  if (amount >= 1000000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount);
  }
  
  return formatCurrency(amount, currency, locale);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '';
  
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Text Formatters
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + suffix;
};

export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if doesn't match common formats
  return phoneNumber;
};

// Number Formatters
export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined) return '';
  
  return new Intl.NumberFormat(locale).format(number);
};

export const formatNumberCompact = (number, locale = 'en-US') => {
  if (number === null || number === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Address Formatters
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

export const formatFullName = (user) => {
  if (!user) return '';
  
  const parts = [];
  if (user.firstName) parts.push(user.firstName);
  if (user.lastName) parts.push(user.lastName);
  
  return parts.join(' ') || user.name || '';
};

// Order/Status Formatters
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || capitalize(status);
};

export const formatPaymentMethod = (method) => {
  const methodMap = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    stripe: 'Stripe',
    cash: 'Cash',
    bank_transfer: 'Bank Transfer',
  };
  
  return methodMap[method] || capitalizeWords(method);
};

// Social/URL Formatters
export const formatSocialHandle = (handle, platform = 'twitter') => {
  if (!handle) return '';
  
  const handleClean = handle.replace('@', '');
  
  const platformUrls = {
    twitter: `https://twitter.com/${handleClean}`,
    instagram: `https://instagram.com/${handleClean}`,
    facebook: `https://facebook.com/${handleClean}`,
    linkedin: `https://linkedin.com/in/${handleClean}`,
    github: `https://github.com/${handleClean}`,
  };
  
  return platformUrls[platform] || handle;
};

export const formatUrl = (url) => {
  if (!url) return '';
  
  // Add https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

// Validation Formatters
export const formatEmail = (email) => {
  if (!email) return '';
  
  // Simple email validation and formatting
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email';
  }
  
  return email.toLowerCase();
};

export const maskEmail = (email) => {
  if (!email) return '';
  
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;
  
  const maskedLocal = localPart.length > 2 
    ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
    : '*'.repeat(localPart.length);
  
  return `${maskedLocal}@${domain}`;
};

export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 12) return cardNumber;
  
  const lastFour = cleaned.slice(-4);
  const masked = '•'.repeat(cleaned.length - 4);
  
  return masked + lastFour;
};

// Array/List Formatters
export const formatList = (items, conjunction = 'and') => {
  if (!items || !Array.isArray(items) || items.length === 0) return '';
  
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  
  return `${allButLast}, ${conjunction} ${last}`;
};

export const formatKeyValuePairs = (obj, separator = ': ') => {
  if (!obj || typeof obj !== 'object') return '';
  
  return Object.entries(obj)
    .map(([key, value]) => `${capitalizeWords(key)}${separator}${value}`)
    .join('\n');
};

// Duration/Time Formatters
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }
  
  return parts.join(' ');
};

// Color Formatters
export const hexToRgb = (hex) => {
  if (!hex) return '';
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const rgbToHex = (r, g, b) => {
  return `#${[r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`;
};

// Default export
export default {
  formatDate,
  formatDateShort,
  formatTimeAgo,
  formatCurrency,
  formatCurrencyCompact,
  formatPercentage,
  truncateText,
  capitalize,
  capitalizeWords,
  formatPhoneNumber,
  formatNumber,
  formatNumberCompact,
  formatFileSize,
  formatAddress,
  formatFullName,
  formatOrderStatus,
  formatPaymentMethod,
  formatSocialHandle,
  formatUrl,
  formatEmail,
  maskEmail,
  maskCreditCard,
  formatList,
  formatKeyValuePairs,
  formatDuration,
  hexToRgb,
  rgbToHex,
};