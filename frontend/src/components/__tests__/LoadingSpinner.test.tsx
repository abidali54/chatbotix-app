import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8 w-8', 'text-indigo-600');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="small" />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('h-4 w-4');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="text-blue-500" />);
    const spinner = screen.getByRole('img', { hidden: true });
    expect(spinner).toHaveClass('text-blue-500');
  });
});