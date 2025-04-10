
import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/navbar/SearchBar';
import NotificationsMenu from '@/components/navbar/NotificationsMenu';
import UserProfileMenu from '@/components/navbar/UserProfileMenu';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotificationContext } from '@/context/NotificationContext';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { unreadCount, error } = useNotificationContext();

  // Initialize theme based on user's preferred color scheme or stored preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({
        description: "Light mode activated",
        duration: 1500,
      });
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({
        description: "Dark mode activated",
        duration: 1500,
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <nav className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="mr-2" />

          <div className="hidden md:block">
            <SearchBar />
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
              const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
            }}>
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="relative hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="relative">
            <NotificationsMenu />
            {!error && unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 px-1.5 h-5 min-w-[1.25rem] flex items-center justify-center transition-all"
                variant="default"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
          
          <UserProfileMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
