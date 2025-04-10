
export type Tables = {
  activities: {
    Row: {
      action: string;
      created_at: string;
      description: string;
      id: string;
      lead_id: string;
    };
    Insert: {
      action: string;
      created_at?: string;
      description?: string;
      id?: string;
      lead_id: string;
    };
    Update: {
      action?: string;
      created_at?: string;
      description?: string;
      id?: string;
      lead_id?: string;
    };
  };
  inventory_items: {
    Row: {
      category: string;
      id: string;
      last_updated: string;
      name: string;
      quantity: number;
      sku: string;
      status: string;
      threshold: number;
    };
    Insert: {
      category: string;
      id?: string;
      last_updated?: string;
      name: string;
      quantity?: number;
      sku: string;
      status?: string;
      threshold: number;
    };
    Update: {
      category?: string;
      id?: string;
      last_updated?: string;
      name?: string;
      quantity?: number;
      sku?: string;
      status?: string;
      threshold?: number;
    };
  };
  leads: {
    Row: {
      company: string;
      company_size: string | null;
      created_at: string;
      email: string;
      first_name: string;
      id: string;
      industry: string | null;
      last_contacted_at: string | null;
      last_name: string;
      next_follow_up: string | null;
      notes: string | null;
      phone: string | null;
      position: string | null;
      priority: string;
      revenue: number | null;
      source: string;
      status: string;
      updated_at: string;
      value: number | null;
    };
    Insert: {
      company: string;
      company_size?: string | null;
      created_at?: string;
      email: string;
      first_name: string;
      id?: string;
      industry?: string | null;
      last_contacted_at?: string | null;
      last_name: string;
      next_follow_up?: string | null;
      notes?: string | null;
      phone?: string | null;
      position?: string | null;
      priority: string;
      revenue?: number | null;
      source: string;
      status: string;
      updated_at?: string;
      value?: number | null;
    };
    Update: {
      company?: string;
      company_size?: string | null;
      created_at?: string;
      email?: string;
      first_name?: string;
      id?: string;
      industry?: string | null;
      last_contacted_at?: string | null;
      last_name?: string;
      next_follow_up?: string | null;
      notes?: string | null;
      phone?: string | null;
      position?: string | null;
      priority?: string;
      revenue?: number | null;
      source?: string;
      status?: string;
      updated_at?: string;
      value?: number | null;
    };
  };
  profiles: {
    Row: {
      avatar_url: string | null;
      full_name: string | null;
      id: string;
      updated_at: string | null;
      username: string | null;
    };
    Insert: {
      avatar_url?: string | null;
      full_name?: string | null;
      id: string;
      updated_at?: string | null;
      username?: string | null;
    };
    Update: {
      avatar_url?: string | null;
      full_name?: string | null;
      id?: string;
      updated_at?: string | null;
      username?: string | null;
    };
  };
  notifications: {
    Row: {
      id: string;
      lead_id: string;
      user_id: string;
      title: string;
      message: string;
      type: string;
      scheduled_at: string | null;
      is_read: boolean;
      created_at: string;
    };
    Insert: {
      id?: string;
      lead_id: string;
      user_id: string;
      title: string;
      message: string;
      type: string;
      scheduled_at?: string | null;
      is_read?: boolean;
      created_at?: string;
    };
    Update: {
      id?: string;
      lead_id?: string;
      user_id?: string;
      title?: string;
      message?: string;
      type?: string;
      scheduled_at?: string | null;
      is_read?: boolean;
      created_at?: string;
    };
  };
  sales: {
    Row: {
      id: string;
      lead_id: string;
      product_name: string;
      amount: number;
      sale_date: string;
      payment_status: string;
      payment_method: string;
      created_at: string;
    };
    Insert: {
      id?: string;
      lead_id: string;
      product_name: string;
      amount: number;
      sale_date?: string;
      payment_status: string;
      payment_method?: string;
      created_at?: string;
    };
    Update: {
      id?: string;
      lead_id?: string;
      product_name?: string;
      amount?: number;
      sale_date?: string;
      payment_status?: string;
      payment_method?: string;
      created_at?: string;
    };
  };
};

export type NotificationWithLead = Tables['notifications']['Row'] & {
  leads: Tables['leads']['Row'];
};

export type Sale = Tables['sales']['Row'];
