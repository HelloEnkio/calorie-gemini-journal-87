
import { useMemo } from "react";
import { useDateRange } from "@/hooks/useDateRange";
import { getDateRangeDescription } from "@/utils/statsCalculations";
import StatsHeader from "@/components/stats/StatsHeader";
import SummaryCard from "@/components/stats/SummaryCard";
import StatsContent from "@/components/stats/StatsContent";

const StatsPage = () => {
  const { 
    dateRange, 
    setDateRange, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    logs 
  } = useDateRange();
  
  // Génération de la description de la plage de dates
  const dateRangeDescription = useMemo(() => {
    return getDateRangeDescription(dateRange, startDate, endDate);
  }, [dateRange, startDate, endDate]);
  
  return (
    <div className="container max-w-3xl mx-auto px-4 pb-20 pt-4">
      <StatsHeader 
        dateRange={dateRange}
        startDate={startDate}
        endDate={endDate}
        logsCount={logs.length}
        dateRangeDescription={dateRangeDescription}
        onDateRangeChange={(value) => setDateRange(value)}
        onStartDateChange={(e) => setStartDate(e.target.value)}
        onEndDateChange={(e) => setEndDate(e.target.value)}
      />
      
      <SummaryCard logs={logs} />
      
      <StatsContent logs={logs} />
    </div>
  );
};

export default StatsPage;
