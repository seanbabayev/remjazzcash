import { usePayment } from '../hooks/usePayment';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

interface PaymentFormProps {
  amount: number;
  recipientId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentFormContent = ({ amount, recipientId, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, isProcessing, error: paymentError } = usePayment({
    onSuccess,
    onError
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const result = await createPaymentIntent({
        amount,
        recipientId,
        currency: 'SEK'
      });

      if (!result) {
        throw new Error('Could not create payment');
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret: result.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      if (onError) {
        onError('Payment failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="payment-form">
      <PaymentElement />
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full h-[60px] rounded-[16px] text-white bg-[#00BD5F] disabled:opacity-50 transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {paymentError && <div role="alert" className="mt-2 text-red-500">{paymentError}</div>}
    </form>
  );
};

export const PaymentForm = (props: PaymentFormProps) => {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};
