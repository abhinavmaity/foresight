
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar";

// Maps database columns to frontend model
const mapDbToEvent = (event: any): CalendarEvent => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    location: event.location,
    color: event.color,
    isAllDay: event.is_all_day,
    createdAt: event.created_at,
    updatedAt: event.updated_at
  };
};

// Maps frontend model to database columns
const mapEventToDb = (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
  return {
    title: event.title,
    description: event.description,
    start_time: event.startTime,
    end_time: event.endTime,
    location: event.location,
    color: event.color,
    is_all_day: event.isAllDay
  };
};

export const calendarService = {
  async getEvents(): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
    
    return (data || []).map(mapDbToEvent);
  },
  
  async getEventById(id: string): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching calendar event:', error);
      throw error;
    }
    
    return mapDbToEvent(data);
  },
  
  async createEvent(event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...mapEventToDb(event),
        user_id: supabase.auth.getUser().then(data => data.data.user?.id)
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
    
    return mapDbToEvent(data);
  },
  
  async updateEvent(id: string, updates: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(mapEventToDb(updates as Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
    
    return mapDbToEvent(data);
  },
  
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
};
