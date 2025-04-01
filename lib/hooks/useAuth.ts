import { useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
}

interface UseAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Implement actual sign in logic here
      setIsAuthenticated(true);
      setUser({ id: 'mock-user-id', email: 'user@example.com' }); // Mock user data
      options.onSuccess?.();
    } catch (err) {
      const errorMessage = 'Authentication failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Implement actual sign out logic here
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      const errorMessage = 'Sign out failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    isAuthenticated,
    loading,
    error,
    signIn,
    signOut,
    user
  };
};
