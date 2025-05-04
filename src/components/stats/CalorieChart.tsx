
import { useMemo } from "react";
import { DailyLog } from "@/types";
import { getUserGoals } from "@/utils/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Star } from "lucide-react";

interface CalorieChartProps {
  logs: DailyLog[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { 
    day: "numeric",
    month: "numeric"
  });
};

const CalorieChart = ({ logs }: CalorieChartProps) => {
  const goals = getUserGoals();
  
  const chartData = useMemo(() => {
    return logs
      .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
      .map((log) => {
        // Vérifier si l'objectif est atteint à ±10%
        const isOnTarget = log.totalCalories >= goals.dailyCalories * 0.9 && 
                         log.totalCalories <= goals.dailyCalories * 1.1;
        
        return {
          date: log.date,
          formattedDate: formatDate(log.date),
          calories: log.totalCalories,
          goal: goals.dailyCalories,
          isOnTarget,
        };
      });
  }, [logs, goals]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 5,
            bottom: 20,
          }}
          barSize={logs.length > 20 ? 6 : 12} // Adjust bar width based on number of logs
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            interval={logs.length > 14 ? Math.floor(logs.length / 10) : 0} // Show fewer ticks for many logs
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <Tooltip 
            formatter={(value, name, props) => {
              // @ts-ignore
              const isOnTarget = props.payload?.isOnTarget;
              return [
                `${value} kcal ${isOnTarget ? '✨' : ''}`, 
                "Calories"
              ];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <ReferenceLine 
            y={goals.dailyCalories} 
            stroke="rgba(24, 182, 155, 0.7)" 
            strokeWidth={2}
            strokeDasharray="3 3" 
            label={{ 
              value: 'Objectif', 
              position: 'top',
              fill: 'rgba(24, 182, 155, 1)',
              fontSize: 12
            }} 
          />
          {/* Zone cible (±10% de l'objectif) */}
          <ReferenceLine 
            y={goals.dailyCalories * 0.9} 
            stroke="rgba(24, 182, 155, 0.2)" 
            strokeWidth={1}
          />
          <ReferenceLine 
            y={goals.dailyCalories * 1.1} 
            stroke="rgba(24, 182, 155, 0.2)" 
            strokeWidth={1}
          />
          <Bar 
            dataKey="calories" 
            fill="#14b8a6"
            className="cursor-pointer"
          >
            {chartData.map((entry, index) => (
              <rect 
                key={`rect-${index}`}
                x={0}
                y={0}
                width={0}
                height={0}
                fill={entry.isOnTarget ? "#10b981" : "#14b8a6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center">
          <span className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></span>
          Objectif atteint (±10%)
        </span>
        <span className="inline-flex items-center ml-3">
          <span className="h-3 w-3 rounded-full bg-teal-500 mr-1"></span>
          Hors objectif
        </span>
      </div>
    </div>
  );
};

export default CalorieChart;
