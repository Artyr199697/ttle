/**
 * Универсальный компонент поля ввода
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 border rounded-lg
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2 border rounded-lg
          ${error ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'}
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          resize-vertical
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};
