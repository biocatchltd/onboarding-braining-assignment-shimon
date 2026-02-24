import { makeAutoObservable } from 'mobx';
import type { Session } from '../types/session';

/**
 * MobX store for sessions UI state.
 * Holds pagination, dialog visibility, and selected session IDs.
 * Does not fetch data; that is handled by useSessions + TanStack Query.
 */
export class SessionStore {
  /** Current page index (0-based) */
  page = 0;

  /** Number of rows per page */
  rowsPerPage = 20;

  /** Whether the create session dialog is open */
  createOpen = false;

  /** ID of session being edited, or null if edit dialog is closed */
  editId: string | null = null;

  /** ID of session pending delete confirmation, or null */
  deleteSessionId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.page = page;
  }

  setRowsPerPage(rowsPerPage: number) {
    this.rowsPerPage = rowsPerPage;
  }

  openCreate() {
    this.createOpen = true;
  }

  closeCreate() {
    this.createOpen = false;
  }

  setEditId(id: string | null) {
    this.editId = id;
  }

  /** Open edit dialog for the given session */
  openEdit(session: Session) {
    this.editId = session.id;
  }

  closeEdit() {
    this.editId = null;
  }

  /** Open delete confirmation dialog for the given session ID */
  openDeleteConfirm(sessionId: string) {
    this.deleteSessionId = sessionId;
  }

  closeDeleteConfirm() {
    this.deleteSessionId = null;
  }
}

export const sessionStore = new SessionStore();
