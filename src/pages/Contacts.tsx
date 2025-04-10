
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockLeads } from '@/data/mockData';
import { Search, UserPlus, Mail, Phone, Star, StarOff, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import AddContactDialog from '@/components/contacts/AddContactDialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import useSidebarState from '@/hooks/useSidebarState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Create fake contacts from the leads data
const generateContacts = () => {
  return mockLeads.map(lead => ({
    id: lead.id,
    name: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone || '+1 (555) 123-4567',
    company: lead.company,
    position: lead.position || 'Unknown',
    isFavorite: Math.random() > 0.7, // Randomly mark some as favorites
    lastContacted: lead.lastContactedAt || null,
    avatar: null // No avatars in the mock data
  }));
};

type SortField = 'name' | 'company' | 'position';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'company' | 'position';

const Contacts: React.FC = () => {
  const { toast } = useToast();
  const [initialContacts] = useState(generateContacts());
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState('');
  const { collapsed } = useSidebarState();
  
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if clicking on the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending order for a new sort field
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, isFavorite: !contact.isFavorite } : contact
    ));
    
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      toast({
        title: contact.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${contact.name} has been ${contact.isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };
  
  // Handle adding a new contact
  const handleAddContact = (newContact: any) => {
    setContacts(prev => [newContact, ...prev]);
  };
  
  // Generate filter options based on unique values
  const companyOptions = [...new Set(initialContacts.map(c => c.company))].sort();
  const positionOptions = [...new Set(initialContacts.filter(c => c.position).map(c => c.position))].sort();
  
  // Apply filtering, sorting, and tab selection
  useEffect(() => {
    let result = [...initialContacts];
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(lowerSearchTerm) ||
        contact.email.toLowerCase().includes(lowerSearchTerm) ||
        contact.company.toLowerCase().includes(lowerSearchTerm) ||
        (contact.position && contact.position.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply filter type
    if (filterType !== 'all' && filterValue) {
      result = result.filter(contact => {
        if (filterType === 'company') return contact.company === filterValue;
        if (filterType === 'position') return contact.position === filterValue;
        return true;
      });
    }
    
    // Sort contacts
    result = result.sort((a, b) => {
      // Handle null/undefined values
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      
      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
    
    // Filter by tab (favorites or all)
    if (activeTab === 'favorites') {
      result = result.filter(contact => contact.isFavorite);
    }
    
    setContacts(result);
  }, [searchTerm, sortField, sortOrder, activeTab, filterType, filterValue, initialContacts]);
  
  // Get counts
  const favoriteCount = contacts.filter(c => c.isFavorite).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1A1F2C] dark:to-[#222731]">
      <Sidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-64'} w-full`}>
        <Navbar />
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">Contacts</h1>
              <p className="text-muted-foreground dark:text-gray-400">Manage your network and keep in touch</p>
            </div>
            <AddContactDialog 
              trigger={
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add Contact
                </Button>
              }
              onAddContact={handleAddContact}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-10 bg-white dark:bg-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    {filterType !== 'all' ? (
                      <Badge variant="secondary" className="ml-2">
                        {filterType}: {filterValue}
                      </Badge>
                    ) : (
                      <span>Filter</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter Contacts</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-gray-500">Company</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onSelect={() => {
                        setFilterType('all');
                        setFilterValue('');
                      }}
                    >
                      All Companies
                    </DropdownMenuItem>
                    {companyOptions.map(company => (
                      <DropdownMenuItem 
                        key={company}
                        onSelect={() => {
                          setFilterType('company');
                          setFilterValue(company);
                        }}
                      >
                        {company}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-gray-500">Position</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onSelect={() => {
                        setFilterType('all');
                        setFilterValue('');
                      }}
                    >
                      All Positions
                    </DropdownMenuItem>
                    {positionOptions.map(position => position && (
                      <DropdownMenuItem 
                        key={position}
                        onSelect={() => {
                          setFilterType('position');
                          setFilterValue(position);
                        }}
                      >
                        {position}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onSelect={() => {
                      setFilterType('all');
                      setFilterValue('');
                    }}
                    className="text-primary"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Contacts ({initialContacts.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favoriteCount})</TabsTrigger>
            </TabsList>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {sortField === 'name' && (
                            sortOrder === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('company')}
                      >
                        <div className="flex items-center gap-1">
                          Company
                          {sortField === 'company' && (
                            sortOrder === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1">
                          Position
                          {sortField === 'position' && (
                            sortOrder === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.length > 0 ? (
                      contacts.map(contact => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{contact.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>{contact.company}</TableCell>
                          <TableCell>{contact.position}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => toggleFavorite(contact.id)}
                              >
                                {contact.isFavorite ? (
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No contacts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Contacts;
