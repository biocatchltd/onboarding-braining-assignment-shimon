import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No sessions yet')).toBeInTheDocument();
    expect(screen.getByText('Create a new session to get started')).toBeInTheDocument();
  });
});
