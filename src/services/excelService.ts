
import { DailyLog, FoodEntry } from "@/types";
import * as XLSX from "xlsx";

export const exportToExcel = (data: DailyLog[], exportType: "daily" | "summary") => {
  // Prepare data based on export type
  let worksheetData = [];

  if (exportType === "daily") {
    // Flatten food entries
    worksheetData = data.flatMap(log => {
      // If no entries for this day, add one row with just the date
      if (log.foodEntries.length === 0) {
        return [{
          Date: log.date,
          Name: "",
          Calories: log.totalCalories || 0,
          Protein: log.totalMacros.protein || 0,
          Carbs: log.totalMacros.carbs || 0,
          Fat: log.totalMacros.fat || 0
        }];
      }
      
      // Otherwise, add each food entry as a row
      return log.foodEntries.map((entry, index) => ({
        Date: index === 0 ? log.date : "", // Only show date on first entry of the day
        Name: entry.name,
        Calories: entry.calories,
        Protein: entry.macros.protein,
        Carbs: entry.macros.carbs,
        Fat: entry.macros.fat,
        // Use optional chaining for fields that might not exist in the FoodEntry interface
        Meal: entry.mealType || "",
        Notes: entry.timestamp || ""
      }));
    });
  } else {
    // Summary by day
    worksheetData = data.map(log => ({
      Date: log.date,
      TotalCalories: log.totalCalories,
      TotalProtein: log.totalMacros.protein,
      TotalCarbs: log.totalMacros.carbs,
      TotalFat: log.totalMacros.fat,
      WorkoutCount: log.workouts?.length || 0,
      Weight: log.weight?.weight || ""
    }));
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NutritionData");
  
  // Write to file and download
  XLSX.writeFile(workbook, "nutrition_tracker_export.xlsx");
};
