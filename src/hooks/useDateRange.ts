
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { getAllLogs, getLogsForLastDays, getLogsInDateRange } from "@/utils/storage";
import { DailyLog } from "@/types";

type DateRangeType = "week" | "month" | "all" | "custom";

export function useDateRange() {
  const [dateRange, setDateRange] = useState<DateRangeType>("week");
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [logs, setLogs] = useState<DailyLog[]>([]);
  
  useEffect(() => {
    let filteredLogs;
    
    switch (dateRange) {
      case "week":
        filteredLogs = getLogsForLastDays(7);
        setStartDate(format(subDays(new Date(), 7), "yyyy-MM-dd"));
        setEndDate(format(new Date(), "yyyy-MM-dd"));
        break;
      case "month":
        filteredLogs = getLogsForLastDays(30);
        setStartDate(format(subDays(new Date(), 30), "yyyy-MM-dd"));
        setEndDate(format(new Date(), "yyyy-MM-dd"));
        break;
      case "all":
        filteredLogs = getAllLogs();
        if (filteredLogs.length > 0) {
          const sortedLogs = [...filteredLogs].sort((a, b) => a.date.localeCompare(b.date));
          setStartDate(sortedLogs[0].date);
          setEndDate(sortedLogs[sortedLogs.length - 1].date);
        }
        break;
      case "custom":
        // Utiliser les dates sélectionnées
        filteredLogs = getAllLogs().filter(log => {
          return log.date >= startDate && log.date <= endDate;
        });
        break;
      default:
        filteredLogs = [];
    }
    
    setLogs(filteredLogs);
  }, [dateRange, startDate, endDate]);

  return {
    dateRange,
    setDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    logs
  };
}
