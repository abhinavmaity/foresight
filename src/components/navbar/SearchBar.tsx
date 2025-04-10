
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const searchResults = [
    { type: 'Lead', name: 'John Doe', path: '/leads' },
    { type: 'Contact', name: 'Jane Smith', path: '/contacts' },
    { type: 'Inventory', name: 'Premium CRM License', path: '/inventory' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') return;
    
    toast({
      title: "Search completed",
      description: `Found ${searchResults.length} results for "${query}"`,
    });
    
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)} 
        className="hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads, contacts, inventory..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            
            {query.length > 1 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Results</h3>
                <ul className="space-y-1">
                  {searchResults.map((result, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => {
                          navigate(result.path);
                          setIsOpen(false);
                          setQuery('');
                        }}
                      >
                        <span className="font-medium">{result.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">({result.type})</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
