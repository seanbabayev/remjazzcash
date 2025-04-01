import React from 'react';
import { BaseComponentProps } from '../types/shared-types';

interface AlertProps extends BaseComponentProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-50 border-green-100 text-green-800',
  error: 'bg-red-50 border-red-100 text-red-800',
  warning: 'bg-yellow-50 border-yellow-100 text-yellow-800',
  info: 'bg-blue-50 border-blue-100 text-blue-800'
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`p-4 rounded-lg border ${typeStyles[type]} ${className}`}
      role="alert"
      {...props}
    >
      {title && (
        <h3 className="font-medium mb-1">{title}</h3>
      )}
      <p className="text-sm opacity-90">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-70 hover:opacity-100"
          aria-label="Stäng"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
