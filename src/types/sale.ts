export interface Sale {
  transaction: string;
  order_date: string;
  approved_date: string;
  offer_code: string;
  offer_description: string;
  product_name: string;
  buyer_name: string;
  buyer_email: string;
  value: number;
  currency: string;
  src: string;
  sck: string;
  received_at: string;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesToday: number;
  revenueToday: number;
  conversionRate: number;
}

export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
  offerDescription: string | null;
}
