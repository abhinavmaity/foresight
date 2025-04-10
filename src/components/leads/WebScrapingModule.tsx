
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WebScrapingForm from './WebScrapingForm';
import { Lead } from '@/types/lead';

interface WebScrapingModuleProps {
  onLeadEnriched?: (lead: Lead) => void;
}

const WebScrapingModule: React.FC<WebScrapingModuleProps> = ({ onLeadEnriched }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Web Crawler</CardTitle>
            <CardDescription>Enter a company website to extract lead information</CardDescription>
          </CardHeader>
          <CardContent>
            <WebScrapingForm onLeadEnriched={onLeadEnriched} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Validation Parameters</CardTitle>
            <CardDescription>Information extracted during web scraping</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Company Name:</span>
                <span className="text-muted-foreground ml-1">Business entity name</span>
              </li>
              <li>
                <span className="font-medium">Industry:</span>
                <span className="text-muted-foreground ml-1">Business sector or category</span>
              </li>
              <li>
                <span className="font-medium">Company Size:</span>
                <span className="text-muted-foreground ml-1">Employee count or organization size</span>
              </li>
              <li>
                <span className="font-medium">Contact Info:</span>
                <span className="text-muted-foreground ml-1">Email addresses or phone numbers</span>
              </li>
              <li>
                <span className="font-medium">Revenue:</span>
                <span className="text-muted-foreground ml-1">Annual revenue or company valuation</span>
              </li>
              <li>
                <span className="font-medium">Products/Services:</span>
                <span className="text-muted-foreground ml-1">Main offerings provided by the company</span>
              </li>
              <li>
                <span className="font-medium">Description:</span>
                <span className="text-muted-foreground ml-1">Company overview or about section</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebScrapingModule;
