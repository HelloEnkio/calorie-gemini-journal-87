
import { useMemo } from "react";
import { DailyLog, MacroNutrients } from "@/types";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface MacroDistributionProps {
  logs: DailyLog[];
}

const MacroDistribution = ({ logs }: MacroDistributionProps) => {
  const macroData = useMemo(() => {
    // Combine all macros from logs
    const combinedMacros: MacroNutrients = logs.reduce(
      (acc, log) => ({
        protein: acc.protein + log.totalMacros.protein,
        carbs: acc.carbs + log.totalMacros.carbs,
        fat: acc.fat + log.totalMacros.fat
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    // Convert to percentage and chart data format
    const total = combinedMacros.protein + combinedMacros.carbs + combinedMacros.fat;
    
    if (total === 0) {
      return [
        { name: "Protéines", value: 33.3, color: "#4ade80" },
        { name: "Glucides", value: 33.3, color: "#fbbf24" },
        { name: "Lipides", value: 33.3, color: "#f87171" }
      ];
    }
    
    return [
      { name: "Protéines", value: combinedMacros.protein, color: "#4ade80" },
      { name: "Glucides", value: combinedMacros.carbs, color: "#fbbf24" },
      { name: "Lipides", value: combinedMacros.fat, color: "#f87171" }
    ];
  }, [logs]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}g`, name]}
            labelFormatter={() => "Macronutriments"}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroDistribution;
