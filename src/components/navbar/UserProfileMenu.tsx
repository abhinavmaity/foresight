
import React from 'react';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfileMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const goToProfile = () => {
    toast({
      title: "Profile",
      description: "Profile feature coming soon",
    });
  };

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 border-primary/30 text-primary hover:from-primary/30 hover:to-secondary/30 hover:border-primary/40 hover:text-primary shadow-sm transition-all"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-transparent">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToProfile}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
