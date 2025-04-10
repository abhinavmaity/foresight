
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { notificationService, NotificationWithLead } from '@/services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationWithLead[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch notifications with debounced error handling
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(false);
      const data = await notificationService.getUserNotifications(user.id);
      setNotifications(data);
      
      // Calculate unread count
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(true);
      
      // Only show toast once every 30 seconds
      const now = Date.now();
      if (now - lastErrorTime > 30000) {
        setLastErrorTime(now);
        toast({
          title: 'Notification Error',
          description: 'Could not load notifications',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast, lastErrorTime]);
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Could not mark notification as read',
        variant: 'destructive',
      });
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Could not mark all notifications as read',
        variant: 'destructive',
      });
    }
  };
  
  // Schedule a follow-up
  const scheduleFollowUp = async (leadId: string, date: string, title: string, message: string) => {
    if (!user?.id) return;
    
    try {
      await notificationService.createNotification({
        lead_id: leadId,
        user_id: user.id,
        title,
        message,
        type: 'follow-up',
        scheduled_at: date
      });
      
      // Update lead's next follow-up date
      await notificationService.updateLeadFollowupDate(leadId, date);
      
      toast({
        title: 'Follow-up Scheduled',
        description: `Reminder set for ${new Date(date).toLocaleDateString()}`
      });
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      toast({
        title: 'Error',
        description: 'Could not schedule follow-up',
        variant: 'destructive',
      });
    }
  };
  
  // Set up real-time subscription and fetch notifications on mount
  useEffect(() => {
    if (!user?.id) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Subscribe to changes
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchNotifications();
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as any;
            if (newNotification.type === 'follow-up' && newNotification.scheduled_at) {
              const scheduledDate = new Date(newNotification.scheduled_at);
              const now = new Date();
              
              // If it's less than 5 minutes from now, show a toast
              if (scheduledDate.getTime() - now.getTime() < 5 * 60 * 1000) {
                toast({
                  title: newNotification.title,
                  description: newNotification.message,
                  duration: 10000, // Show for 10 seconds
                });
              }
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications, toast]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    scheduleFollowUp,
    refresh: fetchNotifications
  };
};
