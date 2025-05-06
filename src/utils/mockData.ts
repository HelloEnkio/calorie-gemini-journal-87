
import { FoodEntry, DailyLog, WorkoutEntry, WeightEntry } from "@/types";
import { addDays, subDays, format } from "date-fns";
import { initializeDefaultHabits } from "./habitsStorage";

// Générer un ID aléatoire
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Initialiser les données pour une démo
export const initializeMockData = () => {
  // Vérifier si les données sont déjà présentes
  const logsDataExists = localStorage.getItem('nutrition-tracker-daily-logs');
  
  if (logsDataExists) {
    return; // Ne pas recréer les données si elles existent déjà
  }
  
  // Créer le tableau qui contiendra nos journées
  const dailyLogs: DailyLog[] = [];
  
  // Date d'aujourd'hui
  const today = new Date();
  
  // Générer des données pour les 14 derniers jours
  for (let i = 0; i < 14; i++) {
    const currentDate = subDays(today, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Calories et macros variables selon le jour
    const baseCals = 2000;
    const variation = Math.random() * 400 - 200; // +/- 200 kcal
    const totalCals = Math.round(baseCals + variation);

    // Créer un log pour cette journée
    const dailyLog: DailyLog = {
      date: formattedDate,
      totalCalories: totalCals,
      totalMacros: {
        protein: Math.round((totalCals * 0.3) / 4), // 30% des calories en protéines
        carbs: Math.round((totalCals * 0.45) / 4),  // 45% des calories en glucides
        fat: Math.round((totalCals * 0.25) / 9),    // 25% des calories en lipides
      },
      foodEntries: generateMockFoodEntries(formattedDate, totalCals),
      workouts: generateMockWorkouts(formattedDate, i),
      habits: {}
    };
    
    // Ajouter une entrée de poids tous les 3 jours
    if (i % 3 === 0) {
      // Simuler une légère perte de poids au fil du temps
      const baseWeight = 75;
      const weightLoss = (i / 30) * 2; // 2kg de perte sur 30 jours
      
      dailyLog.weight = {
        weight: parseFloat((baseWeight - weightLoss).toFixed(1)),
        timestamp: new Date(formattedDate).toISOString(),
        notes: i === 0 ? "Je me sens bien aujourd'hui !" : undefined,
        photoUrl: i === 0 ? `image-weight-photo-day-0.png` : `image-weight-photo-day-${i}.png`,
      };
    }
    
    dailyLogs.push(dailyLog);
  }
  
  // Enregistrer les données dans le localStorage
  localStorage.setItem('nutrition-tracker-daily-logs', JSON.stringify(dailyLogs));
  
  // Initialiser les objectifs utilisateur
  const goals = {
    dailyCalories: 2000,
    macros: {
      protein: 150,
      carbs: 225,
      fat: 55
    }
  };
  localStorage.setItem('nutrition-tracker-goals', JSON.stringify(goals));
  
  // Initialiser les habitudes par défaut
  initializeDefaultHabits();
};

// Générer des entrées de nourriture fictives
const generateMockFoodEntries = (date: string, totalCals: number): FoodEntry[] => {
  const entries: FoodEntry[] = [];
  const meals = [
    { name: "Petit-déjeuner", ratio: 0.25 },
    { name: "Déjeuner", ratio: 0.4 },
    { name: "Dîner", ratio: 0.35 }
  ];
  
  meals.forEach(meal => {
    const mealCals = Math.round(totalCals * meal.ratio);
    
    entries.push({
      id: generateId(),
      name: meal.name,
      calories: mealCals,
      macros: {
        protein: Math.round((mealCals * 0.3) / 4),
        carbs: Math.round((mealCals * 0.45) / 4),
        fat: Math.round((mealCals * 0.25) / 9),
      },
      timestamp: new Date(date).toISOString(),
      weight: Math.round(mealCals * 0.8) // Approximation du poids du repas
    });
  });
  
  return entries;
};

// Générer des entraînements fictifs
const generateMockWorkouts = (date: string, dayIndex: number): WorkoutEntry[] => {
  if (dayIndex % 2 !== 0) return []; // Séance tous les deux jours
  
  const workoutTypes = [
    "Course à pied",
    "Musculation",
    "Natation",
    "Vélo",
    "HIIT"
  ];
  
  const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
  const duration = Math.floor(Math.random() * 45) + 30; // 30 à 75 minutes
  const caloriesBurned = Math.floor(duration * 8); // Approx. 8 kcal/minute
  
  return [
    {
      id: generateId(),
      type: workoutType,
      duration: duration,
      caloriesBurned: caloriesBurned,
      timestamp: new Date(date).toISOString(),
      notes: workoutType === "Musculation" ? "Focus sur le haut du corps" : undefined
    }
  ];
};

// Créer des images factices pour les photos de poids
export const createMockWeightImages = () => {
  // Simuler des images stockées (dans une application réelle, cela viendrait du serveur)
  const today = new Date();
  
  // Créer les entrées pour chaque jour à intervalles réguliers
  for (let i = 0; i <= 13; i += 3) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Dans une vraie application, nous téléchargerions des images
    // Ici, nous simulons que les images existent déjà
    localStorage.setItem(`nutrition-tracker-image-weight-photo-day-${i}.png`, `data:image/png;base64,pretendThisIsAnImage-${formattedDate}`);
  }
};
