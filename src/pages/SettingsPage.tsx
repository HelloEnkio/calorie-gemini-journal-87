
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { getUserGoals, saveUserGoals } from "@/utils/storage";
import { toast } from "sonner";
import CalorieGoalCard from "@/components/settings/CalorieGoalCard";
import MacrosDistributionCard from "@/components/settings/MacrosDistributionCard";

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
      
      <CalorieGoalCard 
        dailyCalories={dailyCalories} 
        onCaloriesChange={setDailyCalories} 
      />
      
      <MacrosDistributionCard 
        dailyCalories={dailyCalories}
        proteinPercentage={proteinPercentage}
        carbsPercentage={carbsPercentage}
        fatPercentage={fatPercentage}
        proteinGrams={proteinGrams}
        carbsGrams={carbsGrams}
        fatGrams={fatGrams}
        onProteinChange={handleProteinChange}
        onCarbsChange={handleCarbsChange}
        onFatChange={handleFatChange}
      />
      
      <Button onClick={handleSaveSettings} className="w-full">
        <SaveIcon className="mr-2 h-4 w-4" />
        Enregistrer les paramètres
      </Button>
    </div>
  );
};

export default SettingsPage;
