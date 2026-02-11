import { useState, useMemo, useCallback, useEffect } from "react";
import { DollarSign, TrendingUp, ShoppingCart, Percent, CalendarCheck } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProductsChart } from "@/components/dashboard/ProductsChart";
import { SourcesChart } from "@/components/dashboard/SourcesChart";
import { SckChart } from "@/components/dashboard/SckChart";
import { SalesTable } from "@/components/dashboard/SalesTable";
import { Sale, DateFilter as DateFilterType, SalesStats } from "@/types/sale";
import { isWithinInterval, isToday, startOfDay, endOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { parseBrazilianDate } from "@/lib/dateUtils";

const N8N_WEBHOOK_URL = "https://matheusintegrations.app.n8n.cloud/webhook/sales-json";

const Index = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    startDate: null,
    endDate: null,
    offerDescription: null,
  });
  const { toast } = useToast();

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(N8N_WEBHOOK_URL);
      if (!response.ok) throw new Error("Falha ao buscar dados");
      const data = await response.json();
      setSales(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível conectar ao n8n",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch only on mount
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = useMemo(() => {
    let result = sales;

    // Filter by date
    if (dateFilter.startDate || dateFilter.endDate) {
      result = result.filter((sale) => {
        const saleDate = parseBrazilianDate(sale.order_date);
        const start = dateFilter.startDate ? startOfDay(dateFilter.startDate) : new Date(0);
        const end = dateFilter.endDate ? endOfDay(dateFilter.endDate) : new Date();
        return isWithinInterval(saleDate, { start, end });
      });
    }

    // Filter by offer description (text search)
    if (dateFilter.offerDescription) {
      const searchTerm = dateFilter.offerDescription.toLowerCase();
      result = result.filter((sale) => 
        sale.offer_description.toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }, [sales, dateFilter]);


  const stats: SalesStats = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.value, 0);
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
    
    const todaySales = filteredSales.filter((sale) => isToday(parseBrazilianDate(sale.order_date)));
    const salesToday = todaySales.length;
    const revenueToday = todaySales.reduce((sum, sale) => sum + sale.value, 0);

    return {
      totalSales,
      totalRevenue,
      averageTicket,
      salesToday,
      revenueToday,
      conversionRate: 3.2,
    };
  }, [filteredSales]);

  const handleRefresh = useCallback(() => {
    fetchSales();
  }, [fetchSales]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        <Header 
          onRefresh={handleRefresh} 
          isLoading={isLoading} 
          lastUpdate={lastUpdate} 
        />

        <DateFilter 
          filter={dateFilter} 
          onFilterChange={setDateFilter}
        />

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KPICard
            title="Total de Vendas"
            value={stats.totalSales}
            subtitle="vendas no período"
            icon={ShoppingCart}
            delay={0}
          />
          <KPICard
            title="Receita Total"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="faturamento"
            icon={DollarSign}
            delay={50}
          />
          <KPICard
            title="Ticket Médio"
            value={formatCurrency(stats.averageTicket)}
            subtitle="por venda"
            icon={TrendingUp}
            delay={100}
          />
          <KPICard
            title="Vendas Hoje"
            value={stats.salesToday}
            subtitle="transações"
            icon={CalendarCheck}
            delay={150}
          />
          <KPICard
            title="Receita Hoje"
            value={formatCurrency(stats.revenueToday)}
            subtitle="faturamento do dia"
            icon={DollarSign}
            delay={200}
          />
          <KPICard
            title="Taxa de Conversão"
            value={`${stats.conversionRate}%`}
            subtitle="visitantes → vendas"
            icon={Percent}
            delay={250}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SalesChart sales={filteredSales} />
          <ProductsChart sales={filteredSales} />
        </div>

        {/* Sources Chart + SCK Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SourcesChart sales={filteredSales} />
          <SckChart sales={filteredSales} />
        </div>

        {/* Sales Table */}
        <SalesTable sales={filteredSales} />
      </div>
    </div>
  );
};

export default Index;
