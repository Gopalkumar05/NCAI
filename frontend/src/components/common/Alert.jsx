import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const alertConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-400'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: ExclamationCircleIcon,
      iconColor: 'text-red-400'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-400'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${config.textColor} mt-2`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md ${config.bgColor} p-1.5 ${config.textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bgColor} focus:ring-${type}-600`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;