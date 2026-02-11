import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sale } from "@/types/sale";

interface ProductsChartProps {
  sales: Sale[];
}

export function ProductsChart({ sales }: ProductsChartProps) {
  const chartData = useMemo(() => {
    const productStats = sales.reduce((acc, sale) => {
      if (!acc[sale.product_name]) {
        acc[sale.product_name] = { count: 0, revenue: 0 };
      }
      acc[sale.product_name].count += 1;
      acc[sale.product_name].revenue += sale.value;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    return Object.entries(productStats)
      .map(([name, data]) => ({
        name: name.length > 20 ? name.substring(0, 20) + "..." : name,
        fullName: name,
        vendas: data.count,
        receita: data.revenue,
      }))
      .sort((a, b) => b.receita - a.receita)
      .slice(0, 5);
  }, [sales]);

  const colors = [
    "hsl(199, 89%, 63%)",
    "hsl(199, 70%, 55%)",
    "hsl(199, 60%, 48%)",
    "hsl(199, 50%, 40%)",
    "hsl(199, 40%, 35%)",
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Vendas: <span className="text-primary font-medium">{data.vendas}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Receita: <span className="text-success font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.receita)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <h3 className="text-lg font-semibold mb-6">Top Produtos</h3>
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
              tickFormatter={(value) => 
                new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  notation: 'compact'
                }).format(value)
              }
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(215, 15%, 55%)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={150}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(220, 15%, 15%)' }} />
            <Bar dataKey="receita" radius={[0, 4, 4, 0]}>
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
