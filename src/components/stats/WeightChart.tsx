
import { DailyLog } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
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
  const minWeight = weights.length ? Math.floor(Math.min(...weights) - 1) : 0;
  const maxWeight = weights.length ? Math.ceil(Math.max(...weights) + 1) : 100;
  
  // Identify important milestones (lowest and highest weights)
  let lowestWeight: any = null;
  let highestWeight: any = null;
  
  if (weights.length > 0) {
    const minWeightValue = Math.min(...weights);
    const maxWeightValue = Math.max(...weights);
    
    lowestWeight = chartData.find(d => d.weight === minWeightValue);
    highestWeight = chartData.find(d => d.weight === maxWeightValue);
  }

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
                const data = payload[0].payload;
                const isLowestWeight = lowestWeight && data.date === lowestWeight.date;
                const isHighestWeight = highestWeight && data.date === highestWeight.date;
                
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Date
                      </div>
                      <div className="text-right text-xs font-medium">
                        {data.formattedDate}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Poids
                      </div>
                      <div className="text-right text-xs font-medium">
                        {data.weight} kg
                        {isLowestWeight && <span className="ml-1 text-emerald-500">🔽</span>}
                        {isHighestWeight && <span className="ml-1 text-amber-500">🔼</span>}
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
          
          {/* Points spécifiques à mettre en valeur */}
          {lowestWeight && (
            <ReferenceDot 
              x={lowestWeight.formattedDate} 
              y={lowestWeight.weight} 
              r={6}
              fill="#10b981" 
              stroke="#047857" 
              strokeWidth={2} 
            />
          )}
          
          {highestWeight && highestWeight !== lowestWeight && (
            <ReferenceDot 
              x={highestWeight.formattedDate} 
              y={highestWeight.weight} 
              r={6}
              fill="#f59e0b" 
              stroke="#b45309" 
              strokeWidth={2} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {(lowestWeight || highestWeight) && (
        <div className="flex justify-center gap-4 text-xs mt-2">
          {lowestWeight && (
            <div className="inline-flex items-center">
              <span className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></span>
              <span>Poids min: {lowestWeight.weight} kg</span>
            </div>
          )}
          {highestWeight && highestWeight !== lowestWeight && (
            <div className="inline-flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-1"></span>
              <span>Poids max: {highestWeight.weight} kg</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeightChart;
