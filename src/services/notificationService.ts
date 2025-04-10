
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/database";

export interface NotificationWithLead extends Notification {
  leadName?: string;
}

// Use export type to resolve isolatedModules error
export type { Notification }; 

const mapDbToNotification = (record: any): NotificationWithLead => {
  return {
    id: record.id,
    lead_id: record.lead_id,
    user_id: record.user_id,
    title: record.title,
    message: record.message,
    type: record.type,
    scheduled_at: record.scheduled_at,
    is_read: record.is_read,
    created_at: record.created_at,
    leadName: record.leads ? `${record.leads.first_name} ${record.leads.last_name}` : undefined
  };
};

export const notificationService = {
  async getUserNotifications(userId: string): Promise<NotificationWithLead[]> {
    try {
      // Using any to bypass type checking for custom tables
      const { data, error } = await supabase
        .from('notifications')
        .select('*, leads(first_name, last_name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      return (data || []).map(mapDbToNotification);
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      // Return empty array instead of throwing to prevent continuous errors
      return [];
    }
  },
  
  async getUnreadNotificationsCount(userId: string): Promise<number> {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread count:', error);
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadNotificationsCount:', error);
      return 0;
    }
  },
  
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
  
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<NotificationWithLead> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        lead_id: notification.lead_id,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        scheduled_at: notification.scheduled_at,
        is_read: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    
    return mapDbToNotification(data);
  },
  
  async updateLeadFollowupDate(leadId: string, followUpDate: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({ next_follow_up: followUpDate })
      .eq('id', leadId);
    
    if (error) {
      console.error('Error updating lead follow-up date:', error);
      throw error;
    }
  },
  
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};
