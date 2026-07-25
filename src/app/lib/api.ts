import type { Admin, Complaint, ComplaintFormPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TOKEN_KEY = 'lcocms_admin_token';

type ApiResponse<T> = Promise<T>;

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): ApiResponse<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.message ?? 'Request failed', response.status);
  }

  return body as T;
}

export const authStore = {
  save(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const api = {
  async submitComplaint(payload: ComplaintFormPayload) {
    const formData = new FormData();
    formData.set('category', payload.category);
    formData.set('subject', payload.subject);
    formData.set('description', payload.description);
    formData.set('isAnonymous', String(payload.isAnonymous));
    formData.set('notificationEmail', payload.notificationEmail);

    if (!payload.isAnonymous) {
      formData.set('realName', payload.realName);
      formData.set('realEmail', payload.realEmail);
    }

    if (payload.attachment) formData.set('attachment', payload.attachment);

    return request<{ complaint: Complaint }>('/complaints', {
      method: 'POST',
      body: formData,
    });
  },

  trackComplaint(trackingToken: string) {
    return request<{ complaint: Complaint }>(`/complaints/track/${encodeURIComponent(trackingToken)}`);
  },

  async login(username: string, password: string) {
    const result = await request<{ token: string; admin: Admin }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    authStore.save(result.token);
    return result;
  },

  listComplaints() {
    return request<{ complaints: Complaint[] }>('/complaints');
  },

  updateComplaint(id: string, payload: Partial<Pick<Complaint, 'status' | 'adminResponse' | 'internalNotes' | 'category'>>) {
    return request<{ complaint: Complaint }>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  listAdmins() {
    return request<{ admins: Admin[] }>('/admins');
  },

  updateAdmin(id: string, payload: Partial<Pick<Admin, 'isActive' | 'name' | 'email' | 'role'>>) {
    return request<{ admin: Admin }>(`/admins/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
