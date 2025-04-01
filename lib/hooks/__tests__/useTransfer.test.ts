import { renderHook, act } from '@testing-library/react';
import { useTransfer } from '../useTransfer';

jest.mock('../../utils/api', () => {
  const mockApi = {
    post: jest.fn(),
    get: jest.fn(),
  };
  return { api: mockApi };
});

describe('useTransfer Hook', () => {
  const mockApi = jest.requireMock('../../utils/api').api;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initiates transfer successfully', async () => {
    const mockResponse = { success: true };
    mockApi.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      await result.current.initiateTransfer({
        recipientId: '123',
        amount: 1000,
      });
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      '/transfers',
      expect.objectContaining({
        recipientId: '123',
        amount: 1000,
      })
    );
  });

  it('handles transfer failure', async () => {
    const mockError = new Error('Transfer failed');
    mockApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      try {
        await result.current.initiateTransfer({
          recipientId: '123',
          amount: 1000,
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Transfer failed');
        } else {
          throw new Error('Expected error to be instance of Error');
        }
      }
    });
  });

  it('validates recipient successfully', async () => {
    const mockResponse = { valid: true };
    mockApi.get.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      const isValid = await result.current.validateRecipient('123');
      expect(isValid).toBe(true);
    });

    expect(mockApi.get).toHaveBeenCalledWith('/recipients/123/validate');
  });

  it('handles validation failure', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Validation failed'));

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      const isValid = await result.current.validateRecipient('123');
      expect(isValid).toBe(false);
    });
  });
});
