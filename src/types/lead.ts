
export type LeadPriority = 'high' | 'medium' | 'low';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';

export type LeadSource = 'website' | 'referral' | 'email' | 'social' | 'event' | 'other' | 'web-scraping';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  position?: string;
  priority: LeadPriority;
  status: LeadStatus;
  source: LeadSource;
  value?: number;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  nextFollowUp?: string;
  notes?: string;
  // New fields for enriched data
  industry?: string;
  companySize?: string;
  revenue?: number;
}

export interface LeadStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  conversion: number;
}
