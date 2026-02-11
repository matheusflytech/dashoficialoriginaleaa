import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sale } from "@/types/sale";

interface SckChartProps {
  sales: Sale[];
}

export function SckChart({ sales }: SckChartProps) {
  const chartData = useMemo(() => {
    const sckStats = sales.reduce((acc, sale) => {
      const sck = sale.sck || "sem_sck";
      if (!acc[sck]) {
        acc[sck] = { count: 0, revenue: 0 };
      }
      acc[sck].count += 1;
      acc[sck].revenue += sale.value;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    return Object.entries(sckStats)
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        fullName: name,
        vendas: data.count,
        receita: data.revenue,
      }))
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 10);
  }, [sales]);

  const colors = [
    "hsl(199, 89%, 63%)",
    "hsl(142, 76%, 45%)",
    "hsl(45, 93%, 47%)",
    "hsl(280, 70%, 55%)",
    "hsl(350, 70%, 55%)",
    "hsl(180, 60%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(220, 70%, 55%)",
    "hsl(160, 60%, 45%)",
    "hsl(300, 60%, 50%)",
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground">{data.fullName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.vendas} vendas
          </p>
          <p className="text-xs text-muted-foreground">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.receita)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "450ms" }}>
      <h3 className="text-lg font-semibold mb-6">Vendas por SCK</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="hsl(215, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(215, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="vendas" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
