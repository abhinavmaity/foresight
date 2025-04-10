
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { Lead } from '@/types/lead';

interface CreateFollowUpDialogProps {
  trigger: React.ReactNode;
  selectedLead?: Lead;
}

const CreateFollowUpDialog: React.FC<CreateFollowUpDialogProps> = ({ trigger, selectedLead }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { leads } = useLeads();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedLeadId, setSelectedLeadId] = useState<string>(selectedLead?.id || '');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedLeadId || !title) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Find the selected lead to get details
      const lead = leads.find(l => l.id === selectedLeadId);
      
      if (!lead || !user) {
        toast({
          title: "Error",
          description: "Could not find lead or user information.",
          variant: "destructive",
        });
        return;
      }
      
      // Create a notification for the follow-up
      await notificationService.createNotification({
        lead_id: lead.id,
        user_id: user.id,
        title: title,
        message: notes || `Follow-up with ${lead.firstName} ${lead.lastName}`,
        type: 'follow-up',
        scheduled_at: date.toISOString()
      });
      
      toast({
        title: "Follow-up scheduled",
        description: `Follow-up scheduled for ${format(date, 'PPP')} with ${lead.firstName} ${lead.lastName}.`,
      });
      
      // Reset form and close dialog
      setDate(undefined);
      setSelectedLeadId('');
      setTitle('');
      setNotes('');
      setOpen(false);
      
    } catch (error) {
      console.error("Error creating follow-up:", error);
      toast({
        title: "Error",
        description: "Failed to schedule follow-up. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
          <DialogDescription>
            Set a date and time to follow up with a lead.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!selectedLead && (
              <div className="space-y-2">
                <Label htmlFor="lead">Lead *</Label>
                <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.firstName} {lead.lastName} - {lead.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Product demo, Contract discussion"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any details about this follow-up"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Follow-up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFollowUpDialog;
