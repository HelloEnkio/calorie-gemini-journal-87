
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DailyLog } from "@/types";
import CalorieChart from "@/components/stats/CalorieChart";
import MacroDistribution from "@/components/stats/MacroDistribution";
import WeightChart from "@/components/stats/WeightChart";
import WorkoutStats from "@/components/stats/WorkoutStats";
import WeightPhotoComparison from "@/components/stats/WeightPhotoComparison";
import HabitsStats from "@/components/stats/HabitsStats";
import { calculateGoalAchievements } from "@/utils/statsCalculations";
import { useState } from "react";

interface StatsContentProps {
  logs: DailyLog[];
}

const StatsContent = ({ logs }: StatsContentProps) => {
  const [activeTab, setActiveTab] = useState<string>("calories");
  const achievements = calculateGoalAchievements(logs);
  
  return (
    <Tabs 
      defaultValue="calories" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <div className="flex justify-center mb-6 overflow-x-auto">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
          <TabsTrigger value="workout">Sport</TabsTrigger>
          <TabsTrigger value="habits">Habitudes</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="calories" className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Évolution des calories</CardTitle>
              {achievements.calories >= 50 && (
                <Badge variant="outline" className="bg-primary/5 text-primary">
                  Objectif atteint {achievements.calories}% du temps 🎉
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
      
      <TabsContent value="habits" className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Suivi des habitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsStats logs={logs} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StatsContent;
