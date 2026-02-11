import { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const SearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  onClear,
  onSubmit,
  delay = 300, // Debounce delay in ms
  className = '',
  size = 'medium',
  withFilters = false,
  filterCount = 0,
  onFilterClick,
  autoFocus = false,
  disabled = false,
  loading = false,
  showClear = true,
  icon = MagnifyingGlassIcon,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Size configurations
  const sizeClasses = {
    small: {
      input: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      button: 'p-1.5',
    },
    medium: {
      input: 'px-4 py-2.5 text-sm',
      icon: 'w-5 h-5',
      button: 'p-2',
    },
    large: {
      input: 'px-5 py-3 text-base',
      icon: 'w-5 h-5',
      button: 'p-2.5',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;
  const Icon = icon;

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced onChange
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (internalValue !== value) {
      timeoutRef.current = setTimeout(() => {
        onChange(internalValue);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [internalValue, delay, onChange, value]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    if (onClear) onClear();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(internalValue);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && internalValue) {
      handleClear();
    }
    if (e.key === 'Enter' && onSubmit) {
      handleSubmit(e);
    }
  };

  const handleFilterClick = () => {
    if (onFilterClick) onFilterClick();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          ) : (
            <Icon className={`${currentSize.icon} text-gray-400`} />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="search"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            block w-full pl-10 ${withFilters ? 'pr-24' : showClear && internalValue ? 'pr-20' : 'pr-10'}
            ${currentSize.input}
            border border-gray-300 rounded-lg
            bg-white text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${filterCount > 0 ? 'border-primary-300' : ''}
          `}
          aria-label="Search"
          {...props}
        />

        {/* Clear Button */}
        {showClear && internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute inset-y-0 right-0 ${withFilters ? 'right-12' : ''}
              flex items-center pr-3
              text-gray-400 hover:text-gray-600
              focus:outline-none focus:text-gray-600
              transition-colors duration-200
            `}
            aria-label="Clear search"
          >
            <XMarkIcon className={`${currentSize.icon}`} />
          </button>
        )}

        {/* Filter Button */}
        {withFilters && (
          <button
            type="button"
            onClick={handleFilterClick}
            className={`
              absolute inset-y-0 right-0
              flex items-center pr-3
              ${filterCount > 0 ? 'text-primary-600' : 'text-gray-400'}
              hover:text-primary-700
              focus:outline-none focus:text-primary-700
              transition-colors duration-200
              ${currentSize.button}
            `}
            aria-label={`Filters ${filterCount > 0 ? `(${filterCount} active)` : ''}`}
          >
            <div className="relative">
              <AdjustmentsHorizontalIcon className={`${currentSize.icon}`} />
              {filterCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {filterCount}
                </span>
              )}
            </div>
          </button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {internalValue && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          <div className="py-2">
            <div className="px-4 py-2 text-xs text-gray-500">
              Press Enter to search for "{internalValue}"
            </div>
            {/* You can add actual suggestions here */}
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Type to see suggestions...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Variants
const QuickSearch = ({ value, onChange, placeholder = 'Quick search...', ...props }) => (
  <SearchInput
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    size="small"
    delay={150}
    {...props}
  />
);

const AdvancedSearch = ({ value, onChange, placeholder = 'Advanced search...', ...props }) => (
  <SearchInput
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    size="large"
    delay={500}
    withFilters
    {...props}
  />
);

// Export variants
SearchInput.Quick = QuickSearch;
SearchInput.Advanced = AdvancedSearch;

export default SearchInput;