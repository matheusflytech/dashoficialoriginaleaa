import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sale } from "@/types/sale";
import { format, startOfDay, eachDayOfInterval, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseBrazilianDate } from "@/lib/dateUtils";

interface SalesChartProps {
  sales: Sale[];
}

export function SalesChart({ sales }: SalesChartProps) {
  const chartData = useMemo(() => {
    if (sales.length === 0) return [];

    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const salesByDay = sales.reduce((acc, sale) => {
      const saleDate = parseBrazilianDate(sale.order_date);
      const day = format(saleDate, 'yyyy-MM-dd');
      if (!acc[day]) {
        acc[day] = { count: 0, revenue: 0 };
      }
      acc[day].count += 1;
      acc[day].revenue += sale.value;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    return days.map(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      const data = salesByDay[dayKey] || { count: 0, revenue: 0 };
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        fullDate: dayKey,
        vendas: data.count,
        receita: data.revenue,
      };
    });
  }, [sales]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Vendas: <span className="text-primary font-medium">{payload[0]?.value}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Receita: <span className="text-success font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[1]?.value || 0)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <h3 className="text-lg font-semibold mb-6">Vendas dos últimos 30 dias</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 63%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 63%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(215, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="vendas"
              stroke="hsl(199, 89%, 63%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVendas)"
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="hsl(142, 76%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReceita)"
              yAxisId={0}
              hide
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
