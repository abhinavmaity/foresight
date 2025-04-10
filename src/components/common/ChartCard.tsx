
import React from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className,
  action
}) => {
  return (
    <div className={cn(
      "dashboard-card bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100/80 dark:border-gray-700/50 shadow-md rounded-xl p-6 transition-all hover:shadow-lg", 
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground dark:text-gray-400">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChartCard;
