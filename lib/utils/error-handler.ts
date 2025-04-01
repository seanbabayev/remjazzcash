import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ett oväntat fel uppstod';
};

export const handleApiError = (error: unknown): never => {
  logger.error('API Error occurred', error);

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  }

  throw new ApiError('Ett oväntat fel uppstod', 500);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
