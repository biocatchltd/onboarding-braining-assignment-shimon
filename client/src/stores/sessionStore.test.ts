import { describe, it, expect, beforeEach } from 'vitest';
import { SessionStore } from './sessionStore';
import type { Session } from '../types/session';

const mockSession: Session = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  multi_user_id: 'a1b2c3d4-e5f6-4178-9abc-def012345678',
  device_type: 'pc',
  transfer_usd: 100,
  fraud: false,
  is_deleted: false,
};

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  it('has default values', () => {
    expect(store.page).toBe(0);
    expect(store.rowsPerPage).toBe(20);
    expect(store.createOpen).toBe(false);
    expect(store.editId).toBeNull();
    expect(store.deleteSessionId).toBeNull();
  });

  it('setPage updates page', () => {
    store.setPage(2);
    expect(store.page).toBe(2);
  });

  it('setRowsPerPage updates rowsPerPage', () => {
    store.setRowsPerPage(50);
    expect(store.rowsPerPage).toBe(50);
  });

  it('openCreate sets createOpen to true', () => {
    store.openCreate();
    expect(store.createOpen).toBe(true);
  });

  it('closeCreate sets createOpen to false', () => {
    store.openCreate();
    store.closeCreate();
    expect(store.createOpen).toBe(false);
  });

  it('openEdit sets editId from session', () => {
    store.openEdit(mockSession);
    expect(store.editId).toBe(mockSession.id);
  });

  it('closeEdit clears editId', () => {
    store.openEdit(mockSession);
    store.closeEdit();
    expect(store.editId).toBeNull();
  });

  it('openDeleteConfirm sets deleteSessionId', () => {
    store.openDeleteConfirm('session-123');
    expect(store.deleteSessionId).toBe('session-123');
  });

  it('closeDeleteConfirm clears deleteSessionId', () => {
    store.openDeleteConfirm('session-123');
    store.closeDeleteConfirm();
    expect(store.deleteSessionId).toBeNull();
  });
});
