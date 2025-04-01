import { BaseComponentProps } from '../../../shared/types/shared-types';

export interface PaymentDetails {
  amount: number;
  currency: string;
  recipientId: string;
  description?: string;
}

export interface PaymentFormProps extends BaseComponentProps {
  onSubmit: (details: PaymentDetails) => Promise<void>;
  initialData?: Partial<PaymentDetails>;
}

export interface PaymentStatusProps extends BaseComponentProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  amount?: number;
  currency?: string;
}
