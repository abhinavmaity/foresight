
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';

// Mock inventory data
const inventoryItems = [
  { id: 1, sku: 'PRD-001', name: 'Premium CRM License', category: 'Software', qty: 150, threshold: 20, status: 'In Stock', lastUpdated: '2023-10-15' },
  { id: 2, sku: 'PRD-002', name: 'Enterprise CRM License', category: 'Software', qty: 80, threshold: 15, status: 'In Stock', lastUpdated: '2023-10-12' },
  { id: 3, sku: 'PRD-003', name: 'Basic CRM License', category: 'Software', qty: 10, threshold: 30, status: 'Low Stock', lastUpdated: '2023-10-10' },
  { id: 4, sku: 'HW-001', name: 'Employee Laptops', category: 'Hardware', qty: 45, threshold: 10, status: 'In Stock', lastUpdated: '2023-09-28' },
  { id: 5, sku: 'HW-002', name: 'Server Hardware', category: 'Hardware', qty: 5, threshold: 8, status: 'Low Stock', lastUpdated: '2023-09-15' },
  { id: 6, sku: 'SUP-001', name: 'Office Supplies', category: 'Supplies', qty: 200, threshold: 50, status: 'In Stock', lastUpdated: '2023-10-05' },
  { id: 7, sku: 'SUP-002', name: 'Marketing Materials', category: 'Supplies', qty: 0, threshold: 20, status: 'Out of Stock', lastUpdated: '2023-09-20' },
];

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter inventory based on search and tab
  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'lowStock') return matchesSearch && item.status === 'Low Stock';
    if (activeTab === 'outOfStock') return matchesSearch && item.status === 'Out of Stock';
    
    return matchesSearch;
  });
  
  // Get counts for the badges
  const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockCount = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage product inventory and stock levels</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Add New Item</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{inventoryItems.length}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Across all categories</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{lowStockCount}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Below threshold levels</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{outOfStockCount}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="lowStock">
            Low Stock
            {lowStockCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-800">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="outOfStock">
            Out of Stock
            {outOfStockCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-800">
                {outOfStockCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.qty.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            item.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                            'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          }>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                      </TableRow>
                    ))}
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lowStock" className="mt-4">
          <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>Items below their threshold levels that need to be replenished</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Same table structure as above, with filtered data */}
              {/* ... */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outOfStock" className="mt-4">
          <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Out of Stock Items</CardTitle>
              <CardDescription>Items that are completely out of stock and require immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Same table structure as above, with filtered data */}
              {/* ... */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
