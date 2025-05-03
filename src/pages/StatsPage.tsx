
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CalorieChart from "@/components/stats/CalorieChart";
import MacroDistribution from "@/components/stats/MacroDistribution";
import { getLogsForLastDays, formatDateKey, getAllLogs } from "@/utils/storage";
import { exportToExcel } from "@/services/excelService";
import { toast } from "sonner";
import { FileDown } from "lucide-react";

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");
  
  // Get data for selected timeframe
  const logs = timeframe === "week" 
    ? getLogsForLastDays(7) 
    : getLogsForLastDays(30);
  
  // Calculate summary statistics
  const calculateSummary = () => {
    if (logs.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        totalWorkouts: 0
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
      totalWorkouts: totals.workouts
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
      
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "week" | "month")}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="week">7 jours</TabsTrigger>
          <TabsTrigger value="month">30 jours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="tab-content">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <CalorieChart logs={logs} timeframe="week" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="month" className="tab-content">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <CalorieChart logs={logs} timeframe="month" />
            </CardContent>
          </Card>
        </TabsContent>
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
