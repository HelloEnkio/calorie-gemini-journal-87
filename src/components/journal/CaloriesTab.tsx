
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Star, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import FoodEntry from "@/components/food/FoodEntry";
import QuickAddForm from "@/components/food/QuickAddForm";
import GeminiInputForm from "@/components/food/GeminiInputForm";
import { DailyLog, UserGoals, FoodEntry as FoodEntryType } from "@/types";
import { cn } from "@/lib/utils";

interface CaloriesTabProps {
  dayLog: DailyLog;
  goals: UserGoals;
  refreshData: () => void;
}

const CaloriesTab = ({ dayLog, goals, refreshData }: CaloriesTabProps) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // Toggle expanded entry
  const toggleEntryDetails = (entryId: string) => {
    if (expandedEntryId === entryId) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(entryId);
    }
  };
  
  // Calculate percentage of goal
  const caloriePercentage = Math.min(
    Math.round((dayLog.totalCalories / goals.dailyCalories) * 100),
    100
  );
  
  // Calculate macro target percentages
  const getMacroTargetPercentage = (macro: keyof typeof dayLog.totalMacros) => {
    if (!goals.macros || !goals.macros[macro]) return 0;
    return Math.min(Math.round((dayLog.totalMacros[macro] / goals.macros[macro]!) * 100), 100);
  };
  
  // Get macro status 
  const getMacroStatus = (macro: keyof typeof dayLog.totalMacros) => {
    if (!goals.macros || !goals.macros[macro]) return "default";
    
    const percentage = (dayLog.totalMacros[macro] / goals.macros[macro]!) * 100;
    if (percentage >= 90 && percentage <= 110) return "success";
    if (percentage > 80 && percentage < 90) return "near";
    if (percentage > 110 && percentage < 120) return "near";
    return "far";
  };
  
  // Get macro classes based on status
  const getMacroStatusClasses = (macro: keyof typeof dayLog.totalMacros, type: 'bg' | 'text' | 'ring') => {
    const status = getMacroStatus(macro);
    
    const classes = {
      protein: {
        bg: {
          default: "bg-green-100",
          near: "bg-green-200 animate-pulse",
          success: "bg-green-200 shadow-md ring-2 ring-green-500",
          far: "bg-green-50"
        },
        text: {
          default: "text-green-800",
          near: "text-green-800",
          success: "text-green-800 font-semibold",
          far: "text-green-700"
        }
      },
      carbs: {
        bg: {
          default: "bg-amber-100",
          near: "bg-amber-200 animate-pulse",
          success: "bg-amber-200 shadow-md ring-2 ring-amber-500",
          far: "bg-amber-50"
        },
        text: {
          default: "text-amber-800",
          near: "text-amber-800",
          success: "text-amber-800 font-semibold",
          far: "text-amber-700"
        }
      },
      fat: {
        bg: {
          default: "bg-rose-100",
          near: "bg-rose-200 animate-pulse",
          success: "bg-rose-200 shadow-md ring-2 ring-rose-500",
          far: "bg-rose-50"
        },
        text: {
          default: "text-rose-800",
          near: "text-rose-800",
          success: "text-rose-800 font-semibold",
          far: "text-rose-700"
        }
      }
    };
    
    return classes[macro][type][status];
  };
  
  // Calculate macro goal percentages
  const proteinTargetPct = getMacroTargetPercentage("protein");
  const carbsTargetPct = getMacroTargetPercentage("carbs");
  const fatTargetPct = getMacroTargetPercentage("fat");
  
  // Format macros as percentages
  const getTotalMacrosPercentage = () => {
    const { protein, carbs, fat } = dayLog.totalMacros;
    const total = protein + carbs + fat;
    
    if (total === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    
    return {
      protein: Math.round((protein / total) * 100),
      carbs: Math.round((carbs / total) * 100),
      fat: Math.round((fat / total) * 100),
    };
  };
  
  const macroPercentages = getTotalMacrosPercentage();
  
  // Check if all macros are on target
  const allMacrosOnTarget = 
    getMacroStatus("protein") === "success" && 
    getMacroStatus("carbs") === "success" && 
    getMacroStatus("fat") === "success";
  
  return (
    <>
      {/* Calories summary card */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-medium">Calories</h2>
              <p className="text-muted-foreground text-sm">
                Objectif: {goals.dailyCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{dayLog.totalCalories}</span>
              <span className="text-sm ml-1">kcal</span>
            </div>
          </div>
          
          <Progress value={caloriePercentage} className="h-2 mb-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{caloriePercentage}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Macro breakdown */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Macronutriments</h2>
          
          {allMacrosOnTarget && (
            <Badge className="bg-primary animate-pulse">
              <Trophy className="h-3 w-3 mr-1" /> Parfait !
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className={cn(
            "p-3 rounded-lg transition-all relative",
            getMacroStatusClasses("protein", "bg"),
            getMacroStatusClasses("protein", "text")
          )}>
            <div className="font-medium">Protéines</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.protein}g</div>
            <div className="text-xs mb-1">{macroPercentages.protein}%</div>
            
            {goals.macros?.protein && (
              <>
                <Progress
                  value={proteinTargetPct}
                  className={cn("h-1", getMacroStatus("protein") === "success" && "bg-green-300")}
                />
                <div className="text-xs mt-1">
                  {proteinTargetPct}% de l'objectif
                </div>
                
                {getMacroStatus("protein") === "success" && (
                  <Star className="absolute top-1 right-1 h-4 w-4 text-green-600 fill-green-600" />
                )}
              </>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-lg transition-all relative",
            getMacroStatusClasses("carbs", "bg"),
            getMacroStatusClasses("carbs", "text")
          )}>
            <div className="font-medium">Glucides</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.carbs}g</div>
            <div className="text-xs mb-1">{macroPercentages.carbs}%</div>
            
            {goals.macros?.carbs && (
              <>
                <Progress
                  value={carbsTargetPct}
                  className={cn("h-1", getMacroStatus("carbs") === "success" && "bg-amber-300")}
                />
                <div className="text-xs mt-1">
                  {carbsTargetPct}% de l'objectif
                </div>
                
                {getMacroStatus("carbs") === "success" && (
                  <Star className="absolute top-1 right-1 h-4 w-4 text-amber-600 fill-amber-600" />
                )}
              </>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-lg transition-all relative",
            getMacroStatusClasses("fat", "bg"),
            getMacroStatusClasses("fat", "text")
          )}>
            <div className="font-medium">Lipides</div>
            <div className="text-xl font-bold">{dayLog.totalMacros.fat}g</div>
            <div className="text-xs mb-1">{macroPercentages.fat}%</div>
            
            {goals.macros?.fat && (
              <>
                <Progress
                  value={fatTargetPct}
                  className={cn("h-1", getMacroStatus("fat") === "success" && "bg-rose-300")}
                />
                <div className="text-xs mt-1">
                  {fatTargetPct}% de l'objectif
                </div>
                
                {getMacroStatus("fat") === "success" && (
                  <Star className="absolute top-1 right-1 h-4 w-4 text-rose-600 fill-rose-600" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Food entries */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Repas ou aliments</h2>
          
          <Badge variant="outline">
            {dayLog.foodEntries.length} {dayLog.foodEntries.length > 1 ? 'éléments' : 'élément'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <GeminiInputForm onAdd={refreshData} />
          <QuickAddForm onAdd={refreshData} />
        </div>
        
        <Separator className="my-4" />
        
        {dayLog.foodEntries.length > 0 ? (
          <div className="space-y-3">
            {dayLog.foodEntries.map((entry) => (
              <div key={entry.id}>
                <div 
                  className="cursor-pointer" 
                  onClick={() => entry.geminiData && toggleEntryDetails(entry.id)}
                >
                  <FoodEntry 
                    entry={entry} 
                    onDelete={refreshData}
                    hasDetails={!!entry.geminiData} 
                    isExpanded={expandedEntryId === entry.id}
                    totalDailyCalories={dayLog.totalCalories}
                  />
                </div>
                {expandedEntryId === entry.id && entry.geminiData && (
                  <Card className="mt-2 mb-4 p-3 bg-slate-50">
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-xs text-slate-500">Prompt :</strong>
                        <p className="text-slate-700 mt-1">{entry.geminiData.prompt}</p>
                      </div>
                      <Separator className="my-2" />
                      <div>
                        <strong className="text-xs text-slate-500">Réponse Gemini :</strong>
                        <pre className="text-xs bg-slate-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(entry.geminiData.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun repas ou aliment enregistré ce jour</p>
            <p className="text-sm">Utilisez le formulaire ci-dessus pour ajouter des repas ou aliments</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CaloriesTab;
