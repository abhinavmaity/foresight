
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem } from "@/types/inventory";

// Maps database columns to our frontend model
const mapDbToInventoryItem = (item: any): InventoryItem => {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    threshold: item.threshold,
    sku: item.sku,
    status: item.status,
    lastUpdated: item.last_updated
  };
};

// Maps our frontend model to database columns
const mapInventoryItemToDb = (item: Omit<InventoryItem, "id">) => {
  return {
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    threshold: item.threshold,
    sku: item.sku,
    status: item.status,
    last_updated: item.lastUpdated
  };
};

export const inventoryService = {
  async getInventory(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
    
    return (data || []).map(mapDbToInventoryItem);
  },
  
  async getInventoryById(id: string): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
    
    return mapDbToInventoryItem(data);
  },
  
  async createInventoryItem(item: Omit<InventoryItem, "id">): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(mapInventoryItemToDb(item))
      .select()
      .single();
    
    if (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
    
    return mapDbToInventoryItem(data);
  },
  
  async updateInventoryItem(id: string, updates: Partial<Omit<InventoryItem, "id">>): Promise<InventoryItem> {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(mapInventoryItemToDb(updates as Omit<InventoryItem, "id">))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
    
    return mapDbToInventoryItem(data);
  },
  
  async deleteInventoryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }
};
