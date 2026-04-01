const API_BASE = "/api";
const TOKEN_KEY = "token";

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = LoginPayload;

export type TodoStatus = "TODO" | "DONE";

export type TodoItem = {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
};

export type CreateTodoPayload = {
  title: string;
  description: string;
};

export type UpdateTodoPayload = CreateTodoPayload & {
  status: TodoStatus;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers ?? {}) };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.message || "request failed");
  }

  return payload.data;
}

export const login = async (payload: LoginPayload) => apiRequest<{ token: string }>("/auth/login", { method: "POST", body: payload });

export const register = async (payload: RegisterPayload) => {
  await apiRequest<null>("/auth/register", { method: "POST", body: payload });
};

export const listTodos = () => apiRequest<TodoItem[]>("/todos", { method: "GET" });

export const createTodo = (payload: CreateTodoPayload) => apiRequest<TodoItem>("/todos", { method: "POST", body: payload });

export const updateTodo = (id: number, payload: UpdateTodoPayload) => apiRequest<TodoItem>(`/todos/${id}`, { method: "PUT", body: payload });

export const deleteTodo = (id: number) => apiRequest<null>(`/todos/${id}`, { method: "DELETE" });
