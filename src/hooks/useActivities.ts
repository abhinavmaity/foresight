
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activityService, Activity } from '@/services/activityService';

export const useActivities = (leadId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all activities or activities for a specific lead
  const { data: activities = [], isLoading, error, refetch } = useQuery({
    queryKey: leadId ? ['activities', leadId] : ['activities'],
    queryFn: () => leadId 
      ? activityService.getActivitiesByLeadId(leadId)
      : activityService.getActivities()
  });

  // Create activity
  const createActivityMutation = useMutation({
    mutationFn: ({ leadId, action, description }: { leadId: string, action: string, description?: string }) => 
      activityService.createActivity(leadId, action, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      if (leadId) {
        queryClient.invalidateQueries({ queryKey: ['activities', leadId] });
      }
      toast({
        title: 'Activity recorded',
        description: 'The activity has been successfully recorded.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error recording activity',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    activities,
    isLoading,
    error,
    refetch,
    createActivity: createActivityMutation.mutate,
    isCreating: createActivityMutation.isPending,
  };
};
