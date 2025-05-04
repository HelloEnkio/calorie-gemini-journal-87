
import { DailyLog } from "@/types";
import { format, parseISO } from "date-fns";

// Calculate weight change if available
export const calculateWeightChange = (logs: DailyLog[]): string | null => {
  const logsWithWeight = logs.filter(log => log.weight);
  if (logsWithWeight.length < 2) {
    return null;
  }
  
  const sortedLogs = [...logsWithWeight].sort((a, b) => 
    a.date.localeCompare(b.date)
  );
  
  const oldestWeight = sortedLogs[0].weight?.weight;
  const newestWeight = sortedLogs[sortedLogs.length - 1].weight?.weight;
  
  return newestWeight && oldestWeight 
    ? (newestWeight - oldestWeight).toFixed(1) 
    : null;
};

// Format date for display
export const formatDisplayDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
};

// Get date range description
export const getDateRangeDescription = (
  dateRange: "week" | "month" | "all" | "custom",
  startDate: string,
  endDate: string
): string => {
  switch(dateRange) {
    case "week":
      return "7 derniers jours";
    case "month":
      return "30 derniers jours";
    case "all":
      return "Toutes les données";
    case "custom":
      return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
    default:
      return "";
  }
};
