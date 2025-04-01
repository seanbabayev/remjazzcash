export interface TimelineEvent {
  date: Date;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

export interface TransferTimelineProps {
  events: TimelineEvent[];
  transactionId: string;
}

export interface TransferStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface TransferDetails {
  amount: number;
  currency: string;
  recipientId: string;
  senderId: string;
  status: TransferStatus;
}
