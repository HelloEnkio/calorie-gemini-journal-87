
import { DailyLog } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

interface WeightChartProps {
  logs: DailyLog[];
}

const WeightChart = ({ logs }: WeightChartProps) => {
  // Format data for the chart
  const chartData = logs
    .filter(log => log.weight) // Only logs with weight data
    .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
    .map(log => ({
      date: log.date,
      formattedDate: format(
        parse(log.date, "yyyy-MM-dd", new Date()),
        "dd/MM",
        { locale: fr }
      ),
      weight: log.weight?.weight || null,
    }));

  // Find min and max weight for y-axis
  const weights = chartData.map(d => d.weight).filter(Boolean) as number[];
  const minWeight = weights.length ? Math.min(...weights) - 1 : 0;
  const maxWeight = weights.length ? Math.max(...weights) + 1 : 100;

  if (chartData.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Pas encore de données de poids disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="99%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis 
            domain={[minWeight, maxWeight]}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            tickCount={5}
            unit=" kg"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Date
                      </div>
                      <div className="text-right text-xs font-medium">
                        {payload[0].payload.formattedDate}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Poids
                      </div>
                      <div className="text-right text-xs font-medium">
                        {payload[0].value} kg
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "#0ea5e9" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
