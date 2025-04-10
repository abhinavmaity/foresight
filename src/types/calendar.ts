
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  isAllDay?: boolean;
  createdAt: string;
  updatedAt: string;
}
