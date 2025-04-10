
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { FirecrawlService } from '@/services/firecrawlService';

interface ScrapedBusinessDataProps {
  businessData: ReturnType<typeof FirecrawlService.extractBusinessDataFromCrawl>;
  url: string;
  onCreateLead: () => void;
}

const ScrapedBusinessData: React.FC<ScrapedBusinessDataProps> = ({ 
  businessData, 
  url, 
  onCreateLead 
}) => {
  return (
    <Card className="bg-white/95 dark:bg-gray-800/95">
      <CardHeader>
        <CardTitle>Scraped Business Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Company Name</Label>
            <p className="font-medium">{businessData.companyName || "Unknown"}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Industry</Label>
            <p className="font-medium">{businessData.industry || "Unknown"}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Company Size</Label>
            <p className="font-medium">{businessData.companySize || "Unknown"}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Contact</Label>
            <p className="font-medium">{businessData.contactInfo || "Unknown"}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Revenue</Label>
            <p className="font-medium">{businessData.revenue || "Unknown"}</p>
          </div>
        </div>
        {businessData.description && (
          <div>
            <Label className="text-sm text-muted-foreground">Description</Label>
            <p className="text-sm mt-1">{businessData.description}</p>
          </div>
        )}
        {businessData.products && businessData.products.length > 0 && (
          <div>
            <Label className="text-sm text-muted-foreground">Products/Services</Label>
            <ul className="list-disc list-inside text-sm mt-1">
              {businessData.products.slice(0, 5).map((product, idx) => (
                <li key={idx}>{product}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCreateLead}
          className="w-full"
        >
          Create Lead from This Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScrapedBusinessData;
