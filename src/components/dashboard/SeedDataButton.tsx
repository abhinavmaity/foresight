
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Database, Trash } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { seedService } from '@/services/seedService';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SeedDataButton: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [operation, setOperation] = useState<'seed' | 'truncate'>('seed');

  const handleSeedData = async () => {
    setIsLoading(true);
    
    try {
      const result = await seedService.seedLeads(500);
      
      if (result.success) {
        toast({
          title: "Data Generated",
          description: result.message,
          duration: 5000,
        });
        
        // Refetch data
        queryClient.invalidateQueries();
      } else {
        toast({
          title: "Error",
          description: "Failed to generate data. See console for details.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. See console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTruncateData = async () => {
    setIsLoading(true);
    
    try {
      const result = await seedService.truncateLeads();
      
      if (result.success) {
        toast({
          title: "Data Cleared",
          description: result.message,
          duration: 5000,
        });
        
        // Refetch data
        queryClient.invalidateQueries();
      } else {
        toast({
          title: "Error",
          description: "Failed to clear data. See console for details.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error truncating data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. See console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperation = () => {
    if (operation === 'seed') {
      handleSeedData();
    } else {
      handleTruncateData();
    }
    setConfirmationOpen(false);
  };

  const openConfirmation = (op: 'seed' | 'truncate') => {
    setOperation(op);
    setConfirmationOpen(true);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => openConfirmation('seed')}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          {isLoading && operation === 'seed' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Generate Demo Data
        </Button>
        
        <Button
          onClick={() => openConfirmation('truncate')}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-red-500 hover:text-red-600"
        >
          {isLoading && operation === 'truncate' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
          Clear All Data
        </Button>
      </div>
      
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {operation === 'seed' ? 'Generate Demo Data?' : 'Clear All Data?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {operation === 'seed' 
                ? 'This will generate 500 demo leads with related sales, activities, and notifications for testing purposes.'
                : 'This will permanently delete all leads, sales, activities, and notifications from the database.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOperation}>
              {operation === 'seed' ? 'Generate Data' : 'Clear Data'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SeedDataButton;
