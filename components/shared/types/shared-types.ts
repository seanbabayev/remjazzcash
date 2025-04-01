import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
