
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from '@/pages/Dashboard';
import Leads from '@/pages/Leads';
import Contacts from '@/pages/Contacts';
import Calendar from '@/pages/Calendar';
import Reports from '@/pages/Reports';
import Followups from '@/pages/Followups';
import Settings from '@/pages/Settings';
import Inventory from '@/pages/Inventory';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <NotificationProvider>
            <SidebarProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/leads" element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  } />
                  <Route path="/contacts" element={
                    <ProtectedRoute>
                      <Contacts />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="/followups" element={
                    <ProtectedRoute>
                      <Followups />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/inventory" element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </Router>
            </SidebarProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
