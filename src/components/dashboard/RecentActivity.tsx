
import React from 'react';
import { MailCheck, Phone, FileText, Calendar, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  action: string;
  date: string;
  description: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'email sent':
        return <MailCheck className="h-5 w-5 text-blue-500" />;
      case 'call completed':
        return <Phone className="h-5 w-5 text-green-500" />;
      case 'note added':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'meeting scheduled':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="dashboard-card bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="bg-muted dark:bg-gray-700 p-2 rounded-full flex-shrink-0">
              {getIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-white">{activity.leadName}</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    <span className={cn(
                      "inline-block font-medium mr-1",
                      activity.action.toLowerCase().includes('email') ? 'text-blue-600 dark:text-blue-400' :
                      activity.action.toLowerCase().includes('call') ? 'text-green-600 dark:text-green-400' :
                      activity.action.toLowerCase().includes('note') ? 'text-amber-600 dark:text-amber-400' :
                      activity.action.toLowerCase().includes('meeting') ? 'text-purple-600 dark:text-purple-400' :
                      activity.action.toLowerCase().includes('lead') ? 'text-pink-600 dark:text-pink-400' :
                      'text-gray-600 dark:text-gray-400'
                    )}>
                      {activity.action}
                    </span>
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground dark:text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
