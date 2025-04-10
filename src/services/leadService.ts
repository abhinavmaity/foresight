import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Lead, LeadPriority, LeadStatus, LeadSource } from "@/types/lead";
import {
  calculateLeadScore,
  getPriorityFromScore,
} from "@/components/leads/LeadScoreCalculator";

// Map our frontend Lead type to the database schema
const mapLeadToDb = (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
  return {
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    position: lead.position,
    priority: lead.priority,
    status: lead.status,
    source: lead.source,
    value: lead.value,
    next_follow_up: lead.nextFollowUp,
    last_contacted_at: lead.lastContactedAt,
    notes: lead.notes,
    industry: lead.industry,
    company_size: lead.companySize,
    revenue: lead.revenue,
  };
};

// Map database row to our frontend Lead type
const mapDbToLead = (record: any): Lead => {
  return {
    id: record.id,
    firstName: record.first_name,
    lastName: record.last_name,
    email: record.email,
    phone: record.phone,
    company: record.company,
    position: record.position,
    priority: record.priority as LeadPriority,
    status: record.status as LeadStatus,
    source: record.source as LeadSource,
    value: record.value,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    lastContactedAt: record.last_contacted_at,
    nextFollowUp: record.next_follow_up,
    notes: record.notes,
    industry: record.industry,
    companySize: record.company_size,
    revenue: record.revenue,
  };
};

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }

    return (data || []).map(mapDbToLead);
  },

  async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 means no rows returned
        return null;
      }

      console.error("Error fetching lead:", error);
      throw error;
    }

    return data ? mapDbToLead(data) : null;
  },

  async createLead(
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
  ): Promise<Lead> {
    // Calculate lead score and set priority
    const leadScore = calculateLeadScore(lead);
    const priority = getPriorityFromScore(leadScore);

    const leadWithPriority = {
      ...lead,
      priority,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(mapLeadToDb(leadWithPriority))
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      throw error;
    }

    return mapDbToLead(data);
  },

  async updateLead(
    id: string,
    lead: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>
  ): Promise<Lead> {
    // Get current lead data to calculate score
    const currentLead = await this.getLeadById(id);
    if (!currentLead) {
      throw new Error("Lead not found");
    }

    // Merge current lead with updates
    const updatedLead = { ...currentLead, ...lead };

    // Calculate new score and priority
    const leadScore = calculateLeadScore(updatedLead);
    const priority = getPriorityFromScore(leadScore);

    const leadWithPriority = {
      ...lead,
      priority,
    };

    const { data, error } = await supabase
      .from("leads")
      .update(mapLeadToDb(leadWithPriority as any))
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead:", error);
      throw error;
    }

    return mapDbToLead(data);
  },

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  },

  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads by status:", error);
      throw error;
    }

    return (data || []).map(mapDbToLead);
  },

  async getLeadsByPriority(priority: LeadPriority): Promise<Lead[]> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("priority", priority)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads by priority:", error);
      throw error;
    }

    return (data || []).map(mapDbToLead);
  },

  getLeadScore(lead: Lead): number {
    return calculateLeadScore(lead);
  },

  async getLeadStats(): Promise<{
    total: number;
    high: number;
    medium: number;
    low: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    conversion: number;
  }> {
    const { data, error } = await supabase
      .from("leads")
      .select("priority, status");

    if (error) {
      console.error("Error fetching lead stats:", error);
      throw error;
    }

    const total = data.length;
    const high = data.filter((lead) => lead.priority === "high").length;
    const medium = data.filter((lead) => lead.priority === "medium").length;
    const low = data.filter((lead) => lead.priority === "low").length;
    const newLeads = data.filter((lead) => lead.status === "new").length;
    const contacted = data.filter((lead) => lead.status === "contacted").length;
    const qualified = data.filter((lead) => lead.status === "qualified").length;
    const proposal = data.filter((lead) => lead.status === "proposal").length;
    const closed = data.filter((lead) => lead.status === "closed").length;

    // Calculate conversion rate (closed deals / total leads)
    const conversion = total > 0 ? closed / total : 0;

    return {
      total,
      high,
      medium,
      low,
      new: newLeads,
      contacted,
      qualified,
      proposal,
      conversion,
    };
  },

  async getSalesData() {
    const { data, error } = await supabase
      .from("sales" as any)
      .select("*, leads(first_name, last_name, company)");

    if (error) {
      console.error("Error fetching sales data:", error);
      throw error;
    }

    return data || [];
  },

  async scheduleSalesFollowup(
    leadId: string,
    userId: string,
    date: string,
    message: string
  ) {
    // Get lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("first_name, last_name")
      .eq("id", leadId)
      .single();

    if (leadError) {
      console.error("Error fetching lead for followup:", leadError);
      throw leadError;
    }

    // Create followup notification
    const { data, error } = await supabase.from("notifications" as any).insert({
      lead_id: leadId,
      user_id: userId,
      title: `Follow-up with ${lead.first_name} ${lead.last_name}`,
      message:
        message ||
        `Scheduled follow-up with ${lead.first_name} ${lead.last_name}`,
      type: "follow-up",
      scheduled_at: date,
      is_read: false,
    });

    if (error) {
      console.error("Error scheduling follow-up:", error);
      throw error;
    }

    return data;
  },
};
