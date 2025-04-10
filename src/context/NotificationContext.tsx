
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationWithLead } from '@/services/notificationService';

interface NotificationContextType {
  unreadCount: number;
  notifications: NotificationWithLead[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    loading,
    error,
    refresh 
  } = useNotifications();
  
  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
        loading,
        error,
        refresh
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
