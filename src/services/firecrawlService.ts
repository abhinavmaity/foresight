
import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      // A simple test crawl to verify the API key
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static extractBusinessDataFromCrawl(crawlData: any): {
    companyName?: string;
    industry?: string;
    companySize?: string;
    contactInfo?: string;
    revenue?: string;
    products?: string[];
    description?: string;
  } {
    const results = {
      companyName: '',
      industry: '',
      companySize: '',
      contactInfo: '',
      revenue: '',
      products: [] as string[],
      description: ''
    };
    
    try {
      if (!crawlData || !crawlData.data || !Array.isArray(crawlData.data)) {
        return results;
      }
      
      const pageData = crawlData.data.map(page => page.content?.markdown || '').join(' ');
      
      // Extract company name - look for "About" sections or title tags
      const companyNameMatch = pageData.match(/(?:company|business|organization)(?:\s+name)?[:\s]+([A-Z][A-Za-z0-9\s,\.]{2,50}(?=\s|$|\.))/i)
        || pageData.match(/(?:^|\s)([A-Z][A-Za-z0-9]{1,20}(?:\s+[A-Z][A-Za-z0-9]{1,20}){0,3})(?:\s+is\s+a\s+(?:company|business|provider))/i);
      
      if (companyNameMatch) {
        results.companyName = companyNameMatch[1].trim();
      }
      
      // Extract industry
      const industryMatch = pageData.match(/(?:industry|sector)[:\s]+([A-Za-z0-9\s,\.]{2,50}(?=\s|$|\.))/i)
        || pageData.match(/(?:specialize|specialized|operating)(?:\s+in\s+the\s+)([A-Za-z0-9\s,\.]{2,50}(?=\s|$|\.))\s+(?:industry|sector|market)/i);
      
      if (industryMatch) {
        results.industry = industryMatch[1].trim();
      }
      
      // Extract company size
      const companySizeMatch = pageData.match(/(?:company size|employees|team size|workforce)[:\s]+([0-9,\s\-]+(?:\s+(?:employees|people|professionals|staff))?)/i)
        || pageData.match(/(?:over|approximately|about|nearly)\s+([0-9,]+)\s+(?:employees|people|professionals|staff)/i);
      
      if (companySizeMatch) {
        results.companySize = companySizeMatch[1].trim();
      }
      
      // Extract contact info
      const contactMatch = pageData.match(/(?:contact|email)[:\s]+([\w\.-]+@[\w\.-]+\.\w{2,})/i)
        || pageData.match(/(?:phone|telephone|call)[:\s]+((?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4})/i);
      
      if (contactMatch) {
        results.contactInfo = contactMatch[1].trim();
      }
      
      // Extract revenue info
      const revenueMatch = pageData.match(/(?:revenue|sales|turnover)[:\s]+((?:USD|\$|€|£)?[0-9\.]+\s*(?:million|billion|M|B|MM|K|thousand))/i);
      
      if (revenueMatch) {
        results.revenue = revenueMatch[1].trim();
      }
      
      // Extract products
      const productMatches = pageData.match(/(?:products?|services?|solutions?)(?:\s+include|\:|\s+are)?\s+([A-Za-z0-9\s,\.\-&]{10,200}?)(?:\.|\n|and)/ig);
      
      if (productMatches && productMatches.length > 0) {
        const productText = productMatches[0].replace(/(?:products?|services?|solutions?)(?:\s+include|\:|\s+are)?\s+/i, '');
        results.products = productText.split(/,|and/).map(p => p.trim()).filter(p => p.length > 0);
      }
      
      // Extract description
      const descriptionMatch = pageData.match(/(?:about us|company description|overview)[:\s]+([A-Za-z0-9\s,\.\-&]{20,500}?)(?:\.|\n)/i);
      
      if (descriptionMatch) {
        results.description = descriptionMatch[1].trim();
      }
      
      return results;
    } catch (error) {
      console.error('Error extracting business data:', error);
      return results;
    }
  }
}
