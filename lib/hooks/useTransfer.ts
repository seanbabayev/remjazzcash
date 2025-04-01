import { api } from '../utils/api';

interface TransferData {
  recipientId: string;
  amount: number;
}

export const useTransfer = () => {
  const initiateTransfer = async (data: TransferData) => {
    try {
      const response = await api.post('/transfers', data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const validateRecipient = async (recipientId: string) => {
    try {
      const response = await api.get(`/recipients/${recipientId}/validate`);
      return response.valid;
    } catch (error) {
      return false;
    }
  };

  return {
    initiateTransfer,
    validateRecipient,
  };
};
