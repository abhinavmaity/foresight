
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Import, FileSpreadsheet, Settings } from 'lucide-react';

interface LeadsHeaderProps {
  onAddLead: () => void;
  onImport: () => void;
  onExport: () => void;
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ onAddLead, onImport, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:text-white">Leads Management</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage and organize your sales leads with follow-ups & notifications</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddLead} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
        <Button variant="outline" onClick={onImport} className="flex items-center gap-1">
          <Import className="h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" onClick={onExport} className="flex items-center gap-1">
          <FileSpreadsheet className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;
