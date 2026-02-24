import { api } from './client';
import type {
  Session,
  PaginatedSessions,
  SessionCreate,
  SessionUpdate,
} from '../types/session';

/**
 * API client for sessions CRUD.
 */
export const sessionsApi = {
  /** Fetch paginated list of sessions */
  list: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedSessions>('/sessions', params),

  /** Fetch a single session by ID */
  get: (sessionId: string) => api.get<Session>(`/sessions/${sessionId}`),

  /** Create a new session */
  create: (payload: SessionCreate) => api.post<Session>('/sessions', payload),

  /** Update an existing session */
  update: (sessionId: string, payload: SessionUpdate) =>
    api.patch<Session>(`/sessions/${sessionId}`, payload),

  /** Soft-delete a session */
  delete: (sessionId: string, soft = true) =>
    api.delete(`/sessions/${sessionId}`, { soft }),
};
