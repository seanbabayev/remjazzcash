import { ApiError, handleApiError, isApiError } from '../error-handler';

describe('Error Handler Utilities', () => {
  describe('isApiError', () => {
    it('identifies API errors correctly', () => {
      const apiError = new ApiError('Test error', 400);
      expect(isApiError(apiError)).toBe(true);
    });

    it('rejects non-API errors', () => {
      const error = new Error('Regular error');
      expect(isApiError(error)).toBe(false);
    });
  });

  describe('handleApiError', () => {
    it('handles API errors with status codes', () => {
      const apiError = new ApiError('Test API error', 400);
      expect(() => handleApiError(apiError)).toThrow(apiError);
    });

    it('handles network errors', () => {
      const networkError = new Error('Failed to fetch');
      expect(() => handleApiError(networkError)).toThrow(ApiError);
      expect(() => handleApiError(networkError)).toThrow('Failed to fetch');
    });

    it('handles unknown errors', () => {
      const unknownError = 'Unknown error';
      expect(() => handleApiError(unknownError)).toThrow(ApiError);
      expect(() => handleApiError(unknownError)).toThrow('Ett oväntat fel uppstod');
    });

    it('handles validation errors', () => {
      const validationError = new Error('Invalid input');
      expect(() => handleApiError(validationError)).toThrow(ApiError);
      expect(() => handleApiError(validationError)).toThrow('Invalid input');
    });

    it('handles authentication errors', () => {
      const authError = new Error('Unauthorized');
      expect(() => handleApiError(authError)).toThrow(ApiError);
      expect(() => handleApiError(authError)).toThrow('Unauthorized');
    });
  });
});
