
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface Activity {
  id: string;
  leadId: string;
  leadName?: string;
  action: string;
  description: string | null;
  date: string;
}

// Map database row to our frontend Activity type
const mapDbToActivity = (record: any, includeLead = false): Activity => {
  return {
    id: record.id,
    leadId: record.lead_id,
    leadName: includeLead ? `${record.leads?.first_name} ${record.leads?.last_name}` : undefined,
    action: record.action,
    description: record.description,
    date: record.created_at
  };
};

export const activityService = {
  async getActivities(): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        leads:lead_id (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
    
    return (data || []).map(record => mapDbToActivity(record, true));
  },
  
  async getActivitiesByLeadId(leadId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching lead activities:', error);
      throw error;
    }
    
    return (data || []).map(record => mapDbToActivity(record));
  },
  
  async createActivity(leadId: string, action: string, description?: string): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        lead_id: leadId,
        action,
        description
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
    
    return mapDbToActivity(data);
  }
};
