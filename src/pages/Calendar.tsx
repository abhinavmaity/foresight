import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockLeads } from '@/data/mockData';
import { format, addDays, startOfWeek, endOfWeek, startOfDay, addMonths } from 'date-fns';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import AddEventDialog from '@/components/calendar/AddEventDialog';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  Mail,
  Archive,
  Phone,
  Goal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const generateEvents = () => {
  const events = [];
  
  mockLeads.forEach(lead => {
    if (lead.nextFollowUp) {
      events.push({
        id: `followup-${lead.id}`,
        title: `Follow-up: ${lead.firstName} ${lead.lastName}`,
        date: new Date(lead.nextFollowUp),
        type: 'follow-up',
        details: `Contact ${lead.firstName} about ${lead.company} proposal`
      });
    }
    
    if (Math.random() > 0.7) {
      const randomDaysAhead = Math.floor(Math.random() * 14) + 1;
      events.push({
        id: `meeting-${lead.id}`,
        title: `Meeting with ${lead.firstName} ${lead.lastName}`,
        date: addDays(new Date(), randomDaysAhead),
        type: 'meeting',
        details: `Discuss ${lead.company} requirements and next steps`
      });
    }
    
    if (Math.random() > 0.8) {
      const randomDaysAhead = Math.floor(Math.random() * 10) + 1;
      events.push({
        id: `call-${lead.id}`,
        title: `Call with ${lead.firstName} ${lead.lastName}`,
        date: addDays(new Date(), randomDaysAhead),
        type: 'call',
        details: `Introductory call with ${lead.company}`
      });
    }
  });
  
  return events;
};

const EventCard = ({ event }: { event: ReturnType<typeof generateEvents>[0] }) => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'follow-up':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'call':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  return (
    <Card className="mb-2 border-l-4 overflow-hidden" style={{ 
      borderLeftColor: 
        event.type === 'follow-up' ? '#3b82f6' : 
        event.type === 'meeting' ? '#8b5cf6' : 
        '#10b981'
    }}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm">{event.title}</h4>
            <p className="text-xs text-muted-foreground">{format(new Date(event.date), 'h:mm a')}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${getEventColor(event.type)}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <p className="text-xs mt-1 text-muted-foreground">{event.details}</p>
      </CardContent>
    </Card>
  );
};

const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<ReturnType<typeof generateEvents>>(generateEvents());
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const getEventsForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });
  };
  
  const eventsForSelectedDay = getEventsForDate(date);
  
  const handleAddEvent = (newEvent: any) => {
    setEvents(prev => [...prev, newEvent]);
  };
  
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
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1A1F2C] dark:to-[#222731]">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center px-2">
            <Goal className="h-6 w-6 text-sidebar-foreground" />
            <span className="ml-2 text-xl font-bold text-sidebar-foreground">ForeSight</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Dashboard" 
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Leads"
                    onClick={() => navigate('/leads')}
                  >
                    <Users className="h-5 w-5" />
                    <span>Leads</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Follow-ups"
                    onClick={() => navigate('/followups')}
                  >
                    <Mail className="h-5 w-5" />
                    <span>Follow-ups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Contacts"
                    onClick={() => navigate('/contacts')}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Contacts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Inventory"
                    onClick={() => navigate('/inventory')}
                  >
                    <Archive className="h-5 w-5" />
                    <span>Inventory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Calendar"
                    isActive={true}
                    onClick={() => navigate('/calendar')}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Reports"
                    onClick={() => navigate('/reports')}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Settings"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    tooltip="Logout"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">Calendar</h1>
              <p className="text-muted-foreground dark:text-gray-400">Schedule and manage your appointments</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="week" value={view} onValueChange={(val) => setView(val as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
              <AddEventDialog
                trigger={
                  <Button className="flex items-center gap-1">
                    <CalendarPlus className="h-4 w-4" />
                    New Event
                  </Button>
                }
                onAddEvent={handleAddEvent}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {view === 'day' ? format(date, 'MMMM d, yyyy') :
                       view === 'week' ? `${format(startOfWeek(date), 'MMM d')} - ${format(endOfWeek(date), 'MMM d, yyyy')}` :
                       format(date, 'MMMM yyyy')}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={() => {
                        if (view === 'day') setDate(prev => addDays(prev, -1));
                        else if (view === 'week') setDate(prev => addDays(prev, -7));
                        else setDate(prev => addMonths(prev, -1));
                      }}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDate(new Date())}>
                        Today
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => {
                        if (view === 'day') setDate(prev => addDays(prev, 1));
                        else if (view === 'week') setDate(prev => addDays(prev, 7));
                        else setDate(prev => addMonths(prev, 1));
                      }}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Events for {format(date, 'MMMM d, yyyy')}</CardTitle>
                  <CardDescription>
                    {eventsForSelectedDay.length} {eventsForSelectedDay.length === 1 ? 'event' : 'events'} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDay.length > 0 ? (
                    eventsForSelectedDay.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">No events scheduled for this day</p>
                  )}
                </CardContent>
                <CardFooter>
                  <AddEventDialog
                    trigger={
                      <Button variant="outline" className="w-full">
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    }
                    onAddEvent={handleAddEvent}
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
