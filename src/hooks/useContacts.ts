
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contactService';
import { Contact } from '@/types/contact';

export const useContacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all contacts
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactService.getContacts
  });
  
  // Create contact
  const addContactMutation = useMutation({
    mutationFn: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => 
      contactService.createContact(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact Added',
        description: 'Contact has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Adding Contact',
        description: error.message || 'There was an error adding the contact.',
        variant: 'destructive',
      });
    }
  });
  
  // Update contact
  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      contactService.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact Updated',
        description: 'Contact has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Contact',
        description: error.message || 'There was an error updating the contact.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact Deleted',
        description: 'Contact has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Contact',
        description: error.message || 'There was an error deleting the contact.',
        variant: 'destructive',
      });
    }
  });
  
  // Toggle favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string, isFavorite: boolean }) => 
      contactService.toggleFavorite(id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'There was an error updating favorite status.',
        variant: 'destructive',
      });
    }
  });

  return {
    contacts,
    isLoading,
    error,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isAdding: addContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
};
