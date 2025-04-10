
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
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEvent } from '@/types/calendar';

interface AddEventDialogProps {
  trigger: React.ReactNode;
  onAddEvent?: (newEvent: any) => void;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({ trigger, onAddEvent }) => {
  const { toast } = useToast();
  const { addEvent, isAdding } = useCalendar();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    details: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "Missing information",
        description: "Please enter a title for the event.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Combine date and time for start time
      const startDate = new Date(date);
      const [startHours, startMinutes] = time.split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      // Create end time (1 hour after start by default)
      const endDate = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes);
      
      // Create new event to save to database
      const newEvent: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        description: formData.details,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };
      
      addEvent(newEvent);
      
      // If onAddEvent prop exists, call it with the new event
      if (onAddEvent) {
        onAddEvent({
          ...newEvent,
          id: `temp-${Date.now()}`, // Generate a temporary ID for UI rendering
          date: startDate, // Add date property for UI
          type: formData.type // Add type property for UI
        });
      }
      
      // Reset form
      setFormData({
        title: '',
        type: 'meeting',
        details: '',
      });
      setDate(new Date());
      setTime('09:00');
      setEndTime('10:00');
      
      setOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Could not create event. Please try again.",
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
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event in your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Add event details..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
