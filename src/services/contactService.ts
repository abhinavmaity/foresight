
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/contact";

// Maps database columns to frontend model
const mapDbToContact = (contact: any): Contact => {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    position: contact.position,
    isFavorite: contact.is_favorite,
    avatarUrl: contact.avatar_url,
    lastContacted: contact.last_contacted,
    createdAt: contact.created_at,
    updatedAt: contact.updated_at
  };
};

// Maps frontend model to database columns
const mapContactToDb = (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
  return {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    position: contact.position,
    is_favorite: contact.isFavorite,
    avatar_url: contact.avatarUrl,
    last_contacted: contact.lastContacted
  };
};

export const contactService = {
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
    
    return (data || []).map(mapDbToContact);
  },
  
  async getContactById(id: string): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
    
    return mapDbToContact(data);
  },
  
  async createContact(contact: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...mapContactToDb(contact),
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
    
    return mapDbToContact(data);
  },
  
  async updateContact(id: string, updates: Partial<Omit<Contact, "id" | "createdAt" | "updatedAt">>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update(mapContactToDb(updates as Omit<Contact, "id" | "createdAt" | "updatedAt">))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
    
    return mapDbToContact(data);
  },
  
  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },
  
  async toggleFavorite(id: string, isFavorite: boolean): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating favorite status:', error);
      throw error;
    }
    
    return mapDbToContact(data);
  }
};
