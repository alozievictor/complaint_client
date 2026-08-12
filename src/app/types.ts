export type Category = 'academic' | 'finance' | 'hostel' | 'ict' | 'general';
export type ComplaintStatus = 'pending' | 'under_review' | 'resolved' | 'closed';
export type ComplaintMessage = {
  sender: 'student' | 'admin';
  body: string;
  createdAt: string | Date;
};

export type ComplaintAttachment = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type ComplaintSla = {
  firstResponseAt?: string | Date;
  firstResponseDueAt: string | Date;
  resolutionDueAt: string | Date;
  firstResponseOverdue: boolean;
  resolutionOverdue: boolean;
  nearingDeadline: boolean;
};
export type AdminRole = 'academic' | 'finance' | 'hostel' | 'ict' | 'general' | 'super';

export interface Complaint {
  id: string;
  referenceCode: string;
  trackingToken?: string;
  category: Category;
  subject: string;
  description: string;
  isAnonymous: boolean;
  realName: string;
  realEmail: string;
  anonymousLabel: string;
  status: ComplaintStatus;
  submittedAt: string | Date;
  adminResponse: string;
  messages: ComplaintMessage[];
  attachments?: ComplaintAttachment[];
  sla?: ComplaintSla;
  internalNotes: string;
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  email: string;
}

export type CreateAdminPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Exclude<AdminRole, 'super'>;
};

export type ComplaintFormPayload = {
  category: Category;
  subject: string;
  description: string;
  isAnonymous: boolean;
  realName: string;
  realEmail: string;
  notificationEmail: string;
  attachment?: File | null;
};

export type ComplaintListQuery = {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  category?: Category;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type ComplaintListMeta = {
  pagination: { page: number; limit: number; total: number; totalPages: number };
  counts: Record<ComplaintStatus, number> & { all: number };
};

export type ComplaintAnalytics = {
  total: number;
  resolutionRate: number;
  byStatus: Record<ComplaintStatus, number>;
  byCategory: Record<Category, number>;
  byCategoryStatus: Record<Category, Record<ComplaintStatus, number>>;
  unresolvedAging: number;
  sla: { overdueFirstResponse: number; overdueResolution: number; nearingDeadline: number; averageResponseHours: number; averageResolutionDays: number };
};

export type AuditLog = {
  id: string;
  actorType: 'admin' | 'student' | 'system';
  actorName?: string;
  action: string;
  complaintReference?: string;
  targetLabel?: string;
  previousValue?: unknown;
  newValue?: unknown;
  createdAt: string | Date;
};
