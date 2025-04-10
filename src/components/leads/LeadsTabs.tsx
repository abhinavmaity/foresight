
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { LeadStatus } from '@/types/lead';
import LeadTable from './LeadTable';
import { Lead } from '@/types/lead';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LeadsTabsProps {
  isLoading: boolean;
  leads: Lead[];
  activeTab: LeadStatus | 'all';
  filteredLeads: Lead[];
  onTabChange: (value: string) => void;
  onViewDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onScheduleFollowUp: (lead: Lead) => void;
  onAddNote: (lead: Lead) => void;
}

const LeadsTabs: React.FC<LeadsTabsProps> = ({
  isLoading,
  leads,
  activeTab,
  filteredLeads,
  onTabChange,
  onViewDetails,
  onEdit,
  onDelete,
  onScheduleFollowUp,
  onAddNote
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No leads found</AlertTitle>
        <AlertDescription>
          You don't have any leads yet. Add your first lead to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="proposal">Proposal</TabsTrigger>
          <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="space-y-6">
        <LeadTable 
          leads={filteredLeads} 
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onScheduleFollowUp={onScheduleFollowUp}
          onAddNote={onAddNote}
        />
      </TabsContent>
      <TabsContent value="new" className="space-y-6">
        <LeadTable 
          leads={filteredLeads} 
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onScheduleFollowUp={onScheduleFollowUp}
          onAddNote={onAddNote}
        />
      </TabsContent>
      <TabsContent value="qualified" className="space-y-6">
        <LeadTable 
          leads={filteredLeads} 
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onScheduleFollowUp={onScheduleFollowUp}
          onAddNote={onAddNote}
        />
      </TabsContent>
      <TabsContent value="proposal" className="space-y-6">
        <LeadTable 
          leads={filteredLeads} 
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onScheduleFollowUp={onScheduleFollowUp}
          onAddNote={onAddNote}
        />
      </TabsContent>
      <TabsContent value="negotiation" className="space-y-6">
        <LeadTable 
          leads={filteredLeads} 
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onScheduleFollowUp={onScheduleFollowUp}
          onAddNote={onAddNote}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeadsTabs;
