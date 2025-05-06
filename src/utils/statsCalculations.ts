import { DailyLog } from "@/types";
import { format, subDays } from "date-fns";
import { getUserGoals } from "@/utils/storage";

export type DateRangeType = "week" | "month" | "all" | "custom";

// Génération de la description de la plage de dates
export function getDateRangeDescription(
  dateRange: DateRangeType, 
  startDate: string, 
  endDate: string
): string {
  switch (dateRange) {
    case "week":
      return "Derniers 7 jours";
    case "month":
      return "Derniers 30 jours";
    case "all":
      return "Toutes les données";
    case "custom":
      return `Du ${format(new Date(startDate), "d MMMM", { locale: fr })} au ${format(new Date(endDate), "d MMMM yyyy", { locale: fr })}`;
    default:
      return "";
  }
}

// Calcul du changement de poids
export function calculateWeightChange(logs: DailyLog[]): string | null {
  const logsWithWeight = logs.filter(log => log.weight).sort((a, b) => a.date.localeCompare(b.date));
  
  if (logsWithWeight.length >= 2) {
    const firstWeight = logsWithWeight[0].weight!.weight;
    const lastWeight = logsWithWeight[logsWithWeight.length - 1].weight!.weight;
    return (lastWeight - firstWeight).toFixed(1);
  }
  
  return null;
}

// Calcul du taux d'atteinte des objectifs
export function calculateGoalAchievements(logs: DailyLog[]) {
  if (logs.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  const goals = getUserGoals();
  let caloriesOnTarget = 0;
  let proteinOnTarget = 0;
  let carbsOnTarget = 0;
  let fatOnTarget = 0;
  
  logs.forEach(log => {
    // Un jour est considéré "dans l'objectif" si la valeur est à ±10% de l'objectif
    if (log.totalCalories >= goals.dailyCalories * 0.9 && log.totalCalories <= goals.dailyCalories * 1.1) {
      caloriesOnTarget++;
    }
    
    if (goals.macros?.protein && 
        log.totalMacros.protein >= goals.macros.protein * 0.9 && 
        log.totalMacros.protein <= goals.macros.protein * 1.1) {
      proteinOnTarget++;
    }
    
    if (goals.macros?.carbs && 
        log.totalMacros.carbs >= goals.macros.carbs * 0.9 && 
        log.totalMacros.carbs <= goals.macros.carbs * 1.1) {
      carbsOnTarget++;
    }
    
    if (goals.macros?.fat && 
        log.totalMacros.fat >= goals.macros.fat * 0.9 && 
        log.totalMacros.fat <= goals.macros.fat * 1.1) {
      fatOnTarget++;
    }
  });
  
  return {
    calories: logs.length > 0 ? Math.round((caloriesOnTarget / logs.length) * 100) : 0,
    protein: logs.length > 0 ? Math.round((proteinOnTarget / logs.length) * 100) : 0,
    carbs: logs.length > 0 ? Math.round((carbsOnTarget / logs.length) * 100) : 0,
    fat: logs.length > 0 ? Math.round((fatOnTarget / logs.length) * 100) : 0
  };
}
