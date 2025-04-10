
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Mail, Phone, Calendar } from 'lucide-react';
import { Lead } from '@/types/lead';
import { Button } from '@/components/ui/button';
import LeadBadge from '../ui/LeadBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{lead.firstName} {lead.lastName}</h3>
            <p className="text-sm text-muted-foreground">{lead.position} at {lead.company}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
              <DropdownMenuItem>Add Task</DropdownMenuItem>
              <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">Delete Lead</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 mb-3">
          <LeadBadge type="priority" value={lead.priority} />
          <LeadBadge type="status" value={lead.status} />
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{lead.phone}</span>
            </div>
          )}
          {lead.value !== undefined && (
            <div className="flex items-center text-sm font-medium">
              <span className="rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-xs">
                ${lead.value.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {lead.notes && (
          <div className="bg-muted p-2 rounded-md text-sm mb-3">
            <p className="text-muted-foreground line-clamp-2">{lead.notes}</p>
          </div>
        )}
      </div>

      <div className="border-t p-3 bg-muted/30 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
        </div>
        
        {lead.nextFollowUp && (
          <div className="flex items-center text-xs text-primary">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Follow-up in {formatDistanceToNow(new Date(lead.nextFollowUp))}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
