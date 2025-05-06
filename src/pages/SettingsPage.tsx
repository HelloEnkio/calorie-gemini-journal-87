
import { useState, useEffect, useCallback } from "react";
import { getUserGoals, saveUserGoals } from "@/utils/storage";
import CalorieGoalCard from "@/components/settings/CalorieGoalCard";
import MacrosDistributionCard from "@/components/settings/MacrosDistributionCard";
import GeminiApiKeyForm from "@/components/settings/GeminiApiKeyForm";
import HabitsSettingsCard from "@/components/settings/HabitsSettingsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SettingsPage = () => {
  const [dailyCalories, setDailyCalories] = useState("2000");
  const [proteinPercentage, setProteinPercentage] = useState(30);
  const [carbsPercentage, setCarbsPercentage] = useState(45);
  const [fatPercentage, setFatPercentage] = useState(25);
  
  // Calculer les grammes de macros en fonction des calories et des pourcentages
  const proteinGrams = Math.round((Number(dailyCalories) * proteinPercentage / 100) / 4);
  const carbsGrams = Math.round((Number(dailyCalories) * carbsPercentage / 100) / 4);
  const fatGrams = Math.round((Number(dailyCalories) * fatPercentage / 100) / 9);
  
  // Charger les objectifs utilisateur
  const loadGoals = useCallback(() => {
    const goals = getUserGoals();
    setDailyCalories(goals.dailyCalories.toString());
    
    if (goals.macros) {
      // Calculer les pourcentages en fonction des grammes et des calories
      const totalCals = goals.dailyCalories;
      const proteinCals = (goals.macros.protein || 0) * 4;
      const carbsCals = (goals.macros.carbs || 0) * 4;
      const fatCals = (goals.macros.fat || 0) * 9;
      
      setProteinPercentage(Math.round((proteinCals / totalCals) * 100) || 30);
      setCarbsPercentage(Math.round((carbsCals / totalCals) * 100) || 45);
      setFatPercentage(Math.round((fatCals / totalCals) * 100) || 25);
    }
  }, []);
  
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);
  
  // Mettre à jour les objectifs utilisateur
  const updateGoals = () => {
    saveUserGoals({
      dailyCalories: Number(dailyCalories),
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams,
      },
    });
    
    toast.success("Objectifs mis à jour avec succès");
  };
  
  // Gérer les changements de pourcentages de macros
  const handleProteinChange = (values: number[]) => {
    const newProteinPct = values[0];
    const diff = newProteinPct - proteinPercentage;
    
    // Ajuster les autres pourcentages proportionnellement
    const carbsFactor = carbsPercentage / (carbsPercentage + fatPercentage);
    const newCarbsPct = Math.max(10, Math.round(carbsPercentage - (diff * carbsFactor)));
    const newFatPct = 100 - newProteinPct - newCarbsPct;
    
    setProteinPercentage(newProteinPct);
    setCarbsPercentage(newCarbsPct);
    setFatPercentage(newFatPct);
  };
  
  const handleCarbsChange = (values: number[]) => {
    const newCarbsPct = values[0];
    const diff = newCarbsPct - carbsPercentage;
    
    // Ajuster les autres pourcentages proportionnellement
    const proteinFactor = proteinPercentage / (proteinPercentage + fatPercentage);
    const newProteinPct = Math.max(10, Math.round(proteinPercentage - (diff * proteinFactor)));
    const newFatPct = 100 - newProteinPct - newCarbsPct;
    
    setProteinPercentage(newProteinPct);
    setCarbsPercentage(newCarbsPct);
    setFatPercentage(newFatPct);
  };
  
  const handleFatChange = (values: number[]) => {
    const newFatPct = values[0];
    const diff = newFatPct - fatPercentage;
    
    // Ajuster les autres pourcentages proportionnellement
    const proteinFactor = proteinPercentage / (proteinPercentage + carbsPercentage);
    const newProteinPct = Math.max(10, Math.round(proteinPercentage - (diff * proteinFactor)));
    const newCarbsPct = 100 - newProteinPct - newFatPct;
    
    setProteinPercentage(newProteinPct);
    setCarbsPercentage(newCarbsPct);
    setFatPercentage(newFatPct);
  };
  
  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
        <p className="text-muted-foreground">Configurez l'application selon vos besoins</p>
      </div>
      
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
      
      <HabitsSettingsCard />
      
      <GeminiApiKeyForm />
      
      <div className="mt-6 text-center">
        <Button onClick={updateGoals}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
