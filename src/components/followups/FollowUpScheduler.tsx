import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarClock, CalendarPlus, Mail, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types/lead";
import { notificationService } from "@/services/notificationService";

export interface FollowUpSchedulerProps {
  lead?: Lead;
  onScheduled?: () => void;
  view?: "list" | "calendar";
}

const FollowUpScheduler: React.FC<FollowUpSchedulerProps> = ({
  lead,
  onScheduled,
  view = "list",
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // If no lead is provided, this is being used as a list/calendar view component
  if (!lead) {
    return (
      <div className="space-y-4">
        {view === "list" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow-up List</h2>
            {/* List view implementation */}
            <p>Follow-up list view will be implemented here</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow-up Calendar</h2>
            {/* Calendar view implementation */}
            <p>Follow-up calendar view will be implemented here</p>
          </div>
        )}
      </div>
    );
  }

  // Original implementation for when a lead is provided
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState<"follow-up" | "email" | "call">("follow-up");
  const [title, setTitle] = useState(
    `Follow-up with ${lead.firstName} ${lead.lastName}`
  );
  const [message, setMessage] = useState(
    `Schedule follow-up with ${lead.firstName} from ${lead.company}`
  );

  const handleSchedule = async () => {
    if (!user?.id || !date) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(":").map(Number);
      dateTime.setHours(hours, minutes);

      // Create notification based on type
      let notificationType = type;
      const typeTitle =
        type === "follow-up"
          ? `Follow-up with ${lead.firstName}`
          : type === "email"
          ? `Send email to ${lead.firstName}`
          : `Call ${lead.firstName}`;

      await notificationService.createNotification({
        lead_id: lead.id,
        user_id: user.id,
        title: `${typeTitle} (${lead.company})`,
        message: message,
        type: notificationType,
        scheduled_at: dateTime.toISOString(),
      });

      // Update the lead with next follow up date
      await notificationService.updateLeadFollowupDate(
        lead.id,
        dateTime.toISOString()
      );

      toast({
        title: "Follow-up Scheduled",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } reminder set for ${format(dateTime, "PPp")}`,
      });

      if (onScheduled) {
        onScheduled();
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      toast({
        title: "Error",
        description: "Failed to schedule follow-up",
        variant: "destructive",
      });
    }
  };

  const getIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      default:
        return <CalendarClock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          Schedule a{" "}
          {type === "follow-up"
            ? "Follow-up"
            : type === "email"
            ? "Email Reminder"
            : "Call"}{" "}
          with {lead.firstName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(value: any) => {
              setType(value);
              if (value === "email") {
                setTitle(`Send email to ${lead.firstName} (${lead.company})`);
                setMessage(
                  `Send follow-up email to ${lead.firstName} at ${lead.email}`
                );
              } else if (value === "call") {
                setTitle(`Call ${lead.firstName} (${lead.company})`);
                setMessage(
                  `Call ${lead.firstName} at ${lead.phone || "unknown phone"}`
                );
              } else {
                setTitle(`Follow-up with ${lead.firstName} (${lead.company})`);
                setMessage(
                  `Schedule follow-up with ${lead.firstName} from ${lead.company}`
                );
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow-up">General Follow-up</SelectItem>
              <SelectItem value="email">Email Reminder</SelectItem>
              <SelectItem value="call">Call Reminder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title for this follow-up"
          />
        </div>

        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Details for this follow-up"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={handleSchedule}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FollowUpScheduler;
