
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DailyLog } from "@/types";
import { getLogsForLastDays, getLogsInDateRange } from "@/utils/storage";
import { DateRangeType } from "@/utils/statsCalculations";

export const useDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("week");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [logs, setLogs] = useState<DailyLog[]>([]);

  // Get logs based on date range
  const fetchLogs = () => {
    let fetchedLogs: DailyLog[] = [];

    if (dateRange === "custom" && startDate && endDate) {
      fetchedLogs = getLogsInDateRange(startDate, endDate);
    } else {
      // Convert string range to number of days
      const days = dateRange === "week"
        ? 7
        : dateRange === "month"
          ? 30
          : dateRange === "all"
            ? 90
            : 7;  // Default to 7 days
      
      fetchedLogs = getLogsForLastDays(days);
    }

    // Sort logs by date in ascending order
    fetchedLogs.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setLogs(fetchedLogs);
  };

  // Initialize date range
  useEffect(() => {
    // Set default values for custom date range
    if (startDate === "") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      setStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
    }

    if (endDate === "") {
      setEndDate(format(new Date(), "yyyy-MM-dd"));
    }

    fetchLogs();
  }, [dateRange, startDate, endDate]);

  return {
    dateRange,
    setDateRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    logs,
    refreshLogs: fetchLogs
  };
};

export default useDateRange;
