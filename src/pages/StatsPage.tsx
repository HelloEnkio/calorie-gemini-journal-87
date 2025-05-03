
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { format, subDays, parseISO } from "date-fns";
import CalorieChart from "@/components/stats/CalorieChart";
import MacroDistribution from "@/components/stats/MacroDistribution";
import { getLogsInDateRange, formatDateKey, getAllLogs } from "@/utils/storage";
import { exportToExcel } from "@/services/excelService";
import { toast } from "sonner";
import { FileDown, Calendar } from "lucide-react";

const StatsPage = () => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<"week" | "month" | "custom">("week");
  const [startDate, setStartDate] = useState(formatDateKey(subDays(today, 7)));
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
  
  // Calculate summary statistics
  const calculateSummary = () => {
    if (logs.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        totalWorkouts: 0,
        daysTracked: 0
      };
    }
    
    const totals = logs.reduce((acc, log) => {
      return {
        calories: acc.calories + log.totalCalories,
        protein: acc.protein + log.totalMacros.protein,
        carbs: acc.carbs + log.totalMacros.carbs,
        fat: acc.fat + log.totalMacros.fat,
        workouts: acc.workouts + log.workouts.length
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, workouts: 0 });
    
    return {
      avgCalories: Math.round(totals.calories / logs.length),
      avgProtein: Math.round(totals.protein / logs.length),
      avgCarbs: Math.round(totals.carbs / logs.length),
      avgFat: Math.round(totals.fat / logs.length),
      totalWorkouts: totals.workouts,
      daysTracked: logs.length
    };
  };
  
  const summary = calculateSummary();
  
  // Calculate weight change if available
  const calculateWeightChange = () => {
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
  
  const weightChange = calculateWeightChange();
  
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
  
  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy');
    } catch {
      return dateStr;
    }
  };
  
  // Get date range description
  const getDateRangeDescription = () => {
    switch(dateRange) {
      case "week":
        return "7 derniers jours";
      case "month":
        return "30 derniers jours";
      case "custom":
        return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
      default:
        return "";
    }
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
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="week">7 jours</TabsTrigger>
          <TabsTrigger value="month">30 jours</TabsTrigger>
          <TabsTrigger value="custom">Personnalisé</TabsTrigger>
        </TabsList>
        
        {dateRange === "custom" && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Input 
                id="start-date"
                type="date" 
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Input 
                id="end-date"
                type="date" 
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-1" /> 
          <span>{getDateRangeDescription()} ({logs.length} jours)</span>
        </div>
        
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground">Calories moy.</div>
                <div className="text-xl font-bold">{summary.avgCalories}</div>
                <div className="text-xs">kcal/jour</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground">Séances sport</div>
                <div className="text-xl font-bold">{summary.totalWorkouts}</div>
                <div className="text-xs">séance{summary.totalWorkouts !== 1 && 's'}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Macros moyennes</h3>
              <div className="flex space-x-2 text-sm">
                <div className="flex-1 bg-green-100 text-green-800 p-2 rounded text-center">
                  <div>Protéines</div>
                  <div className="font-bold">{summary.avgProtein}g</div>
                </div>
                <div className="flex-1 bg-amber-100 text-amber-800 p-2 rounded text-center">
                  <div>Glucides</div>
                  <div className="font-bold">{summary.avgCarbs}g</div>
                </div>
                <div className="flex-1 bg-rose-100 text-rose-800 p-2 rounded text-center">
                  <div>Lipides</div>
                  <div className="font-bold">{summary.avgFat}g</div>
                </div>
              </div>
            </div>
            
            {weightChange && (
              <div>
                <Separator className="my-3" />
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Evolution du poids</div>
                  <div className={`text-xl font-bold ${
                    Number(weightChange) > 0 
                      ? 'text-rose-500'
                      : Number(weightChange) < 0
                        ? 'text-emerald-500'
                        : ''
                  }`}>
                    {Number(weightChange) > 0 ? '+' : ''}{weightChange} kg
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
