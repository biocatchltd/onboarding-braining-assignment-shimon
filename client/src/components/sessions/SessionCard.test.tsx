import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { SessionCard } from './SessionCard';
import { sessionStore } from '../../stores/sessionStore';
import type { Session } from '../../types/session';

const mockSession: Session = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  multi_user_id: 'a1b2c3d4-e5f6-4178-9abc-def012345678',
  device_type: 'pc',
  transfer_usd: 99.99,
  fraud: false,
  is_deleted: false,
};

describe('SessionCard', () => {
  beforeEach(() => {
    vi.spyOn(sessionStore, 'openEdit').mockImplementation(() => {});
  });

  it('renders session data', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText(/550e8400/)).toBeInTheDocument();
    expect(screen.getByText('pc')).toBeInTheDocument();
    expect(screen.getByText(/99\.99/)).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders Yes for fraud session', () => {
    const fraudSession = { ...mockSession, fraud: true };
    render(<SessionCard session={fraudSession} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('calls openEdit when clicked', async () => {
    render(<SessionCard session={mockSession} />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Transfer'));
    expect(sessionStore.openEdit).toHaveBeenCalledWith(mockSession);
  });
});
