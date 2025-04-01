import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TransferForm } from '../TransferForm';
import { useTransfer } from '../../hooks/useTransfer';

jest.mock('../../hooks/useTransfer', () => ({
  useTransfer: jest.fn()
}));

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: { id: 'test-user' },
    isAuthenticated: true
  })
}));

describe('TransferForm Component', () => {
  const mockInitiateTransfer = jest.fn();
  const mockValidateRecipient = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransfer as jest.Mock).mockReturnValue({
      initiateTransfer: mockInitiateTransfer,
      validateRecipient: mockValidateRecipient,
      isLoading: false,
      error: null,
      status: { status: 'pending' }
    });
  });

  it('renders transfer form correctly', () => {
    render(<TransferForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    expect(screen.getByLabelText(/recipient id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Transfer');
  });

  it('shows loading state during transfer', () => {
    (useTransfer as jest.Mock).mockReturnValue({
      initiateTransfer: mockInitiateTransfer,
      validateRecipient: mockValidateRecipient,
      isLoading: true,
      error: null,
      status: { status: 'pending' }
    });

    render(<TransferForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Processing...');
  });

  it('displays error message when transfer fails', async () => {
    const mockError = 'Transfer failed';
    mockInitiateTransfer.mockRejectedValueOnce(new Error(mockError));
    mockValidateRecipient.mockResolvedValueOnce(true);

    render(<TransferForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const recipientInput = screen.getByLabelText(/recipient id/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    // First change the recipient to trigger validation
    await act(async () => {
      fireEvent.change(recipientInput, { target: { value: '123' } });
    });

    // Wait for validation to complete
    await waitFor(() => {
      expect(mockValidateRecipient).toHaveBeenCalledWith('123');
    });

    // Then change the amount
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '1000' } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    // Wait for error handler to be called
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(mockError);
    });
  });

  it('calls initiateTransfer with correct data on form submission', async () => {
    mockValidateRecipient.mockResolvedValueOnce(true);
    mockInitiateTransfer.mockResolvedValueOnce({
      recipientId: '123',
      amount: 1000,
      currency: 'SEK',
      status: { status: 'completed' }
    });

    render(<TransferForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const recipientInput = screen.getByLabelText(/recipient id/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    // First change the recipient to trigger validation
    await act(async () => {
      fireEvent.change(recipientInput, { target: { value: '123' } });
    });

    // Wait for validation to complete
    await waitFor(() => {
      expect(mockValidateRecipient).toHaveBeenCalledWith('123');
    });

    // Then change the amount
    await act(async () => {
      fireEvent.change(amountInput, { target: { value: '1000' } });
    });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    // Wait for initiateTransfer to be called with correct data
    await waitFor(() => {
      expect(mockInitiateTransfer).toHaveBeenCalledWith({
        recipientId: '123',
        amount: 1000,
        currency: 'SEK',
        senderId: 'test-user'
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('validates recipient before submission', async () => {
    mockValidateRecipient.mockResolvedValue(false);

    render(<TransferForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const recipientInput = screen.getByLabelText(/recipient id/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    fireEvent.change(recipientInput, { target: { value: '123' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockInitiateTransfer).not.toHaveBeenCalled();
      expect(screen.getByText('Invalid recipient')).toBeInTheDocument();
    });
  });
});
