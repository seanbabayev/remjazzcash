import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentForm } from '../PaymentForm';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../../hooks/usePayment';

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  PaymentElement: () => <div data-testid="stripe-payment-element" />,
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../../hooks/usePayment', () => ({
  usePayment: jest.fn()
}));

jest.mock('@/lib/stripe', () => ({
  getStripe: jest.fn()
}));

describe('PaymentForm', () => {
  const defaultProps = {
    amount: 1000,
    recipientId: 'test-recipient',
    onSuccess: jest.fn(),
    onError: jest.fn()
  };

  const mockStripe = {
    confirmPayment: jest.fn()
  };

  const mockElements = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (useStripe as jest.Mock).mockReturnValue(mockStripe);
    (useElements as jest.Mock).mockReturnValue(mockElements);
    (usePayment as jest.Mock).mockReturnValue({
      createPaymentIntent: jest.fn().mockResolvedValue({ clientSecret: 'test_secret' }),
      isProcessing: false,
      error: null
    });
  });

  it('renders payment form correctly', () => {
    render(<PaymentForm {...defaultProps} />);
    
    expect(screen.getByTestId('stripe-payment-element')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Pay');
  });

  it('disables submit button when processing', () => {
    (usePayment as jest.Mock).mockReturnValue({
      createPaymentIntent: jest.fn(),
      isProcessing: true,
      error: null
    });

    render(<PaymentForm {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onSuccess when payment succeeds', async () => {
    const mockCreatePaymentIntent = jest.fn().mockResolvedValue({ clientSecret: 'test_secret' });
    mockStripe.confirmPayment.mockResolvedValue({ error: null });
    (usePayment as jest.Mock).mockReturnValue({
      createPaymentIntent: mockCreatePaymentIntent,
      isProcessing: false,
      error: null
    });

    render(<PaymentForm {...defaultProps} />);
    const form = screen.getByTestId('payment-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreatePaymentIntent).toHaveBeenCalledWith({
        amount: defaultProps.amount,
        recipientId: defaultProps.recipientId,
        currency: 'SEK'
      });
      expect(mockStripe.confirmPayment).toHaveBeenCalled();
    });
  });

  it('calls onError when payment fails', async () => {
    const mockError = new Error('Payment failed');
    mockStripe.confirmPayment.mockResolvedValue({ error: mockError });
    (usePayment as jest.Mock).mockReturnValue({
      createPaymentIntent: jest.fn().mockResolvedValue({ clientSecret: 'test_secret' }),
      isProcessing: false,
      error: null
    });

    render(<PaymentForm {...defaultProps} />);
    const form = screen.getByTestId('payment-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith('Payment failed');
    });
  });
});
