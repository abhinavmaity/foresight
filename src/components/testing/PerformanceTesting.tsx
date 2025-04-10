
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Gauge, ArrowUpRight, Database, Clock, Cpu, Users } from 'lucide-react';

// Mock performance test data
const performanceData = [
  { name: '10k', queryTime: 125, cpuUsage: 15, memoryUsage: 8 },
  { name: '20k', queryTime: 175, cpuUsage: 25, memoryUsage: 12 },
  { name: '50k', queryTime: 320, cpuUsage: 45, memoryUsage: 28 },
  { name: '100k', queryTime: 550, cpuUsage: 75, memoryUsage: 42 },
];

const betaTestUsers = [
  { name: 'Alpha Corp', status: 'active', rating: 4.5, feedback: 'Excellent performance with our 50k customer database', date: '2023-10-10' },
  { name: 'Beta Industries', status: 'active', rating: 4.2, feedback: 'Good UI, some minor issues with large imports', date: '2023-10-08' },
  { name: 'Gamma Solutions', status: 'inactive', rating: 3.8, feedback: 'Need better data visualization options', date: '2023-09-25' },
  { name: 'Delta Tech', status: 'active', rating: 4.7, feedback: 'Very satisfied with the performance improvements', date: '2023-10-12' },
];

const aiModelMetrics = [
  { name: 'Accuracy', beforeTuning: 0.82, afterTuning: 0.94 },
  { name: 'Precision', beforeTuning: 0.78, afterTuning: 0.92 },
  { name: 'Recall', beforeTuning: 0.75, afterTuning: 0.89 },
  { name: 'F1 Score', beforeTuning: 0.76, afterTuning: 0.91 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PerformanceTesting: React.FC = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  
  const runPerformanceTest = (testType: string) => {
    setIsTestRunning(true);
    setTestProgress(0);
    setActiveTest(testType);
    
    // Simulate a test running with progress updates
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTestRunning(false);
            setActiveTest(null);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Testing & Refinement</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Beta testing results and system performance metrics</p>
      </div>
      
      <Tabs defaultValue="scalability">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="scalability">Scalability Testing</TabsTrigger>
          <TabsTrigger value="beta">Beta Testing</TabsTrigger>
          <TabsTrigger value="ai">AI Model Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scalability" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Data Scale Testing
                </CardTitle>
                <CardDescription>Test system performance with large data volumes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => runPerformanceTest('database')}
                    disabled={isTestRunning}
                    className="w-full"
                  >
                    Run Database Scale Test
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => runPerformanceTest('import')}
                    disabled={isTestRunning}
                    className="w-full"
                  >
                    Run Import Performance Test
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => runPerformanceTest('query')}
                    disabled={isTestRunning}
                    className="w-full"
                  >
                    Run Query Performance Test
                  </Button>
                </div>
                
                {isTestRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Running {activeTest} test...
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round(testProgress)}%
                      </span>
                    </div>
                    <Progress value={testProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Query Response Time
                </CardTitle>
                <CardDescription>Response time vs data volume (lower is better)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Records', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} ms`, 'Response Time']} />
                    <Line type="monotone" dataKey="queryTime" stroke="#4361ee" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-amber-500" />
                  Resource Utilization
                </CardTitle>
                <CardDescription>CPU & memory usage at different data volumes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cpuUsage" name="CPU Usage" fill="#7209b7" />
                    <Bar dataKey="memoryUsage" name="Memory Usage" fill="#4cc9f0" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-green-500" />
                  System Performance Score
                </CardTitle>
                <CardDescription>Overall system performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="w-full max-w-md grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">97<span className="text-lg">%</span></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">API Response</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">94<span className="text-lg">%</span></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">UI Performance</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">89<span className="text-lg">%</span></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Data Processing</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">99<span className="text-lg">%</span></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="beta" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Beta Testing Participants
                </CardTitle>
                <CardDescription>Enterprise clients in the beta program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{betaTestUsers.length}</div>
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>3 Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {betaTestUsers.map((user, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Since {user.date}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Beta Tester Feedback</CardTitle>
                <CardDescription>Recent feedback from enterprise beta testers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {betaTestUsers.map((user, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(user.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{user.rating.toFixed(1)}/5.0</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{user.feedback}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">AI Model Performance</CardTitle>
                <CardDescription>Before vs after tuning metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={aiModelMetrics}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`]} />
                    <Legend />
                    <Bar dataKey="beforeTuning" name="Before Tuning" fill="#8884d8" />
                    <Bar dataKey="afterTuning" name="After Tuning" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 dark:bg-gray-800/95 border-gray-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">AI Model Improvements</CardTitle>
                <CardDescription>Performance metrics after optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Lead Scoring', value: 40 },
                            { name: 'Sentiment Analysis', value: 25 },
                            { name: 'Email Reply Suggestions', value: 20 },
                            { name: 'Data Classification', value: 15 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {aiModelMetrics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Improvement']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex-1 space-y-4 pt-4 md:pt-0">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key AI Improvements</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5"></div>
                          <span className="text-gray-700 dark:text-gray-300">40% faster lead scoring accuracy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-green-500 mt-0.5"></div>
                          <span className="text-gray-700 dark:text-gray-300">25% better sentiment analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-amber-500 mt-0.5"></div>
                          <span className="text-gray-700 dark:text-gray-300">20% improved email reply suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-rose-500 mt-0.5"></div>
                          <span className="text-gray-700 dark:text-gray-300">15% better data classification</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceTesting;
