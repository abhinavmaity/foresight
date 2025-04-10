
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';

interface AddInventoryItemDialogProps {
  trigger: React.ReactNode;
}

const AddInventoryItemDialog: React.FC<AddInventoryItemDialogProps> = ({ trigger }) => {
  const { toast } = useToast();
  const { addItem } = useInventory();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'product',
    price: '',
    quantity: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Item name is required.",
        variant: "destructive",
      });
      return;
    }
    
    // Parse numeric values
    const parsedQuantity = parseInt(formData.quantity) || 0;
    
    // Determine the correct status value based on quantity
    const status = parsedQuantity > 0 
      ? "In Stock" as const 
      : "Out of Stock" as const;
    
    const newItem = {
      name: formData.name,
      category: formData.category,
      quantity: parsedQuantity,
      threshold: 10, // Default threshold value
      sku: `INV-${Date.now().toString().slice(-6)}`,
      // Explicitly type the status as a union type
      status: status,
      lastUpdated: new Date().toISOString()
    };
    
    addItem(newItem);
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: 'product',
      price: '',
      quantity: '',
      description: ''
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
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new product or service to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleSelectChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryItemDialog;
