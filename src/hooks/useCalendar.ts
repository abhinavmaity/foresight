
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '@/services/calendarService';
import { CalendarEvent } from '@/types/calendar';

export const useCalendar = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all events
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: calendarService.getEvents
  });
  
  // Create event
  const addEventMutation = useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => 
      calendarService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Created',
        description: 'Event has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Creating Event',
        description: error.message || 'There was an error creating the event.',
        variant: 'destructive',
      });
    }
  });
  
  // Update event
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      calendarService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Updated',
        description: 'Event has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Event',
        description: error.message || 'There was an error updating the event.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete event
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => calendarService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Deleted',
        description: 'Event has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Event',
        description: error.message || 'There was an error deleting the event.',
        variant: 'destructive',
      });
    }
  });

  return {
    events,
    isLoading,
    error,
    addEvent: addEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isAdding: addEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending
  };
};
