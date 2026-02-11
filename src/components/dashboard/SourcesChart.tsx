import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Sale } from "@/types/sale";

interface SourcesChartProps {
  sales: Sale[];
}

export function SourcesChart({ sales }: SourcesChartProps) {
  const chartData = useMemo(() => {
    const sourceStats = sales.reduce((acc, sale) => {
      const source = sale.src || "direct";
      if (!acc[source]) {
        acc[source] = 0;
      }
      acc[source] += 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceStats)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        percentage: ((value / sales.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [sales]);

  const colors = [
    "hsl(199, 89%, 63%)",
    "hsl(142, 76%, 45%)",
    "hsl(45, 93%, 47%)",
    "hsl(280, 70%, 55%)",
    "hsl(350, 70%, 55%)",
    "hsl(180, 60%, 45%)",
    "hsl(30, 80%, 55%)",
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.value} vendas ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <h3 className="text-lg font-semibold mb-6">Fontes de Tráfego</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
