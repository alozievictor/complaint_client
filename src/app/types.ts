export type Category = 'academic' | 'finance' | 'hostel' | 'ict' | 'general';
export type ComplaintStatus = 'pending' | 'under_review' | 'resolved';
export type AdminRole = 'academic' | 'finance' | 'hostel' | 'ict' | 'super';

export interface Complaint {
  id: string;
  referenceCode: string;
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

export type ComplaintFormPayload = {
  category: Category;
  subject: string;
  description: string;
  isAnonymous: boolean;
  realName: string;
  realEmail: string;
  attachment?: File | null;
};
