
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import FollowUpScheduler from '../followups/FollowUpScheduler';
import { Lead } from '@/types/lead';

interface FollowUpDialogProps {
  lead: Lead;
  trigger: React.ReactNode;
}

const FollowUpDialog: React.FC<FollowUpDialogProps> = ({ lead, trigger }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
          <DialogDescription>
            Create a follow-up reminder for {lead.firstName} {lead.lastName}
          </DialogDescription>
        </DialogHeader>
        <FollowUpScheduler lead={lead} onScheduled={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpDialog;
