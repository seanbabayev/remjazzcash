import { useState, useCallback } from 'react';
import { useTransfer } from '../hooks/useTransfer';
import { useAuth } from '@/lib/hooks/useAuth';
import { Alert } from '@/components/shared/components/Alert';
import type { TransferDetails } from '../types/transfer-types';

interface TransferFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const TransferForm = ({ onSuccess, onError }: TransferFormProps) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRecipientValid, setIsRecipientValid] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { initiateTransfer, validateRecipient, isLoading, error: transferError } = useTransfer();

  const handleRecipientValidation = useCallback(async (id: string) => {
    if (!id) return;
    setIsValidating(true);
    try {
      const isValid = await validateRecipient(id);
      setIsRecipientValid(isValid);
    } finally {
      setIsValidating(false);
    }
  }, [validateRecipient]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isRecipientValid || !isAuthenticated || !user) return;

    try {
      const transferData: Omit<TransferDetails, 'status'> = {
        recipientId,
        amount: Number(amount),
        currency: 'SEK',
        senderId: user.id
      };
      await initiateTransfer(transferData);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      onError?.(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" role="form">
      {transferError && (
        <Alert type="error" message={transferError} />
      )}
      <div>
        <label htmlFor="recipientId" className="block text-sm font-medium text-gray-700">
          Recipient ID
        </label>
        <input
          type="text"
          id="recipientId"
          value={recipientId}
          onChange={(e) => {
            setRecipientId(e.target.value);
            handleRecipientValidation(e.target.value);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {isValidating && <span className="text-sm text-gray-500">Validating recipient...</span>}
        {!isValidating && recipientId && (
          <span className={`text-sm ${isRecipientValid ? 'text-green-500' : 'text-red-500'}`}>
            {isRecipientValid ? 'Valid recipient' : 'Invalid recipient'}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (SEK)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !isRecipientValid || !amount}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Transfer'}
      </button>
    </form>
  );
};
