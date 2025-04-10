
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Mail,
  Archive,
  Phone,
  Goal,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  active = false,
  onClick,
  collapsed = false
}) => {
  return (
    <li className="px-2">
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          active 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </button>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const getCurrentPath = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };
  
  const [activeItem, setActiveItem] = React.useState(getCurrentPath());
  
  // Update active item when location changes
  React.useEffect(() => {
    setActiveItem(getCurrentPath());
  }, [location]);

  // Get initial collapsed state from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Update localStorage when collapsed state changes
  React.useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-3 border-b border-sidebar-border justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center">
            <Goal className="mr-2 h-6 w-6" />
            ForeSight
          </h1>
        )}
        {collapsed && (
          <Goal className="h-6 w-6 mx-auto text-sidebar-foreground" />
        )}
        <button
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 p-1 rounded-full hidden md:block"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <div className="py-4">
        <nav className="space-y-2 px-2">
          <ul className="space-y-1">
            <SidebarItem 
              icon={<Home className="h-5 w-5" />} 
              label="Dashboard" 
              active={activeItem === 'Dashboard'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Dashboard');
                navigate('/');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<Users className="h-5 w-5" />} 
              label="Leads" 
              active={activeItem === 'Leads'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Leads');
                navigate('/leads');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<Mail className="h-5 w-5" />} 
              label="Follow-ups" 
              active={activeItem === 'Followups'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Followups');
                navigate('/followups');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<Phone className="h-5 w-5" />} 
              label="Contacts" 
              active={activeItem === 'Contacts'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Contacts');
                navigate('/contacts');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<Archive className="h-5 w-5" />} 
              label="Inventory" 
              active={activeItem === 'Inventory'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Inventory');
                navigate('/inventory');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<Calendar className="h-5 w-5" />} 
              label="Calendar" 
              active={activeItem === 'Calendar'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Calendar');
                navigate('/calendar');
                if (isMobile) setMobileOpen(false);
              }}
            />
            <SidebarItem 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Reports" 
              active={activeItem === 'Reports'}
              collapsed={collapsed}
              onClick={() => {
                setActiveItem('Reports');
                navigate('/reports');
                if (isMobile) setMobileOpen(false);
              }}
            />
          </ul>
          
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <ul className="space-y-1">
              <SidebarItem 
                icon={<Settings className="h-5 w-5" />} 
                label="Settings" 
                active={activeItem === 'Settings'}
                collapsed={collapsed}
                onClick={() => {
                  setActiveItem('Settings');
                  navigate('/settings');
                  if (isMobile) setMobileOpen(false);
                }}
              />
              <SidebarItem 
                icon={<LogOut className="h-5 w-5" />} 
                label="Logout" 
                active={activeItem === 'Logout'}
                collapsed={collapsed}
                onClick={handleLogout}
              />
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
  
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-3 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <div className={cn(
      "hidden md:block h-screen bg-sidebar fixed left-0 top-0 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
