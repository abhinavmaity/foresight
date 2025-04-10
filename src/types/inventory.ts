
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  sku: string;
  status: "In Stock" | "Out of Stock" | "Low Stock";
  lastUpdated: string;
}
