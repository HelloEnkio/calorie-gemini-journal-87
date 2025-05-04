
import { useState, useEffect } from "react";
import CalorieGoalCard from "@/components/settings/CalorieGoalCard";
import MacrosDistributionCard from "@/components/settings/MacrosDistributionCard";
import GeminiApiKeyForm from "@/components/settings/GeminiApiKeyForm";
import { getUserGoals, saveUserGoals } from "@/utils/storage/goals";
import { toast } from "sonner";

const SettingsPage = () => {
  // Get the user goals from storage
  const [dailyCalories, setDailyCalories] = useState<string>("2000");
  const [proteinPercentage, setProteinPercentage] = useState<number>(25);
  const [carbsPercentage, setCarbsPercentage] = useState<number>(45);
  const [fatPercentage, setFatPercentage] = useState<number>(30);
  
  // Calculate macro grams based on percentages and calories
  const proteinGrams = Math.round((Number(dailyCalories) * (proteinPercentage / 100)) / 4);
  const carbsGrams = Math.round((Number(dailyCalories) * (carbsPercentage / 100)) / 4);
  const fatGrams = Math.round((Number(dailyCalories) * (fatPercentage / 100)) / 9);

  // Load user goals from storage on component mount
  useEffect(() => {
    const userGoals = getUserGoals();
    setDailyCalories(userGoals.dailyCalories.toString());
    
    if (userGoals.macroPercentages) {
      setProteinPercentage(userGoals.macroPercentages.protein);
      setCarbsPercentage(userGoals.macroPercentages.carbs);
      setFatPercentage(userGoals.macroPercentages.fat);
    }
  }, []);

  // Save updated goals when values change
  useEffect(() => {
    // Ensure percentages add up to 100%
    const totalPercentage = proteinPercentage + carbsPercentage + fatPercentage;
    if (totalPercentage !== 100) return;

    // Save to storage
    const userGoals = {
      dailyCalories: Number(dailyCalories),
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams,
      },
      macroPercentages: {
        protein: proteinPercentage,
        carbs: carbsPercentage,
        fat: fatPercentage,
      }
    };
    
    saveUserGoals(userGoals);
  }, [dailyCalories, proteinPercentage, carbsPercentage, fatPercentage, proteinGrams, carbsGrams, fatGrams]);

  // Handler for calories change
  const handleCaloriesChange = (value: string) => {
    setDailyCalories(value);
  };

  // Handlers for macro percentage changes
  const handleProteinChange = (value: number[]) => {
    const newProtein = value[0];
    
    // Calculate the diff and distribute it between carbs and fat proportionally
    const diff = newProtein - proteinPercentage;
    const carbsToFatRatio = carbsPercentage / (carbsPercentage + fatPercentage);
    
    setCarbsPercentage(Math.round(carbsPercentage - (diff * carbsToFatRatio)));
    setFatPercentage(Math.round(100 - newProtein - (carbsPercentage - (diff * carbsToFatRatio))));
    setProteinPercentage(newProtein);
    
    toast.info("Distribution des macros mise à jour");
  };
  
  const handleCarbsChange = (value: number[]) => {
    const newCarbs = value[0];
    
    // Calculate the diff and distribute it between protein and fat proportionally
    const diff = newCarbs - carbsPercentage;
    const proteinToFatRatio = proteinPercentage / (proteinPercentage + fatPercentage);
    
    setProteinPercentage(Math.round(proteinPercentage - (diff * proteinToFatRatio)));
    setFatPercentage(Math.round(100 - newCarbs - (proteinPercentage - (diff * proteinToFatRatio))));
    setCarbsPercentage(newCarbs);
    
    toast.info("Distribution des macros mise à jour");
  };
  
  const handleFatChange = (value: number[]) => {
    const newFat = value[0];
    
    // Calculate the diff and distribute it between protein and carbs proportionally
    const diff = newFat - fatPercentage;
    const proteinToCarbsRatio = proteinPercentage / (proteinPercentage + carbsPercentage);
    
    setProteinPercentage(Math.round(proteinPercentage - (diff * proteinToCarbsRatio)));
    setCarbsPercentage(Math.round(100 - newFat - (proteinPercentage - (diff * proteinToCarbsRatio))));
    setFatPercentage(newFat);
    
    toast.info("Distribution des macros mise à jour");
  };

  return (
    <div className="mobile-container pt-4 pb-20 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      
      <CalorieGoalCard 
        dailyCalories={dailyCalories}
        onCaloriesChange={handleCaloriesChange}
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
      
      <GeminiApiKeyForm />
    </div>
  );
};

export default SettingsPage;
