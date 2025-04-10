
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FirecrawlService } from '@/services/firecrawlService';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ApiKeyFormProps {
  onApiKeySaved: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySaved }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Firecrawl API key",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        onApiKeySaved();
      } else {
        toast({
          title: "Invalid API Key",
          description: "The API key appears to be invalid",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Setup Firecrawl API Key</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Firecrawl API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Firecrawl API key"
              className="w-full mt-1"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>To use the web scraping feature, you need a Firecrawl API key.</p>
            <p>Get one at <a href="https://firecrawl.dev" className="text-primary hover:underline" target="_blank" rel="noreferrer">firecrawl.dev</a></p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveApiKey} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Validating...
            </>
          ) : (
            'Save API Key'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyForm;
