import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  icon,
  rightIcon,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`
          relative flex items-center rounded-xl border bg-white px-4 py-3
          transition-all duration-200
          ${focused
            ? 'border-orange-400 ring-2 ring-orange-100 shadow-sm'
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      >
        {icon && (
          <span className="mr-3 text-gray-400">{icon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          {...props}
        />

        {rightIcon && (
          <span className="ml-3 text-gray-400 cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
}
