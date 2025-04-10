
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadPriority, LeadStatus } from '@/types/lead';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { activityService } from '@/services/activityService';

export const useLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all leads
  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: leadService.getLeads
  });

  // Get lead stats
  const { data: leadStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['leadStats'],
    queryFn: leadService.getLeadStats
  });

  // Create lead
  const createLeadMutation = useMutation({
    mutationFn: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => 
      leadService.createLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      toast({
        title: 'Lead created',
        description: 'The lead has been successfully created.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update lead
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      leadService.updateLead(id, data),
    onSuccess: async (lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      toast({
        title: 'Lead updated',
        description: 'The lead has been successfully updated.',
      });
      
      // Record activity for status changes if status was in the update
      if ('status' in lead) {
        await activityService.createActivity(
          lead.id,
          `Status changed to ${lead.status}`,
          `Lead status updated to ${lead.status}`
        );
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadStats'] });
      toast({
        title: 'Lead deleted',
        description: 'The lead has been successfully deleted.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    leads,
    leadStats,
    isLoading,
    isLoadingStats,
    error,
    refetch,
    createLead: createLeadMutation.mutate,
    isCreating: createLeadMutation.isPending,
    updateLead: updateLeadMutation.mutate,
    isUpdating: updateLeadMutation.isPending,
    deleteLead: deleteLeadMutation.mutate,
    isDeleting: deleteLeadMutation.isPending,
    getLeadsByStatus: (status: LeadStatus) => {
      return leads.filter(lead => lead.status === status);
    },
    getLeadsByPriority: (priority: LeadPriority) => {
      return leads.filter(lead => lead.priority === priority);
    }
  };
};
