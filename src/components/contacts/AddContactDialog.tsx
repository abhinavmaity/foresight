
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
import { useContacts } from '@/hooks/useContacts';
import { Contact } from '@/types/contact';

interface AddContactDialogProps {
  trigger: React.ReactNode;
  onAddContact?: (newContact: any) => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({ trigger, onAddContact }) => {
  const { toast } = useToast();
  const { addContact, isAdding } = useContacts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }
    
    // Create contact object for the database
    const newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      position: formData.position,
      isFavorite: false,
    };
    
    addContact(newContact);
    
    // If onAddContact prop exists, call it with the new contact
    if (onAddContact) {
      onAddContact({
        ...newContact,
        id: `temp-${Date.now()}`, // Generate a temporary ID for UI rendering
      });
    }
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to your network. Fill in the information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
