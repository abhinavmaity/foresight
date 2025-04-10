
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/services/firecrawlService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from '@/types/lead';
import { useLeads } from '@/hooks/useLeads';
import { Loader2, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import ApiKeyForm from './ApiKeyForm';
import ScrapedBusinessData from './ScrapedBusinessData';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

interface WebScrapingFormProps {
  onLeadEnriched?: (lead: Lead) => void;
}

const WebScrapingForm: React.FC<WebScrapingFormProps> = ({ onLeadEnriched }) => {
  const { toast } = useToast();
  const { createLead } = useLeads();
  const [url, setUrl] = useState('');
  const [isSettingApiKey, setIsSettingApiKey] = useState(!FirecrawlService.getApiKey());
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [businessData, setBusinessData] = useState<ReturnType<typeof FirecrawlService.extractBusinessDataFromCrawl> | null>(null);
  
  const handleApiKeySaved = () => {
    setIsSettingApiKey(false);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to scrape",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    setBusinessData(null);
    
    try {
      const result = await FirecrawlService.crawlWebsite(url);
      setProgress(60);
      
      if (result.success) {
        // Extract business data from crawl result
        const extractedData = FirecrawlService.extractBusinessDataFromCrawl(result.data);
        setBusinessData(extractedData);
        setProgress(100);
        
        toast({
          title: "Success",
          description: "Website crawled successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to crawl website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      toast({
        title: "Error",
        description: "Failed to crawl website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateLead = () => {
    if (!businessData) return;
    
    // Create a lead from the business data
    const newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: "Web",
      lastName: "Scraping",
      email: businessData.contactInfo?.includes('@') 
        ? businessData.contactInfo 
        : `contact@${url.replace(/^https?:\/\/(?:www\.)?([^\/]+).*$/, '$1')}`,
      company: businessData.companyName || url.replace(/^https?:\/\/(?:www\.)?([^\/]+).*$/, '$1'),
      position: "Unknown",
      phone: businessData.contactInfo?.includes('@') ? undefined : businessData.contactInfo,
      priority: "medium",
      status: "new",
      source: "web-scraping",
      notes: `Scraped from ${url}\n\nDescription: ${businessData.description}`,
      industry: businessData.industry || undefined,
      companySize: businessData.companySize || undefined,
      revenue: businessData.revenue 
        ? Number(businessData.revenue.replace(/[^0-9.]/g, '')) 
        : undefined
    };
    
    createLead(newLead);
    
    toast({
      title: "Lead Created",
      description: `Created lead for ${newLead.company}`,
    });
    
    // Reset form
    setUrl('');
    setBusinessData(null);
    onLeadEnriched?.(newLead as Lead);
  };
  
  if (isSettingApiKey) {
    return <ApiKeyForm onApiKeySaved={handleApiKeySaved} />;
  }
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">Website URL</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !url}
              className="flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Scrape Site
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isLoading && <Progress value={progress} className="w-full" />}
      </form>

      {businessData && (
        <ScrapedBusinessData businessData={businessData} url={url} onCreateLead={handleCreateLead} />
      )}
      
      <div className="text-right">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsSettingApiKey(true)}
        >
          Change API Key
        </Button>
      </div>
    </div>
  );
};

export default WebScrapingForm;
