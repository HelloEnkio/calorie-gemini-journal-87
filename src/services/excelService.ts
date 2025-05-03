
import { DailyLog, WeeklyStats } from "@/types";
import { formatDateKey } from "@/utils/storage";

export const exportToExcel = (data: DailyLog[] | WeeklyStats[], type: "daily" | "weekly"): void => {
  try {
    // Create CSV content
    const headers = type === "daily" 
      ? ["Date", "Calories", "Protéines (g)", "Glucides (g)", "Lipides (g)", "Nb d'entrées", "Poids (kg)"] 
      : ["Semaine du", "Au", "Calories moy.", "Protéines moy. (g)", "Glucides moy. (g)", "Lipides moy. (g)", "Séances sport", "Variation poids"];
    
    let csvContent = headers.join(",") + "\n";
    
    if (type === "daily") {
      (data as DailyLog[]).forEach(log => {
        const row = [
          log.date,
          log.totalCalories.toFixed(1),
          log.totalMacros.protein.toFixed(1),
          log.totalMacros.carbs.toFixed(1),
          log.totalMacros.fat.toFixed(1),
          log.foodEntries.length,
          log.weight ? log.weight.weight.toFixed(1) : "-"
        ];
        csvContent += row.join(",") + "\n";
      });
    } else {
      (data as WeeklyStats[]).forEach(stat => {
        const row = [
          stat.startDate,
          stat.endDate,
          stat.averageCalories.toFixed(1),
          stat.averageMacros.protein.toFixed(1),
          stat.averageMacros.carbs.toFixed(1),
          stat.averageMacros.fat.toFixed(1),
          stat.totalWorkouts,
          stat.weightChange ? stat.weightChange.toFixed(1) : "-"
        ];
        csvContent += row.join(",") + "\n";
      });
    }
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const today = formatDateKey();
    const filename = type === "daily" 
      ? `nutrition_journal_logs_${today}.csv` 
      : `nutrition_journal_stats_${today}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Une erreur s'est produite lors de l'exportation.");
  }
};
