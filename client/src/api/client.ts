import axios, { type AxiosInstance } from 'axios';

const BASE = import.meta.env.VITE_API_BASE ?? '/api';

const client: AxiosInstance = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (response) => {
    if (response.status === 204) return { ...response, data: undefined };
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.detail ?? error.response?.statusText ?? error.message;
    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)));
  }
);

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | boolean>) =>
    client.get<T>(path, { params }).then((res) => res.data),

  post: <T>(path: string, body: unknown) =>
    client.post<T>(path, body).then((res) => res.data),

  patch: <T>(path: string, body: unknown) =>
    client.patch<T>(path, body).then((res) => res.data),

  delete: (path: string, params?: Record<string, string | number | boolean>) =>
    client.delete(path, { params }).then((res) => res.data as undefined),
};
