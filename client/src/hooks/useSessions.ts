import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { sessionStore } from '../stores/sessionStore';
import { toastStore } from '../stores/toastStore';
import { sessionsApi } from '../api/sessions';
import type {
  Session,
  SessionCreate,
  SessionUpdate,
  PaginatedSessions,
} from '../types/session';

/** Base query key for sessions queries */
const SESSIONS_QUERY_KEY = 'sessions';

/**
 * Builds the query key for the sessions list.
 * Used for cache lookup and invalidation.
 */
const buildSessionsQueryKey = (page: number, rowsPerPage: number) =>
  [SESSIONS_QUERY_KEY, page, rowsPerPage] as const;

/**
 * Hook for sessions CRUD and list.
 * Uses TanStack Query for server state and optimistic updates.
 * Reads pagination from sessionStore.
 */
export const useSessions = () => {
  const queryClient = useQueryClient();
  const store = sessionStore;

  const sessionsQuery = useQuery({
    queryKey: buildSessionsQueryKey(store.page, store.rowsPerPage),
    queryFn: () =>
      sessionsApi.list({
        offset: store.page * store.rowsPerPage,
        limit: store.rowsPerPage,
        include_deleted: false,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: SessionCreate) => sessionsApi.create(payload),
    onMutate: async (newSessionPayload) => {
      await queryClient.cancelQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      const previousData = queryClient.getQueryData<PaginatedSessions>(
        buildSessionsQueryKey(store.page, store.rowsPerPage)
      );
      const optimisticSession: Session = {
        id: `temp-${Date.now()}`,
        multi_user_id: newSessionPayload.multi_user_id,
        device_type: newSessionPayload.device_type,
        transfer_usd: newSessionPayload.transfer_usd,
        fraud: newSessionPayload.fraud ?? false,
        is_deleted: newSessionPayload.is_deleted ?? false,
      };
      if (previousData) {
        queryClient.setQueryData<PaginatedSessions>(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          {
            ...previousData,
            items: [optimisticSession, ...previousData.items],
            total: previousData.total + 1,
          }
        );
      }
      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          context.previousData
        );
      }
      toastStore.error((error as Error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
    onSuccess: () => {
      store.closeCreate();
      toastStore.success('Session created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: SessionUpdate }) =>
      sessionsApi.update(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      const previousData = queryClient.getQueryData<PaginatedSessions>(
        buildSessionsQueryKey(store.page, store.rowsPerPage)
      );
      if (previousData) {
        const updatedItems = previousData.items.map((session) =>
          session.id === id ? { ...session, ...body } : session
        );
        queryClient.setQueryData<PaginatedSessions>(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          { ...previousData, items: updatedItems }
        );
      }
      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          context.previousData
        );
      }
      toastStore.error((error as Error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
    onSuccess: () => {
      store.closeEdit();
      toastStore.success('Session updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => sessionsApi.delete(sessionId),
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: [SESSIONS_QUERY_KEY] });
      const previousData = queryClient.getQueryData<PaginatedSessions>(
        buildSessionsQueryKey(store.page, store.rowsPerPage)
      );
      if (previousData) {
        const updatedItems = previousData.items.filter(
          (session) => session.id !== sessionId
        );
        queryClient.setQueryData<PaginatedSessions>(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          {
            ...previousData,
            items: updatedItems,
            total: Math.max(0, previousData.total - 1),
          }
        );
      }
      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          buildSessionsQueryKey(store.page, store.rowsPerPage),
          context.previousData
        );
      }
      toastStore.error((error as Error).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
    onSuccess: () => {
      store.closeEdit();
      store.closeDeleteConfirm();
      toastStore.success('Session deleted successfully');
    },
  });

  const createSession = useCallback(
    (payload: SessionCreate) => createMutation.mutate(payload),
    [createMutation]
  );
  const updateSession = useCallback(
    (sessionId: string, body: SessionUpdate) =>
      updateMutation.mutate({ id: sessionId, body }),
    [updateMutation]
  );
  const deleteSession = useCallback(
    (sessionId: string) => deleteMutation.mutate(sessionId),
    [deleteMutation]
  );

  return useMemo(
    () => ({
      store,
      query: sessionsQuery,
      sessions: sessionsQuery.data?.items ?? [],
      total: sessionsQuery.data?.total ?? 0,
      createSession,
      updateSession,
      deleteSession,
      createMutation,
      updateMutation,
      deleteMutation,
    }),
    [
      store,
      sessionsQuery,
      createSession,
      updateSession,
      deleteSession,
      createMutation,
      updateMutation,
      deleteMutation,
    ]
  );
};
