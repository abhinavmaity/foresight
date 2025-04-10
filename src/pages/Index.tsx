
import React, { useEffect } from 'react';
import Dashboard from './Dashboard';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Simply redirect to Dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
