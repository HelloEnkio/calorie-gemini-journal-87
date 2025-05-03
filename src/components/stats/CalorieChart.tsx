
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
      .map((log) => ({
        date: log.date,
        formattedDate: formatDate(log.date),
        calories: log.totalCalories,
        goal: goals.dailyCalories,
      }));
  }, [logs, goals]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 5,
            left: 5,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <Tooltip 
            formatter={(value) => [`${value} kcal`, "Calories"]}
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
          <Bar 
            dataKey="calories" 
            fill="#14b8a6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CalorieChart;
