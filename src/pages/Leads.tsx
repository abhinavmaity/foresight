
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useLeads } from '@/hooks/useLeads';
import { LeadStatus, Lead } from '@/types/lead';
import DataEnrichmentCard from '@/components/leads/DataEnrichmentCard';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import AddLeadDialog from '@/components/leads/AddLeadDialog';
import ImportLeadsDialog from '@/components/leads/ImportLeadsDialog';
import { Button } from '@/components/ui/button';
import { Plus, FileUp, FileDown, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Mail,
  Archive,
  Phone,
  Goal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadsTabs from '@/components/leads/LeadsTabs';

const Leads: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { leads, isLoading, leadStats, createLead, updateLead, deleteLead } = useLeads();
  const [activeTab, setActiveTab] = useState<LeadStatus | 'all'>('all');
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredLeads = leads
    .filter(lead => filterStatus === 'all' ? true : lead.status === filterStatus)
    .filter(lead => filterPriority === 'all' ? true : lead.priority === filterPriority)
    .filter(lead => activeTab === 'all' ? true : lead.status === activeTab);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (leads.length === 0) {
      toast({
        title: "No leads to export",
        description: "Add some leads first before exporting.",
      });
      return;
    }
    
    // Create CSV content
    const headers = ["firstName", "lastName", "email", "phone", "company", "position", "priority", "status", "source", "value"];
    const csvContent = [
      headers.join(","),
      ...leads.map(lead => [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone || "",
        lead.company,
        lead.position || "",
        lead.priority,
        lead.status,
        lead.source,
        lead.value || ""
      ].join(","))
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `${leads.length} leads have been exported to CSV.`,
    });
  };

  const handleViewLeadDetails = (lead: Lead) => {
    toast({
      title: "View Lead Details",
      description: `Viewing details for ${lead.firstName} ${lead.lastName}`,
    });
  };

  const handleEditLead = (lead: Lead) => {
    toast({
      title: "Edit Lead",
      description: `Editing ${lead.firstName} ${lead.lastName}`,
    });
  };

  const handleDeleteLead = (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.firstName} ${lead.lastName}?`)) {
      deleteLead(lead.id);
    }
  };

  const handleScheduleFollowUp = async (lead: Lead) => {
    // This is now handled by FollowUpDialog component
    toast({
      title: "Schedule Follow-up",
      description: `Schedule follow-up for ${lead.firstName} ${lead.lastName}`,
    });
  };

  const handleAddNote = (lead: Lead) => {
    toast({
      title: "Add Note",
      description: "This feature is coming soon",
    });
  };

  const handleLeadEnriched = (lead: any) => {
    toast({
      title: "Lead Enriched",
      description: `Data for ${lead.firstName} ${lead.lastName} has been enhanced.`,
    });
  };

  // Create a test notification
  React.useEffect(() => {
    const createTestNotification = async () => {
      if (user?.id && leads.length > 0) {
        try {
          // Pick a random lead
          const randomLead = leads[Math.floor(Math.random() * leads.length)];
          
          // Calculate a future date for the notification (3 hours from now)
          const futureDate = new Date();
          futureDate.setHours(futureDate.getHours() + 3);
          
          // Create a test notification in the database
          await notificationService.createNotification({
            lead_id: randomLead.id,
            user_id: user.id,
            title: 'Welcome to Notifications!',
            message: `Follow-ups are now available. Try scheduling one with ${randomLead.firstName}.`,
            type: 'follow-up',
            scheduled_at: futureDate.toISOString()
          });
        } catch (error) {
          console.error('Error creating test notification:', error);
        }
      }
    };
    
    // Only create test notification once when leads are loaded
    if (leads.length > 0 && user?.id) {
      createTestNotification();
    }
  }, [leads.length > 0 && user?.id]);

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1A1F2C] dark:to-[#222731]">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center px-2">
            <Goal className="h-6 w-6 text-sidebar-foreground" />
            <span className="ml-2 text-xl font-bold text-sidebar-foreground">ForeSight</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Dashboard" 
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Leads"
                    isActive={true}
                    onClick={() => navigate('/leads')}
                  >
                    <Users className="h-5 w-5" />
                    <span>Leads</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Follow-ups"
                    onClick={() => navigate('/followups')}
                  >
                    <Mail className="h-5 w-5" />
                    <span>Follow-ups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Contacts"
                    onClick={() => navigate('/contacts')}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Contacts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Inventory"
                    onClick={() => navigate('/inventory')}
                  >
                    <Archive className="h-5 w-5" />
                    <span>Inventory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Calendar"
                    onClick={() => navigate('/calendar')}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Reports"
                    onClick={() => navigate('/reports')}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Settings"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Logout"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="container py-6 px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">Leads</h1>
              <p className="text-muted-foreground dark:text-gray-400">Manage and track your sales leads</p>
            </div>
            <div className="flex gap-2">
              <AddLeadDialog 
                trigger={
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Lead
                  </Button>
                }
              />
              <ImportLeadsDialog
                trigger={
                  <Button variant="outline" className="flex items-center gap-1">
                    <FileUp className="h-4 w-4" />
                    Import
                  </Button>
                }
              />
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-1">
                <FileDown className="h-4 w-4" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium mb-1">Status</p>
                    <div className="space-y-1">
                      <DropdownMenuItem onClick={() => setFilterStatus('all')}
                        className={filterStatus === 'all' ? 'bg-muted' : ''}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('new')}
                        className={filterStatus === 'new' ? 'bg-muted' : ''}>
                        New
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('qualified')}
                        className={filterStatus === 'qualified' ? 'bg-muted' : ''}>
                        Qualified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('proposal')}
                        className={filterStatus === 'proposal' ? 'bg-muted' : ''}>
                        Proposal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus('negotiation')}
                        className={filterStatus === 'negotiation' ? 'bg-muted' : ''}>
                        Negotiation
                      </DropdownMenuItem>
                    </div>
                  </div>
                  <div className="px-2 py-1.5 border-t">
                    <p className="text-sm font-medium mb-1">Priority</p>
                    <div className="space-y-1">
                      <DropdownMenuItem onClick={() => setFilterPriority('all')}
                        className={filterPriority === 'all' ? 'bg-muted' : ''}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('high')}
                        className={filterPriority === 'high' ? 'bg-muted' : ''}>
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('medium')}
                        className={filterPriority === 'medium' ? 'bg-muted' : ''}>
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority('low')}
                        className={filterPriority === 'low' ? 'bg-muted' : ''}>
                        Low
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <LeadsTabs
            isLoading={isLoading}
            leads={leads}
            activeTab={activeTab}
            filteredLeads={filteredLeads}
            onTabChange={(value) => setActiveTab(value as LeadStatus | 'all')}
            onViewDetails={handleViewLeadDetails}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
            onScheduleFollowUp={handleScheduleFollowUp}
            onAddNote={handleAddNote}
          />

          <DataEnrichmentCard onLeadEnriched={handleLeadEnriched} />
        </main>
      </div>
    </div>
  );
};

export default Leads;
