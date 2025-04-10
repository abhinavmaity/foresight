
import React, { useEffect } from 'react';
import { Bell, CheckCircle, Calendar, Mail, PhoneCall, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationContext } from '@/context/NotificationContext';

const NotificationsMenu: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh, loading, error } = useNotificationContext();
  const { toast } = useToast();
  
  // Refresh notifications on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'follow-up':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-500" />;
      case 'call':
        return <PhoneCall className="h-4 w-4 text-yellow-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {!error && unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" sideOffset={4}>
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                markAllAsRead();
                toast({
                  description: "All notifications marked as read",
                  duration: 2000
                });
              }}
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <AlertCircle className="h-8 w-8 text-amber-500 mb-3" />
              <p className="text-sm font-medium mb-1">Failed to load notifications</p>
              <p className="text-xs text-muted-foreground mb-3">Please check your connection and try again</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refresh()}
                className="mt-2"
              >
                <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Try again
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-1 p-2">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-md transition-colors ${
                    notification.is_read ? 'bg-transparent hover:bg-muted/40' : 'bg-muted/40 hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.created_at && formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      
                      {notification.leadName && (
                        <div className="mt-1 text-xs flex items-center">
                          <span className="text-muted-foreground font-medium">
                            {notification.leadName}
                          </span>
                        </div>
                      )}
                      
                      {notification.scheduled_at && (
                        <div className="text-xs flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.scheduled_at), { addSuffix: true })}
                          </span>
                        </div>
                      )}
                      
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 mt-1 w-full justify-start"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
