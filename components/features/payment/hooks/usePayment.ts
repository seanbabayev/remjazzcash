import { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';
import { PaymentDetails } from '../types/payment-types';
import { logger } from '@/lib/utils/logger';
import { api } from '@/lib/utils/api';

interface UsePaymentOptions {
  onSuccess?: (data: { clientSecret: string }) => void;
  onError?: (error: string) => void;
}

export const usePayment = (options: UsePaymentOptions = {}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (paymentDetails: PaymentDetails): Promise<{ clientSecret: string } | undefined> => {
    try {
      setProcessing(true);
      setError(null);
      const response = await api.post<{ clientSecret: string }>(
        API_ENDPOINTS.PAYMENT.CREATE_INTENT,
        paymentDetails
      );

      if (response) {
        options.onSuccess?.(response);
        return response;
      }
      return undefined;
    } catch (err) {
      const errorMessage = 'Ett fel uppstod vid betalningen';
      logger.error('Payment intent creation failed', err);
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string): Promise<{ status: string } | undefined> => {
    try {
      setProcessing(true);
      setError(null);
      const response = await api.post<{ status: string }>(
        `${API_ENDPOINTS.PAYMENT.CONFIRM}/${paymentIntentId}`,
        { paymentIntentId }
      );

      if (response) {
        return response;
      }
      return undefined;
    } catch (err) {
      const errorMessage = 'Ett fel uppstod vid betalningen';
      logger.error('Payment confirmation failed', err);
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    createPaymentIntent,
    confirmPayment,
    isProcessing: processing,
    error
  };
};
