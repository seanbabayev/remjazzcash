import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { API_ENDPOINTS } from '@/lib/constants';
import { TransferDetails, TransferStatus } from '../types/transfer-types';
import { logger } from '@/lib/utils/logger';

interface UseTransferOptions {
  onSuccess?: (data: TransferDetails) => void;
  onError?: (error: string) => void;
}

interface ValidateRecipientResponse {
  valid: boolean;
  message?: string;
}

export const useTransfer = (options: UseTransferOptions = {}) => {
  const [status, setStatus] = useState<TransferStatus>({ status: 'pending' });
  const { execute, isLoading, error } = useApi<TransferDetails | ValidateRecipientResponse>();

  const validateRecipient = async (recipientId: string): Promise<boolean> => {
    try {
      const response = await execute<ValidateRecipientResponse>(
        fetch(API_ENDPOINTS.TRANSFER.VALIDATE_RECIPIENT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientId })
        })
      );
      return response?.valid ?? false;
    } catch (err) {
      logger.error(err instanceof Error ? err : new Error(String(err)), { context: 'validateRecipient' });
      options.onError?.('Kunde inte validera mottagaren');
      return false;
    }
  };

  const initiateTransfer = async (transferData: Omit<TransferDetails, 'status'>): Promise<TransferDetails | undefined> => {
    try {
      setStatus({ status: 'processing' });
      const response = await execute<TransferDetails>(
        fetch(API_ENDPOINTS.TRANSFER.CREATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transferData)
        })
      );

      if (response) {
        const transferDetails: TransferDetails = {
          ...transferData,
          status: { status: 'completed' }
        };
        setStatus({ status: 'completed' });
        options.onSuccess?.(transferDetails);
        return transferDetails;
      }
      return undefined;
    } catch (err) {
      logger.error(err instanceof Error ? err : new Error(String(err)), { context: 'initiateTransfer' });
      setStatus({ status: 'failed', message: 'Överföringen misslyckades' });
      options.onError?.('Kunde inte genomföra överföringen');
      return undefined;
    }
  };

  const checkTransferStatus = async (transferId: string): Promise<TransferStatus> => {
    try {
      const response = await execute<{ status: TransferStatus }>(
        fetch(`${API_ENDPOINTS.TRANSFER.STATUS}/${transferId}`, {
          method: 'GET'
        })
      );
      return response?.status ?? { status: 'failed', message: 'Kunde inte hämta status' };
    } catch (err) {
      logger.error(err instanceof Error ? err : new Error(String(err)), { context: 'checkTransferStatus' });
      return { status: 'failed', message: 'Kunde inte hämta status' };
    }
  };

  return {
    initiateTransfer,
    validateRecipient,
    checkTransferStatus,
    status,
    isLoading,
    error
  };
};
