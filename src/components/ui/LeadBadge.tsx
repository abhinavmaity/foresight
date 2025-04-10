
import React from 'react';
import { cn } from '@/lib/utils';
import { LeadPriority, LeadStatus } from '@/types/lead';

interface LeadBadgeProps {
  type: 'priority' | 'status';
  value: LeadPriority | LeadStatus;
  className?: string;
}

const LeadBadge: React.FC<LeadBadgeProps> = ({ type, value, className }) => {
  // Base styles
  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  // Priority badge styles
  const priorityStyles = {
    high: "bg-rose-100 text-rose-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-emerald-100 text-emerald-800"
  };

  // Status badge styles
  const statusStyles: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800",
    qualified: "bg-indigo-100 text-indigo-800",
    proposal: "bg-sky-100 text-sky-800",
    negotiation: "bg-violet-100 text-violet-800",
    closed: "bg-emerald-100 text-emerald-800",
    lost: "bg-gray-100 text-gray-800"
  };

  const styleMap = type === 'priority' ? priorityStyles : statusStyles;
  const style = styleMap[value as string] || "bg-gray-100 text-gray-800";

  return (
    <span className={cn(baseClass, style, className)}>
      {value}
    </span>
  );
};

export default LeadBadge;
