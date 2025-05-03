
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";
import { FileDown } from "lucide-react";
import { getLogsInDateRange, formatDateKey, getAllLogs } from "@/utils/storage";
import { exportToExcel } from "@/services/excelService";
import { toast } from "sonner";
import CalorieChart from "@/components/stats/CalorieChart";
import MacroDistribution from "@/components/stats/MacroDistribution";
import DateRangeSelector from "@/components/stats/DateRangeSelector";
import StatsSummary from "@/components/stats/StatsSummary";
import { calculateWeightChange, getDateRangeDescription } from "@/utils/statsHelpers";

const StatsPage = () => {
  const today = new Date();
  // Default to showing all 30 days of data instead of just the week
  const [dateRange, setDateRange] = useState<"week" | "month" | "custom">("month");
  // Start from 30 days ago rather than 7 days
  const [startDate, setStartDate] = useState(formatDateKey(subDays(today, 30)));
  const [endDate, setEndDate] = useState(formatDateKey(today));
  
  // Get data for selected timeframe
  const getLogs = () => {
    switch(dateRange) {
      case "week":
        return getLogsInDateRange(
          formatDateKey(subDays(today, 7)),
          formatDateKey(today)
        );
      case "month":
        return getLogsInDateRange(
          formatDateKey(subDays(today, 30)),
          formatDateKey(today)
        );
      case "custom":
        return getLogsInDateRange(startDate, endDate);
      default:
        return getLogsInDateRange(
          formatDateKey(subDays(today, 7)),
          formatDateKey(today)
        );
    }
  };
  
  const logs = getLogs();
  const weightChange = calculateWeightChange(logs);
  const dateRangeDesc = getDateRangeDescription(dateRange, startDate, endDate);
  
  const handleExport = () => {
    try {
      exportToExcel(getAllLogs(), "daily");
      toast.success("Données exportées avec succès");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };
  
  // Handle custom date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };
  
  return (
    <div className="mobile-container pt-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleExport}
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter</span>
        </Button>
      </div>
      
      <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as "week" | "month" | "custom")}>
        <DateRangeSelector 
          dateRange={dateRange}
          startDate={startDate}
          endDate={endDate}
          logsCount={logs.length}
          dateRangeDescription={dateRangeDesc}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <CalorieChart logs={logs} />
          </CardContent>
        </Card>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Distribution des macros</CardTitle>
        </CardHeader>
        <CardContent>
          <MacroDistribution logs={logs} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsSummary logs={logs} weightChange={weightChange} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
