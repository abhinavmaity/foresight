
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import Papa from 'papaparse';

interface ImportLeadsDialogProps {
  trigger: React.ReactNode;
}

const ImportLeadsDialog: React.FC<ImportLeadsDialogProps> = ({ trigger }) => {
  const { toast } = useToast();
  const { createLead } = useLeads();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'validating' | 'importing' | 'success' | 'error'>('idle');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && 
          selectedFile.type !== 'application/vnd.ms-excel' && 
          !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setStatus('validating');
      
      // Preview CSV data
      Papa.parse(selectedFile, {
        header: true,
        preview: 3, // Just show first 3 rows for preview
        complete: function(results) {
          setPreviewData(results.data as any[]);
          setStatus('idle');
        },
        error: function() {
          toast({
            title: "Error parsing file",
            description: "The CSV file format is invalid.",
            variant: "destructive",
          });
          setStatus('error');
        }
      });
    }
  };

  const handleImport = () => {
    if (!file) return;
    
    setImporting(true);
    setStatus('importing');
    setProgress(0);
    
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        const data = results.data as any[];
        const totalRecords = data.length;
        let imported = 0;
        let errors = 0;
        
        // Process each record with a small delay to show progress
        const processRecord = (index: number) => {
          if (index >= totalRecords) {
            // All records processed
            setImporting(false);
            setStatus('success');
            toast({
              title: "Import complete",
              description: `Successfully imported ${imported} leads. ${errors} records had errors.`,
              variant: errors > 0 ? "destructive" : "default",
            });
            setTimeout(() => setOpen(false), 1500);
            return;
          }
          
          const record = data[index];
          
          // Map CSV fields to lead fields
          const lead = {
            firstName: record.firstName || record.first_name || '',
            lastName: record.lastName || record.last_name || '',
            email: record.email || '',
            phone: record.phone || '',
            company: record.company || '',
            position: record.position || record.title || '',
            priority: (record.priority || 'medium').toLowerCase(),
            status: (record.status || 'new').toLowerCase(),
            source: (record.source || 'import').toLowerCase(),
            value: record.value || undefined,
          };
          
          // Validate required fields
          if (lead.firstName && lead.lastName && lead.email && lead.company) {
            try {
              createLead(lead);
              imported++;
            } catch (error) {
              console.error("Error importing lead:", error);
              errors++;
            }
          } else {
            errors++;
          }
          
          const newProgress = Math.round(((index + 1) / totalRecords) * 100);
          setProgress(newProgress);
          
          // Process next record
          setTimeout(() => processRecord(index + 1), 100);
        };
        
        // Start processing
        processRecord(0);
      },
      error: function() {
        setStatus('error');
        setImporting(false);
        toast({
          title: "Import failed",
          description: "There was an error processing your file.",
          variant: "destructive",
        });
      }
    });
  };

  const resetImport = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setPreviewData([]);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!importing) {
        setOpen(newOpen);
        if (!newOpen) resetImport();
      }
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
          <DialogDescription>
            Upload a CSV file with lead information to bulk import.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {status !== 'importing' && status !== 'success' && (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file"
              />
              <label htmlFor="csv-file" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">
                  {file ? file.name : 'Click to upload CSV'}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Accepted format: .csv
                </span>
              </label>
            </div>
          )}
          
          {file && previewData.length > 0 && status !== 'importing' && status !== 'success' && (
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium">Preview:</h4>
              <div className="text-xs overflow-auto max-h-[200px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      {Object.keys(previewData[0]).map((header) => (
                        <th key={header} className="border px-2 py-1 text-left">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((cell, cellIdx) => (
                          <td key={cellIdx} className="border px-2 py-1">{String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic">Showing first {previewData.length} rows</p>
            </div>
          )}
          
          {status === 'importing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Importing leads...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-semibold">Import Complete!</h3>
              <p className="text-muted-foreground">Your leads have been imported successfully.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>There was an error processing your file.</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {status !== 'importing' && status !== 'success' && (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={handleImport}
                disabled={!file || previewData.length === 0}
              >
                Import Leads
              </Button>
            </>
          )}
          {status === 'success' && (
            <Button onClick={() => setOpen(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportLeadsDialog;
