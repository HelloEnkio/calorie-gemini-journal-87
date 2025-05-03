
import { useState } from "react";
import { DailyLog } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkoutStatsProps {
  logs: DailyLog[];
}

const WorkoutStats = ({ logs }: WorkoutStatsProps) => {
  const [view, setView] = useState<"duration" | "calories">("duration");
  
  // Get all workout types from the logs
  const allWorkoutTypes = Array.from(
    new Set(
      logs
        .flatMap(log => log.workouts)
        .map(workout => workout.type)
    )
  );
  
  // Total workout stats
  const totalWorkouts = logs.flatMap(log => log.workouts).length;
  const totalDuration = logs.flatMap(log => log.workouts)
    .reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = logs.flatMap(log => log.workouts)
    .reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
  
  // Format data for the chart
  const chartData = logs
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(log => {
      const formattedDate = format(
        parse(log.date, "yyyy-MM-dd", new Date()),
        "dd/MM",
        { locale: fr }
      );
      
      const durations: Record<string, number> = {};
      const calories: Record<string, number> = {};
      
      // Initialize with zero values for all workout types
      allWorkoutTypes.forEach(type => {
        durations[type] = 0;
        calories[type] = 0;
      });
      
      // Sum up durations and calories for each workout type on this day
      log.workouts.forEach(workout => {
        durations[workout.type] = (durations[workout.type] || 0) + workout.duration;
        calories[workout.type] = (calories[workout.type] || 0) + (workout.caloriesBurned || 0);
      });
      
      return {
        date: formattedDate,
        ...durations,
        ...calories,
      };
    });

  if (totalWorkouts === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Pas encore de séances de sport enregistrées</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold">{totalWorkouts}</div>
          <div className="text-xs text-muted-foreground">Séances</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{totalDuration} min</div>
          <div className="text-xs text-muted-foreground">Durée totale</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{totalCalories}</div>
          <div className="text-xs text-muted-foreground">Calories brûlées</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 my-3">
        {allWorkoutTypes.map(type => (
          <Badge key={type} variant="outline" className="text-xs">
            {type}
          </Badge>
        ))}
      </div>
      
      <Tabs value={view} onValueChange={(v) => setView(v as "duration" | "calories")} className="mt-6">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="duration">Durée</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
        </TabsList>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={8}
                unit={view === "duration" ? " min" : ""}
              />
              <Tooltip
                formatter={(value, name) => {
                  return [
                    `${value} ${view === "duration" ? "min" : "kcal"}`, 
                    name
                  ];
                }}
              />
              <Legend />
              {allWorkoutTypes.map((type, index) => (
                <Bar
                  key={type}
                  dataKey={view === "duration" ? type : type}
                  name={type}
                  stackId="a"
                  fill={getColorForWorkoutType(type, index)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Tabs>
    </div>
  );
};

// Fonction utilitaire pour assigner des couleurs aux différents types d'activités
const getColorForWorkoutType = (type: string, index: number): string => {
  const colors = [
    '#3b82f6', // bleu
    '#8b5cf6', // violet
    '#ec4899', // rose
    '#f97316', // orange
    '#10b981', // vert
    '#06b6d4', // cyan
    '#8b5cf6', // violet
    '#f59e0b', // ambre
  ];
  
  // Utiliser la même couleur pour le même type d'activité
  const hash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length] || colors[index % colors.length];
};

export default WorkoutStats;
