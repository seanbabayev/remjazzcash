import { HTMLAttributes } from 'react';
import { BaseComponentProps } from '../../shared/types/shared-types';

export interface HeaderProps extends HTMLAttributes<HTMLElement>, BaseComponentProps {
  showMenu?: boolean;
  showNotifications?: boolean;
}

export interface IconProps extends BaseComponentProps {
  size?: number;
  color?: string;
}

export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
}
