
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChartCard from '../common/ChartCard';
import { format } from 'date-fns';

// Mock pipeline data
const mockPipelineData = [
  { name: "New", value: 142, conversion: 89, rate: 0.63 },
  { name: "Contacted", value: 89, conversion: 63, rate: 0.71 },
  { name: "Qualified", value: 63, conversion: 42, rate: 0.67 },
  { name: "Proposal", value: 42, conversion: 28, rate: 0.67 },
  { name: "Negotiation", value: 28, conversion: 18, rate: 0.64 },
  { name: "Closed", value: 18, conversion: 0, rate: 0 }
];

// Mock conversion trends data
const mockConversionTrends = [
  { month: "Jan 2025", website: 0.18, email: 0.15, social: 0.12, referral: 0.22 },
  { month: "Feb 2025", website: 0.19, email: 0.16, social: 0.13, referral: 0.21 },
  { month: "Mar 2025", website: 0.21, email: 0.17, social: 0.14, referral: 0.23 },
  { month: "Apr 2025", website: 0.22, email: 0.19, social: 0.15, referral: 0.24 },
  { month: "May 2025", website: 0.23, email: 0.20, social: 0.16, referral: 0.25 },
  { month: "Jun 2025", website: 0.25, email: 0.22, social: 0.18, referral: 0.27 }
];

// Mock ERP integration data
const mockErpIntegrationData = [
  { name: 'Salesforce', connected: true, syncStatus: 'Real-time', lastSync: '5 minutes ago', records: 578 },
  { name: 'SAP', connected: true, syncStatus: 'Hourly', lastSync: '45 minutes ago', records: 423 },
  { name: 'Oracle', connected: true, syncStatus: 'Daily', lastSync: '6 hours ago', records: 842 },
  { name: 'Microsoft Dynamics', connected: false, syncStatus: 'Not connected', lastSync: 'N/A', records: 0 }
];

const RealTimeAnalytics: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [conversionTrends, setConversionTrends] = useState<any[]>([]);
  const [erpIntegrationData, setErpIntegrationData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      try {
        // Set mock data
        setPipelineData(mockPipelineData);
        setConversionTrends(mockConversionTrends);
        setErpIntegrationData(mockErpIntegrationData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-Time Pipeline Analytics</h2>
      
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="pipeline">Pipeline Status</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          <TabsTrigger value="integrations">ERP Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Pipeline Funnel" subtitle="Current lead status distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={pipelineData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} Leads`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Lead Count" fill="#4361ee" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard title="Stage Conversion Rates" subtitle="Percentage moving to next stage">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Rate']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    name="Conversion Rate"
                    stroke="#7209b7" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
        
        <TabsContent value="conversion" className="space-y-4">
          <ChartCard title="Source Conversion Trends" subtitle="Monthly conversion rates by source">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={conversionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Rate']} />
                <Legend />
                <Area type="monotone" dataKey="website" name="Website" fill="#4361ee" stroke="#4361ee" fillOpacity={0.3} />
                <Area type="monotone" dataKey="email" name="Email" fill="#3f37c9" stroke="#3f37c9" fillOpacity={0.3} />
                <Area type="monotone" dataKey="social" name="Social Media" fill="#7209b7" stroke="#7209b7" fillOpacity={0.3} />
                <Line type="monotone" dataKey="referral" name="Referral" stroke="#f72585" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <div className="bg-white/95 dark:bg-gray-800/95 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl p-6 hover:shadow-lg transition-all">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">ERP & Data Source Integrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-gray-800 dark:text-gray-200">System</th>
                    <th className="px-6 py-3 text-gray-800 dark:text-gray-200">Status</th>
                    <th className="px-6 py-3 text-gray-800 dark:text-gray-200">Sync Type</th>
                    <th className="px-6 py-3 text-gray-800 dark:text-gray-200">Last Synced</th>
                    <th className="px-6 py-3 text-gray-800 dark:text-gray-200">Records</th>
                  </tr>
                </thead>
                <tbody>
                  {erpIntegrationData.map((system, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{system.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${system.connected ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                          {system.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{system.syncStatus}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{system.lastSync}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{system.records.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeAnalytics;
