import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './index';

describe('Badge', () => {
  it('renders count', () => {
    render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('returns null when no count or children', () => {
    const { container } = render(<Badge />);
    expect(container.firstChild).toBeNull();
  });

  it('applies variant class', () => {
    render(<Badge count={3} variant="primary" />);
    expect(screen.getByText('3')).toHaveClass('badge--primary');
  });

  it('applies success variant', () => {
    render(<Badge count={1} variant="success" />);
    expect(screen.getByText('1')).toHaveClass('badge--success');
  });
});
