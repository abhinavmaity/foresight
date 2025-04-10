import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Filter,
  PlusCircle,
  Mail,
  PhoneCall,
} from "lucide-react";
import { Lead } from "@/types/lead";
import LeadBadge from "../ui/LeadBadge";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  calculateLeadScore,
  getScoreColor,
  getPriorityFromScore,
} from "./LeadScoreCalculator";
import { useLeads } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import FollowUpDialog from "./FollowUpDialog";

interface LeadTableProps {
  leads: Lead[];
  onViewDetails?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onScheduleFollowUp?: (lead: Lead) => void;
  onAddNote?: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onViewDetails,
  onEdit,
  onDelete,
  onScheduleFollowUp,
  onAddNote,
}) => {
  const { updateLead } = useLeads();
  const { toast } = useToast();

  const handleSendEmail = (lead: Lead) => {
    // In a real application, this would open an email composer or send an API request
    window.open(
      `mailto:${lead.email}?subject=Follow-up from ${lead.company}&body=Hello ${lead.firstName},`
    );

    // Update the lead's last contacted date
    updateLead({
      id: lead.id,
      data: {
        lastContactedAt: new Date().toISOString(),
      },
    });

    toast({
      title: "Email",
      description: `Composing email to ${lead.firstName} at ${lead.email}`,
      duration: 3000,
    });
  };

  const handleCallLead = (lead: Lead) => {
    if (lead.phone) {
      // Update the lead's last contacted date
      updateLead({
        id: lead.id,
        data: {
          lastContactedAt: new Date().toISOString(),
        },
      });

      // Open the device's phone app with the lead's number
      window.open(`tel:${lead.phone.replace(/\D/g, "")}`);

      toast({
        title: "Calling...",
        description: `Calling ${lead.firstName} at ${lead.phone}`,
        duration: 5000,
      });
    } else {
      toast({
        title: "No Phone Number",
        description: `No phone number available for ${lead.firstName}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Leads
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="w-[250px] dark:text-gray-300">
                Name
              </TableHead>
              <TableHead className="dark:text-gray-300">Priority</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Company</TableHead>
              <TableHead className="dark:text-gray-300">Score</TableHead>
              <TableHead className="dark:text-gray-300">Last Contact</TableHead>
              <TableHead className="dark:text-gray-300">
                Next Follow-up
              </TableHead>
              <TableHead className="text-right dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => {
                const leadScore = calculateLeadScore(lead);
                const scoreColor = getScoreColor(leadScore);
                const priority = getPriorityFromScore(leadScore);

                return (
                  <TableRow
                    key={lead.id}
                    className="dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium dark:text-white">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-gray-400">
                          {lead.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <LeadBadge type="priority" value={priority} />
                    </TableCell>
                    <TableCell>
                      <LeadBadge type="status" value={lead.status} />
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {lead.company}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-2">
                          <div
                            className={`h-full ${scoreColor}`}
                            style={{ width: `${leadScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium dark:text-gray-300">
                          {leadScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {lead.lastContactedAt
                        ? formatDistanceToNow(new Date(lead.lastContactedAt), {
                            addSuffix: true,
                          })
                        : "Not contacted"}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {lead.nextFollowUp
                        ? formatDistanceToNow(new Date(lead.nextFollowUp), {
                            addSuffix: true,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendEmail(lead)}
                          className="h-8 w-8"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCallLead(lead)}
                          className="h-8 w-8"
                          title="Call"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>

                        <FollowUpDialog
                          lead={lead}
                          trigger={
                            <Button variant="outline" size="sm" className="h-8">
                              Follow-up
                            </Button>
                          }
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onViewDetails?.(lead)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                              Edit Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAddNote?.(lead)}>
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-600 dark:text-rose-400"
                              onClick={() => onDelete?.(lead)}
                            >
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadTable;
