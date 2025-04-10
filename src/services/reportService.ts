
import { supabase } from "@/integrations/supabase/client";
import { Sale } from "@/types/database";

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageDealSize: number;
  productBreakdown: {
    productName: string;
    count: number;
    revenue: number;
  }[];
  monthlySales: {
    month: string;
    count: number;
    revenue: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
  }[];
}

export const reportService = {
  async getSalesReport(startDate?: string, endDate?: string): Promise<SalesReport> {
    // Get all sales
    let query = supabase
      .from('sales')
      .select('*');
    
    // Filter by date range if provided
    if (startDate) {
      query = query.gte('sale_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('sale_date', endDate);
    }
    
    const { data: salesData, error } = await query;
    
    if (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
    
    // Get lead statuses for status breakdown
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('id, status');
    
    if (leadsError) {
      console.error('Error fetching leads data:', leadsError);
      throw leadsError;
    }
    
    const sales = salesData as Sale[] || [];
    const leads = leadsData || [];
    
    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
    
    // Calculate product breakdown
    const productMap = new Map<string, { count: number, revenue: number }>();
    
    sales.forEach(sale => {
      const product = sale.product_name;
      const existing = productMap.get(product) || { count: 0, revenue: 0 };
      productMap.set(product, {
        count: existing.count + 1,
        revenue: existing.revenue + Number(sale.amount)
      });
    });
    
    const productBreakdown = Array.from(productMap.entries()).map(([productName, data]) => ({
      productName,
      count: data.count,
      revenue: data.revenue
    }));
    
    // Calculate monthly sales
    const monthlyMap = new Map<string, { count: number, revenue: number, monthName: string }>();
    
    sales.forEach(sale => {
      const date = new Date(sale.sale_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      const existing = monthlyMap.get(monthYear) || { count: 0, revenue: 0, monthName };
      monthlyMap.set(monthYear, {
        count: existing.count + 1,
        revenue: existing.revenue + Number(sale.amount),
        monthName
      });
    });
    
    const monthlySales = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month: data.monthName,
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    // Calculate status breakdown
    const statusMap = new Map<string, number>();
    
    leads.forEach(lead => {
      const status = lead.status;
      const count = statusMap.get(status) || 0;
      statusMap.set(status, count + 1);
    });
    
    const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count
    }));
    
    return {
      totalSales: sales.length,
      totalRevenue,
      averageDealSize: sales.length > 0 ? totalRevenue / sales.length : 0,
      productBreakdown,
      monthlySales,
      statusBreakdown
    };
  }
};
