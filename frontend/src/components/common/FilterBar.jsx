import { useState, useRef, useEffect } from 'react';
import {
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const FilterBar = ({
  label,
  value,
  onChange,
  options = [],
  icon: Icon = FunnelIcon,
  multiple = false,
  placeholder = 'Select...',
  className = '',
  size = 'medium',
  disabled = false,
  clearable = true,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Size configurations
  const sizeClasses = {
    small: {
      button: 'px-3 py-1.5 text-xs',
      dropdown: 'text-xs',
      item: 'py-1.5 px-3',
    },
    medium: {
      button: 'px-4 py-2 text-sm',
      dropdown: 'text-sm',
      item: 'py-2 px-4',
    },
    large: {
      button: 'px-5 py-2.5 text-base',
      dropdown: 'text-sm',
      item: 'py-2.5 px-5',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  // Get selected label(s)
  const getSelectedLabel = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} selected`;
    }
    
    const option = options.find(opt => opt.value === value);
    return option?.label || value || placeholder;
  };

  // Handle selection
  const handleSelect = (optionValue) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearch('');
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      onChange([]);
    } else {
      onChange('');
    }
  };

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Check if an option is selected
  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          inline-flex items-center justify-between w-full rounded-lg border border-gray-300
          bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${currentSize.button}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="filter-label"
      >
        <div className="flex items-center min-w-0 flex-1">
          {Icon && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
          <span className="truncate" id="filter-label">
            {getSelectedLabel()}
          </span>
        </div>
        <div className="flex items-center ml-2 flex-shrink-0">
          {clearable && value && (multiple ? value.length > 0 : value !== '') && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 rounded mr-1 transition-colors duration-200"
              aria-label="Clear selection"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          )}
          <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 sm:w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">{label}</h3>
              {clearable && value && (multiple ? value.length > 0 : value !== '') && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Search Input (if searchable) */}
            {searchable && (
              <div className="mt-2 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="block w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Options List */}
          <div className={`max-h-60 overflow-y-auto py-1 ${currentSize.dropdown}`}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    flex items-center justify-between cursor-pointer
                    hover:bg-gray-50 transition-colors duration-150
                    ${isSelected(option.value) ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                    ${currentSize.item}
                  `}
                  role="option"
                  aria-selected={isSelected(option.value)}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {option.icon && (
                      <option.icon className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.badge && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  
                  {multiple ? (
                    <input
                      type="checkbox"
                      checked={isSelected(option.value)}
                      onChange={() => {}}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  ) : (
                    isSelected(option.value) && (
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>

          {/* Footer for multiple selection */}
          {multiple && filteredOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Apply ({value?.length || 0} selected)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Variants for common filter types
const StatusFilter = ({ value, onChange, ...props }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', icon: FunnelIcon },
    { value: 'pending', label: 'Pending', icon: FunnelIcon },
    { value: 'processing', label: 'Processing', icon: FunnelIcon },
    { value: 'shipped', label: 'Shipped', icon: FunnelIcon },
    { value: 'delivered', label: 'Delivered', icon: FunnelIcon },
    { value: 'cancelled', label: 'Cancelled', icon: FunnelIcon },
  ];

  return (
    <FilterBar
      label="Status"
      value={value}
      onChange={onChange}
      options={statusOptions}
      {...props}
    />
  );
};

const DateFilter = ({ value, onChange, ...props }) => {
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <FilterBar
      label="Date Range"
      value={value}
      onChange={onChange}
      options={dateOptions}
      {...props}
    />
  );
};

const SortFilter = ({ value, onChange, ...props }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Amount' },
    { value: 'lowest', label: 'Lowest Amount' },
  ];

  return (
    <FilterBar
      label="Sort By"
      value={value}
      onChange={onChange}
      options={sortOptions}
      {...props}
    />
  );
};

// Export main component and variants
FilterBar.Status = StatusFilter;
FilterBar.Date = DateFilter;
FilterBar.Sort = SortFilter;

export default FilterBar;