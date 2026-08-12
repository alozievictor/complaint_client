import type { Admin, AuditLog, Complaint, ComplaintFormPayload, CreateAdminPayload, ComplaintAnalytics, ComplaintListMeta, ComplaintListQuery } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TOKEN_KEY = 'lcocms_admin_token';

type ApiResponse<T> = Promise<T>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: Record<string, string[] | undefined> = {},
  ) {
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
    const fieldErrors = body.errors as Record<string, string[] | undefined> | undefined;
    const firstFieldMessage = fieldErrors
      ? Object.values(fieldErrors).flat().find((message): message is string => Boolean(message))
      : undefined;
    throw new ApiError(firstFieldMessage ?? body.message ?? 'Request failed', response.status, fieldErrors ?? {});
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
  hasToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
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

  addFollowUpMessage(trackingToken: string, message: string) {
    return request<{ complaint: Complaint }>(`/complaints/track/${encodeURIComponent(trackingToken)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async login(username: string, password: string) {
    const result = await request<{ token: string; admin: Admin }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    authStore.save(result.token);
    return result;
  },

  me() {
    return request<{ admin: Admin }>('/auth/me');
  },

  listComplaints(query: ComplaintListQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ complaints: Complaint[] } & ComplaintListMeta>(`/complaints${suffix}`);
  },

  getAnalytics() {
    return request<ComplaintAnalytics>('/analytics');
  },

  listAuditLogs(page = 1, limit = 25) {
    return request<{ logs: AuditLog[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/audit-logs?page=${page}&limit=${limit}`);
  },

  updateComplaint(id: string, payload: Partial<Pick<Complaint, 'status' | 'adminResponse' | 'internalNotes' | 'category'>>) {
    return request<{ complaint: Complaint }>(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getAttachmentUrl(complaintId: string, attachmentId: string) {
    return request<{ url: string }>(`/complaints/${encodeURIComponent(complaintId)}/attachments/${encodeURIComponent(attachmentId)}/url`);
  },

  listAdmins() {
    return request<{ admins: Admin[] }>('/admins');
  },

  createAdmin(payload: CreateAdminPayload) {
    return request<{ admin: Admin }>('/admins', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAdmin(id: string, payload: Partial<Pick<Admin, 'isActive' | 'name' | 'email' | 'role'>>) {
    return request<{ admin: Admin }>(`/admins/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
