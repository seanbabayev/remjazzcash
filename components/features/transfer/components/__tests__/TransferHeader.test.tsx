import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { TransferHeader } from '../TransferHeader';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TransferHeader Component', () => {
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    // Reset router mock before each test
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders with the correct title', () => {
    render(<TransferHeader title="Send Money" />);
    expect(screen.getByText('Send Money')).toBeInTheDocument();
  });

  it('calls router.back() when back button is clicked', () => {
    render(<TransferHeader title="Send Money" />);
    const backButton = screen.getByRole('button');
    
    fireEvent.click(backButton);
    
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    render(<TransferHeader title="Send Money" className="custom-class" />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });

  it('has back button', () => {
    render(<TransferHeader title="Send Money" />);
    const backButton = screen.getByRole('button');
    expect(backButton).toBeVisible();
  });
});
