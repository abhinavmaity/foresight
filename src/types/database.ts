
// Extended database types to supplement Supabase generated types

export interface Sale {
  id: string;
  lead_id: string;
  product_name: string;
  amount: number;
  sale_date: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

export interface Notification {
  id: string;
  lead_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'follow-up' | 'email' | 'call' | 'meeting' | 'general';
  scheduled_at?: string;
  is_read: boolean;
  created_at: string;
}

// Update lead source type to include web-scraping
export type CustomLeadSource = 'web-scraping';
