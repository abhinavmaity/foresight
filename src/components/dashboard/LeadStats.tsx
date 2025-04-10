
import React from 'react';
import StatCard from '../common/StatCard';
import { Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { LeadStats } from '@/types/lead';

interface LeadStatsProps {
  stats: LeadStats;
  isLoading?: boolean;
}

const LeadStatsComponent: React.FC<LeadStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Leads" 
        value={stats.total} 
        icon={<Users className="h-5 w-5 text-primary" />}
        trend="up"
        trendValue="12% from last month"
      />
      <StatCard 
        title="High Priority" 
        value={stats.high} 
        icon={<TrendingUp className="h-5 w-5 text-rose-600" />}
        description={`${stats.total > 0 ? ((stats.high / stats.total) * 100).toFixed(1) : 0}% of total`}
      />
      <StatCard 
        title="Requires Follow-up" 
        value={stats.contacted + stats.qualified} 
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        description="Leads needing attention"
      />
      <StatCard 
        title="Conversion Rate" 
        value={`${(stats.conversion * 100).toFixed(1)}%`} 
        icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        trend="up"
        trendValue="1.2% from last month"
      />
    </div>
  );
};

export default LeadStatsComponent;
