
import React, { useState } from 'react';
import LeadStats from './LeadStats';
import RecentActivity from './RecentActivity';
import ChartCard from '../common/ChartCard';
import RealTimeAnalytics from './RealTimeAnalytics';
import InventoryManagement from '../inventory/InventoryManagement';
import WebScrapingModule from '../leads/WebScrapingModule';
import PerformanceTesting from '../testing/PerformanceTesting';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { monthlyLeads, conversionRates, leadsBySource } from '@/data/mockData';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LayoutDashboard, Package, LineChartIcon, Globe, Activity } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { useActivities } from '@/hooks/useActivities';

const COLORS = ['#4361ee', '#3f37c9', '#7209b7', '#f72585', '#4cc9f0'];

const DashboardOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { leadStats, isLoadingStats } = useLeads();
  const { activities, isLoading: isLoadingActivities } = useActivities();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <LineChartIcon className="h-4 w-4" />
            <span>Real-Time Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="scraper" className="flex items-center gap-1.5">
            <Globe className="h-4 w-4" />
            <span>Web Scraping</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-1.5">
            <Activity className="h-4 w-4" />
            <span>Testing & Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <LeadStats stats={leadStats || {
            total: 0,
            high: 0,
            medium: 0,
            low: 0,
            new: 0,
            contacted: 0,
            qualified: 0,
            proposal: 0,
            conversion: 0
          }} isLoading={isLoadingStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard 
              title="Monthly Lead Generation" 
              subtitle="Total new leads per month"
              action={<Button variant="ghost" size="sm">View Details</Button>}
            >
              <ChartContainer
                config={{
                  leads: {
                    label: "Leads",
                    theme: {
                      light: "#4361ee",
                      dark: "#4361ee"
                    }
                  }
                }}
              >
                <BarChart data={monthlyLeads}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [value, 'Leads']}
                      />
                    }
                  />
                  <Bar dataKey="leads" name="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </ChartCard>
            
            <ChartCard 
              title="Conversion Rate Trends" 
              subtitle="Monthly conversion percentage"
            >
              <ChartContainer
                config={{
                  rate: {
                    label: "Conversion Rate",
                    theme: {
                      light: "#7209b7",
                      dark: "#9d4edd"
                    }
                  }
                }}
              >
                <LineChart data={conversionRates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Rate']}
                      />
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="rate"
                    stroke="var(--color-rate)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </ChartCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Leads by Source">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Leads']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <div className="lg:col-span-2">
              {isLoadingActivities ? (
                <div className="bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl p-6 h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <RecentActivity activities={activities.map(activity => ({
                  id: activity.id,
                  leadId: activity.leadId,
                  leadName: activity.leadName || 'Unknown Lead',
                  action: activity.action,
                  date: activity.date,
                  description: activity.description || '',
                }))} />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <RealTimeAnalytics />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>
        
        <TabsContent value="scraper">
          <WebScrapingModule />
        </TabsContent>
        
        <TabsContent value="testing">
          <PerformanceTesting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
