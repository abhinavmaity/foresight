
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventoryService';
import { InventoryItem } from '@/types/inventory';

export const useInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all inventory items
  const { data: inventory = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryService.getInventory
  });
  
  // Create new item
  const addItemMutation = useMutation({
    mutationFn: (item: Omit<InventoryItem, 'id'>) => 
      inventoryService.createInventoryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Item Added',
        description: 'Inventory item has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Adding Item',
        description: error.message || 'There was an error adding the inventory item.',
        variant: 'destructive',
      });
    }
  });
  
  // Update item
  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<InventoryItem, 'id'>> }) => 
      inventoryService.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Item Updated',
        description: 'Inventory item has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Item',
        description: error.message || 'There was an error updating the inventory item.',
        variant: 'destructive',
      });
    }
  });
  
  // Delete item
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: 'Item Deleted',
        description: 'Inventory item has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Item',
        description: error.message || 'There was an error deleting the inventory item.',
        variant: 'destructive',
      });
    }
  });

  return {
    inventory,
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isDeleting: deleteItemMutation.isPending
  };
};
