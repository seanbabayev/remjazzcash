import { renderHook, act, waitFor } from '@testing-library/react';
import { usePayment } from '../../../components/features/payment/hooks/usePayment';
import { API_ENDPOINTS } from '../../constants';

jest.mock('../../utils/api', () => {
  const mockApi = {
    post: jest.fn(),
    get: jest.fn(),
  };
  return { api: mockApi };
});

jest.mock('@/lib/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('usePayment Hook', () => {
  const mockApi = jest.requireMock('../../utils/api').api;
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates payment intent successfully', async () => {
    const mockResponse = { clientSecret: 'pi_123_secret' };
    mockApi.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePayment({ onSuccess: mockOnSuccess }));

    await act(async () => {
      const response = await result.current.createPaymentIntent({
        amount: 1000,
        currency: 'SEK',
        recipientId: 'test-recipient'
      });
      expect(response).toEqual(mockResponse);
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it('handles payment intent creation failure', async () => {
    const mockError = new Error('Payment intent creation failed');
    mockApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => usePayment({ onError: mockOnError }));

    await act(async () => {
      try {
        await result.current.createPaymentIntent({
          amount: 1000,
          currency: 'SEK',
          recipientId: 'test-recipient'
        });
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(mockOnError).toHaveBeenCalledWith('Ett fel uppstod vid betalningen');
  });

  it('confirms payment successfully', async () => {
    const mockResponse = { status: 'succeeded' };
    mockApi.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      const response = await result.current.confirmPayment('pi_123');
      expect(response).toEqual(mockResponse);
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      `${API_ENDPOINTS.PAYMENT.CONFIRM}/pi_123`,
      { paymentIntentId: 'pi_123' }
    );
  });

  it('handles payment confirmation failure', async () => {
    const mockError = new Error('Payment confirmation failed');
    mockApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => usePayment({ onError: mockOnError }));

    await act(async () => {
      try {
        await result.current.confirmPayment('pi_123');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(mockOnError).toHaveBeenCalledWith('Ett fel uppstod vid betalningen');
  });

  it('updates loading state correctly', async () => {
    const mockResponse = { clientSecret: 'pi_123_secret' };
    mockApi.post.mockImplementationOnce(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockResponse;
    });

    const { result } = renderHook(() => usePayment());

    expect(result.current.isProcessing).toBe(false);

    let promise: Promise<any>;
    await act(async () => {
      promise = result.current.createPaymentIntent({
        amount: 1000,
        currency: 'SEK',
        recipientId: 'test-recipient'
      });
    });

    // Vänta på att isProcessing ska bli true
    await waitFor(() => {
      expect(result.current.isProcessing).toBe(true);
    });

    await act(async () => {
      await promise;
    });

    // Vänta på att isProcessing ska bli false
    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });
  });
});
