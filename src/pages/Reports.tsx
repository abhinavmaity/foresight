import React from "react";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Mail,
  Archive,
  Phone,
  Goal,
} from "lucide-react";

// Sample data
const leadsByMonthData = [
  { name: "Jan", leads: 65, qualified: 28 },
  { name: "Feb", leads: 59, qualified: 35 },
  { name: "Mar", leads: 80, qualified: 40 },
  { name: "Apr", leads: 81, qualified: 45 },
  { name: "May", leads: 56, qualified: 30 },
  { name: "Jun", leads: 55, qualified: 29 },
  { name: "Jul", leads: 40, qualified: 18 },
];

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
  { name: "Jul", sales: 3490 },
];

const conversionRateData = [
  { name: "Jan", rate: 0.32 },
  { name: "Feb", rate: 0.27 },
  { name: "Mar", rate: 0.43 },
  { name: "Apr", rate: 0.39 },
  { name: "May", rate: 0.52 },
  { name: "Jun", rate: 0.48 },
  { name: "Jul", rate: 0.61 },
];

const sourcesData = [
  { name: "Website", value: 35 },
  { name: "Referral", value: 25 },
  { name: "Social", value: 18 },
  { name: "Email", value: 15 },
  { name: "Other", value: 7 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

const Reports = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

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
                    isActive={true}
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
        <main className="container mx-auto py-6 px-4 md:px-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground dark:text-gray-400">
                Track your sales and marketing performance
              </p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Leads Overview</CardTitle>
                    <CardDescription>
                      Monthly lead acquisition and qualification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leadsByMonthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="leads"
                            fill="#8884d8"
                            name="Total Leads"
                          />
                          <Bar
                            dataKey="qualified"
                            fill="#82ca9d"
                            name="Qualified"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                    <CardDescription>
                      Lead distribution by source
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourcesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {sourcesData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Monthly sales revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>
                      Monthly lead to customer conversion rate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={conversionRateData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis
                            tickFormatter={(value: number) =>
                              `${(value * 100).toFixed(0)}%`
                            }
                          />
                          <Tooltip
                            formatter={(value: number) =>
                              `${(value * 100).toFixed(2)}%`
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#82ca9d"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leads">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Leads Acquisition</CardTitle>
                  <CardDescription>
                    Detailed lead statistics and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadsByMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="leads"
                          fill="#8884d8"
                          name="Total Leads"
                        />
                        <Bar
                          dataKey="qualified"
                          fill="#82ca9d"
                          name="Qualified"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>
                    Detailed sales metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conversion">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Conversion Metrics</CardTitle>
                  <CardDescription>
                    Lead to customer conversion performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conversionRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          tickFormatter={(value: number) =>
                            `${(value * 100).toFixed(0)}%`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
