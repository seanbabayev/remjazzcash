import React from 'react';
import { BaseComponentProps } from '../types/shared-types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  className = '',
  ...props 
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        sizeMap[size]
      } ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Laddar...</span>
    </div>
  );
};
