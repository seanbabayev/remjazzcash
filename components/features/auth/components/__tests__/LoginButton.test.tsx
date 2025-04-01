import { render, screen, fireEvent } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { LoginButton } from '../LoginButton';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('LoginButton Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders login button correctly', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/logga in med google/i);
  });

  it('calls signIn when clicked', async () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    render(<LoginButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('is accessible', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button');
    expect(button).toBeVisible();
  });
});
