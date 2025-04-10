import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CreateFollowUpDialog from "@/components/followups/CreateFollowUpDialog";
import FollowUpScheduler, {
  FollowUpSchedulerProps,
} from "@/components/followups/FollowUpScheduler";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Mail,
  Archive,
  Phone,
  Goal,
} from "lucide-react";

const Followups = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1A1F2C] dark:to-[#222731]">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center px-2">
            <Goal className="h-6 w-6 text-sidebar-foreground" />
            <span className="ml-2 text-xl font-bold text-sidebar-foreground">
              ForeSight
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Dashboard"
                    onClick={() => navigate("/")}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Leads"
                    onClick={() => navigate("/leads")}
                  >
                    <Users className="h-5 w-5" />
                    <span>Leads</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Follow-ups"
                    isActive={true}
                    onClick={() => navigate("/followups")}
                  >
                    <Mail className="h-5 w-5" />
                    <span>Follow-ups</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Contacts"
                    onClick={() => navigate("/contacts")}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Contacts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Inventory"
                    onClick={() => navigate("/inventory")}
                  >
                    <Archive className="h-5 w-5" />
                    <span>Inventory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Calendar"
                    onClick={() => navigate("/calendar")}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Reports"
                    onClick={() => navigate("/reports")}
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
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
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
        <main className="container py-6 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">
                Follow-ups
              </h1>
              <p className="text-muted-foreground dark:text-gray-400">
                Manage and schedule follow-ups with your leads
              </p>
            </div>
            <div className="flex gap-2">
              <CreateFollowUpDialog
                trigger={
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Follow-up
                  </Button>
                }
              />
              <div className="flex bg-muted rounded-md p-0.5 border">
                <Button
                  variant={view === "calendar" ? "default" : "ghost"}
                  className="px-3 rounded-sm"
                  onClick={() => setView("calendar")}
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  className="px-3 rounded-sm"
                  onClick={() => setView("list")}
                  size="sm"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <FollowUpScheduler view={view} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Followups;
