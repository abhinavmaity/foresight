
import { useState, useEffect } from 'react';

export const useSidebarState = () => {
  const [collapsed, setCollapsed] = useState(() => {
    // Get initial state from localStorage if available
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return {
    collapsed,
    toggleSidebar
  };
};

export default useSidebarState;
