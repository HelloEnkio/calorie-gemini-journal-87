
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { SaveIcon } from "lucide-react";
import { getUserGoals, saveUserGoals } from "@/utils/storage";
import { toast } from "sonner";

const SettingsPage = () => {
  const [dailyCalories, setDailyCalories] = useState<string>("2000");
  
  // Macros percentage distribution
  const [proteinPercentage, setProteinPercentage] = useState<number>(25);
  const [carbsPercentage, setCarbsPercentage] = useState<number>(45);
  const [fatPercentage, setFatPercentage] = useState<number>(30);
  
  // Computed macro values in grams
  const [proteinGrams, setProteinGrams] = useState<number>(125);
  const [carbsGrams, setCarbsGrams] = useState<number>(225);
  const [fatGrams, setFatGrams] = useState<number>(66);
  
  // Load user settings on component mount
  useEffect(() => {
    const goals = getUserGoals();
    setDailyCalories(goals.dailyCalories.toString());
    
    if (goals.macroPercentages) {
      setProteinPercentage(goals.macroPercentages.protein);
      setCarbsPercentage(goals.macroPercentages.carbs);
      setFatPercentage(goals.macroPercentages.fat);
    }
    
    if (goals.macros) {
      setProteinGrams(goals.macros.protein);
      setCarbsGrams(goals.macros.carbs);
      setFatGrams(goals.macros.fat);
    }
  }, []);
  
  // Calculate macro grams when percentages or calories change
  useEffect(() => {
    const calories = parseInt(dailyCalories) || 2000;
    
    // Protein: 4 calories per gram
    const protein = Math.round((calories * proteinPercentage / 100) / 4);
    
    // Carbs: 4 calories per gram
    const carbs = Math.round((calories * carbsPercentage / 100) / 4);
    
    // Fat: 9 calories per gram
    const fat = Math.round((calories * fatPercentage / 100) / 9);
    
    setProteinGrams(protein);
    setCarbsGrams(carbs);
    setFatGrams(fat);
  }, [dailyCalories, proteinPercentage, carbsPercentage, fatPercentage]);
  
  // Adjust other percentages when one changes to maintain 100% total
  const handleProteinChange = (value: number[]) => {
    const newProtein = value[0];
    const diff = newProtein - proteinPercentage;
    
    // Distribute the difference proportionally between carbs and fat
    const totalOther = carbsPercentage + fatPercentage;
    const newCarbs = Math.round(carbsPercentage - (diff * carbsPercentage / totalOther));
    const newFat = 100 - newProtein - newCarbs;
    
    setProteinPercentage(newProtein);
    setCarbsPercentage(newCarbs);
    setFatPercentage(newFat);
  };
  
  const handleCarbsChange = (value: number[]) => {
    const newCarbs = value[0];
    const diff = newCarbs - carbsPercentage;
    
    // Distribute the difference proportionally between protein and fat
    const totalOther = proteinPercentage + fatPercentage;
    const newProtein = Math.round(proteinPercentage - (diff * proteinPercentage / totalOther));
    const newFat = 100 - newProtein - newCarbs;
    
    setProteinPercentage(newProtein);
    setCarbsPercentage(newCarbs);
    setFatPercentage(newFat);
  };
  
  const handleFatChange = (value: number[]) => {
    const newFat = value[0];
    const diff = newFat - fatPercentage;
    
    // Distribute the difference proportionally between protein and carbs
    const totalOther = proteinPercentage + carbsPercentage;
    const newProtein = Math.round(proteinPercentage - (diff * proteinPercentage / totalOther));
    const newCarbs = 100 - newProtein - newFat;
    
    setProteinPercentage(newProtein);
    setCarbsPercentage(newCarbs);
    setFatPercentage(newFat);
  };
  
  const handleSaveSettings = () => {
    const caloriesValue = parseInt(dailyCalories) || 2000;
    
    saveUserGoals({
      dailyCalories: caloriesValue,
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams
      },
      macroPercentages: {
        protein: proteinPercentage,
        carbs: carbsPercentage,
        fat: fatPercentage
      }
    });
    
    toast.success("Paramètres enregistrés");
  };

  return (
    <div className="mobile-container pt-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Objectifs caloriques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily-calories">Calories quotidiennes</Label>
              <Input
                id="daily-calories"
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Répartition des macronutriments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Protéines ({proteinPercentage}%)</Label>
                <span className="font-medium">{proteinGrams}g</span>
              </div>
              <Slider
                value={[proteinPercentage]}
                min={10}
                max={50}
                step={1}
                onValueChange={handleProteinChange}
                className="bg-teal-100"
              />
              
              <div className="flex justify-between">
                <Label>Glucides ({carbsPercentage}%)</Label>
                <span className="font-medium">{carbsGrams}g</span>
              </div>
              <Slider
                value={[carbsPercentage]}
                min={10}
                max={60}
                step={1}
                onValueChange={handleCarbsChange}
                className="bg-amber-100"
              />
              
              <div className="flex justify-between">
                <Label>Lipides ({fatPercentage}%)</Label>
                <span className="font-medium">{fatGrams}g</span>
              </div>
              <Slider
                value={[fatPercentage]}
                min={10}
                max={50}
                step={1}
                onValueChange={handleFatChange}
                className="bg-rose-100"
              />
            </div>
            
            <div className="flex h-6 w-full overflow-hidden rounded-full">
              <div 
                className="bg-teal-500" 
                style={{ width: `${proteinPercentage}%` }}
              ></div>
              <div 
                className="bg-amber-500" 
                style={{ width: `${carbsPercentage}%` }}
              ></div>
              <div 
                className="bg-rose-500" 
                style={{ width: `${fatPercentage}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Distribution calorique recommandée:</p>
              <ul className="list-disc pl-5">
                <li>Protéines: 10-35%</li>
                <li>Glucides: 45-65%</li>
                <li>Lipides: 20-35%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleSaveSettings} className="w-full">
        <SaveIcon className="mr-2 h-4 w-4" />
        Enregistrer les paramètres
      </Button>
    </div>
  );
};

export default SettingsPage;
