
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import WebScrapingModule from './WebScrapingModule';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/types/lead';

interface DataEnrichmentCardProps {
  onLeadEnriched: (lead: Lead) => void;
}

const DataEnrichmentCard: React.FC<DataEnrichmentCardProps> = ({ onLeadEnriched }) => {
  return (
    <div className="mt-6">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Data Enrichment</CardTitle>
          <CardDescription>Enhance lead data with web scraping technology</CardDescription>
        </CardHeader>
        <CardContent>
          <WebScrapingModule onLeadEnriched={onLeadEnriched} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataEnrichmentCard;
