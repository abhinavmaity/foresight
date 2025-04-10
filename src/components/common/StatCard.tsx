
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue,
  className 
}) => {
  return (
    <div className={cn(
      "dashboard-card bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-100/80 dark:border-gray-700/50 shadow-sm p-6 transition-all hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {description && <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">{description}</p>}
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium flex items-center",
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 
                trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'
              )}>
                {trend === 'up' && (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                )}
                {trend === 'down' && (
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
