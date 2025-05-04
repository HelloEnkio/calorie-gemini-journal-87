
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangeSelector from "@/components/stats/DateRangeSelector";
import CalorieChart from "@/components/stats/CalorieChart";
import MacroDistribution from "@/components/stats/MacroDistribution";
import WeightChart from "@/components/stats/WeightChart";
import WorkoutStats from "@/components/stats/WorkoutStats";
import StatsSummary from "@/components/stats/StatsSummary";
import WeightPhotoComparison from "@/components/stats/WeightPhotoComparison";
import { getDailyLogs, getLogsByDateRange, getUserGoals } from "@/utils/storage";
import { format, subDays, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DailyLog } from "@/types";

const StatsPage = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "all" | "custom">("week");
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [activeTab, setActiveTab] = useState<string>("calories");
  const [logs, setLogs] = useState<DailyLog[]>([]);
  
  // Chargement des données
  useEffect(() => {
    let filteredLogs;
    
    switch (dateRange) {
      case "week":
        filteredLogs = getLogsByDateRange(7);
        setStartDate(format(subDays(new Date(), 7), "yyyy-MM-dd"));
        setEndDate(format(new Date(), "yyyy-MM-dd"));
        break;
      case "month":
        filteredLogs = getLogsByDateRange(30);
        setStartDate(format(subDays(new Date(), 30), "yyyy-MM-dd"));
        setEndDate(format(new Date(), "yyyy-MM-dd"));
        break;
      case "all":
        filteredLogs = getDailyLogs();
        if (filteredLogs.length > 0) {
          const sortedLogs = [...filteredLogs].sort((a, b) => a.date.localeCompare(b.date));
          setStartDate(sortedLogs[0].date);
          setEndDate(sortedLogs[sortedLogs.length - 1].date);
        }
        break;
      case "custom":
        // Utiliser les dates sélectionnées
        filteredLogs = getDailyLogs().filter(log => {
          return log.date >= startDate && log.date <= endDate;
        });
        break;
      default:
        filteredLogs = [];
    }
    
    setLogs(filteredLogs);
  }, [dateRange, startDate, endDate]);
  
  // Génération de la description de la plage de dates
  const dateRangeDescription = useMemo(() => {
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
  }, [dateRange, startDate, endDate]);
  
  // Calcul du changement de poids
  const weightChange = useMemo(() => {
    const logsWithWeight = logs.filter(log => log.weight).sort((a, b) => a.date.localeCompare(b.date));
    
    if (logsWithWeight.length >= 2) {
      const firstWeight = logsWithWeight[0].weight!.weight;
      const lastWeight = logsWithWeight[logsWithWeight.length - 1].weight!.weight;
      return (lastWeight - firstWeight).toFixed(1);
    }
    
    return null;
  }, [logs]);
  
  // Calcul du taux d'atteinte des objectifs
  const calculateGoalAchievements = useMemo(() => {
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
  }, [logs]);
  
  return (
    <div className="container max-w-3xl mx-auto px-4 pb-20 pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Statistiques</h1>
        <p className="text-muted-foreground">Analysez vos progrès et tendances</p>
      </div>
      
      {/* Sélecteur de plage de dates */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Tabs 
              defaultValue="week" 
              value={dateRange} 
              onValueChange={(value) => setDateRange(value as typeof dateRange)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4 w-full">
                <TabsTrigger value="week">7 jours</TabsTrigger>
                <TabsTrigger value="month">30 jours</TabsTrigger>
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="custom">Personnalisé</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DateRangeSelector 
              dateRange={dateRange}
              startDate={startDate}
              endDate={endDate}
              logsCount={logs.length}
              dateRangeDescription={dateRangeDescription}
              onStartDateChange={(e) => setStartDate(e.target.value)}
              onEndDateChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Section résumé */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsSummary logs={logs} weightChange={weightChange} />
          
          {/* Badges d'atteinte d'objectifs */}
          {logs.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Objectifs atteints (±10%)</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${calculateGoalAchievements.calories >= 50 ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-muted'}`}>
                  <span className="mr-1">Calories</span>
                  <span className="font-bold">{calculateGoalAchievements.calories}%</span>
                  {calculateGoalAchievements.calories >= 50 && <span className="ml-1">🎯</span>}
                </Badge>
                
                <Badge className={`${calculateGoalAchievements.protein >= 50 ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' : 'bg-muted'}`}>
                  <span className="mr-1">Protéines</span>
                  <span className="font-bold">{calculateGoalAchievements.protein}%</span>
                  {calculateGoalAchievements.protein >= 50 && <span className="ml-1">💪</span>}
                </Badge>
                
                <Badge className={`${calculateGoalAchievements.carbs >= 50 ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-muted'}`}>
                  <span className="mr-1">Glucides</span>
                  <span className="font-bold">{calculateGoalAchievements.carbs}%</span>
                  {calculateGoalAchievements.carbs >= 50 && <span className="ml-1">✨</span>}
                </Badge>
                
                <Badge className={`${calculateGoalAchievements.fat >= 50 ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-muted'}`}>
                  <span className="mr-1">Lipides</span>
                  <span className="font-bold">{calculateGoalAchievements.fat}%</span>
                  {calculateGoalAchievements.fat >= 50 && <span className="ml-1">🌟</span>}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Onglets graphiques */}
      <Tabs 
        defaultValue="calories" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-xs">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="weight">Poids</TabsTrigger>
            <TabsTrigger value="workout">Sport</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="calories" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Évolution des calories</CardTitle>
                {calculateGoalAchievements.calories >= 50 && (
                  <Badge variant="outline" className="bg-primary/5 text-primary">
                    Objectif atteint {calculateGoalAchievements.calories}% du temps 🎉
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CalorieChart logs={logs} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribution des macros</CardTitle>
            </CardHeader>
            <CardContent>
              <MacroDistribution logs={logs} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weight" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Évolution du poids</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightChart logs={logs} />
            </CardContent>
          </Card>
          
          <WeightPhotoComparison logs={logs} />
        </TabsContent>
        
        <TabsContent value="workout" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activités sportives</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkoutStats logs={logs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPage;
