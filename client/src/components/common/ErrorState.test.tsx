import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Failed to load" />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });

  it('renders Retry button when onRetry is provided', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('does not render Retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
