
import { DailyLog, FoodEntry, WeightEntry, WorkoutEntry, MacroNutrients } from "@/types";
import { generateId } from "./storage/core";
import { format, subDays } from "date-fns";
import { createColoredImageBase64, createMockWeightImages } from "./imageStorage";

// Fonction pour générer une entrée alimentaire aléatoire
const generateRandomFoodEntry = (date: Date): FoodEntry => {
  const foods = [
    { name: "Salade César au poulet", calories: 350, protein: 25, carbs: 10, fat: 25 },
    { name: "Steak et légumes", calories: 450, protein: 35, carbs: 15, fat: 20 },
    { name: "Yaourt grec et fruits", calories: 180, protein: 15, carbs: 20, fat: 5 },
    { name: "Pizza margherita", calories: 680, protein: 24, carbs: 80, fat: 28 },
    { name: "Smoothie protéiné", calories: 220, protein: 20, carbs: 25, fat: 3 },
    { name: "Omelette aux légumes", calories: 280, protein: 18, carbs: 5, fat: 22 },
    { name: "Sandwich au thon", calories: 320, protein: 22, carbs: 35, fat: 12 },
    { name: "Bol de quinoa aux légumes", calories: 380, protein: 12, carbs: 60, fat: 8 },
    { name: "Saumon grillé", calories: 300, protein: 28, carbs: 0, fat: 19 },
    { name: "Bol de fruits", calories: 120, protein: 1, carbs: 30, fat: 0 },
  ];

  const randomFood = foods[Math.floor(Math.random() * foods.length)];

  return {
    id: generateId(),
    name: randomFood.name,
    calories: randomFood.calories,
    macros: {
      protein: randomFood.protein,
      carbs: randomFood.carbs,
      fat: randomFood.fat,
    },
    timestamp: new Date(date).toISOString(),
  };
};

// Fonction pour générer une entrée de poids aléatoire
const generateRandomWeightEntry = (date: Date, baseWeight: number, dayIndex: number): WeightEntry | null => {
  // On génère plus régulièrement des poids pour avoir plus de points de données
  if (dayIndex % Math.floor(Math.random() * 2 + 1) !== 0) {
    return null;
  }

  // Légère fluctuation du poids (-0.5 à +0.3)
  const fluctuation = Math.random() * 0.8 - 0.5;
  const weight = baseWeight + fluctuation;

  // Ajoutons des photos pour plus d'entrées de poids
  let photoUrl: string | undefined = undefined;
  
  // Pour les intervalles de 7 jours, ajoutons une photo
  // Pour les autres jours, 30% de chance d'avoir une photo
  if (dayIndex === 0 || dayIndex === 7 || dayIndex === 14 || dayIndex === 21 || 
      dayIndex === 28 || dayIndex === 35 || dayIndex === 42 || dayIndex === 49 || 
      (Math.random() > 0.7)) {
    // Format standard pour les photos
    photoUrl = `weight-photo-day-${dayIndex}.png`;
  }

  return {
    id: generateId(),
    weight: parseFloat(weight.toFixed(1)),
    timestamp: new Date(date).toISOString(),
    photoUrl
  };
};

// Fonction pour générer une entrée d'entraînement aléatoire
const generateRandomWorkoutEntry = (date: Date): WorkoutEntry | null => {
  // 40% de chance d'avoir un entraînement ce jour-là
  if (Math.random() > 0.4) {
    return null;
  }

  const workouts = [
    { type: "Course", duration: 30, calories: 300 },
    { type: "Musculation", duration: 45, calories: 280 },
    { type: "Natation", duration: 40, calories: 350 },
    { type: "Vélo", duration: 60, calories: 400 },
    { type: "Yoga", duration: 30, calories: 180 },
    { type: "Marche", duration: 50, calories: 200 },
    { type: "HIIT", duration: 20, calories: 250 },
  ];

  const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];

  // Légère variation de la durée et des calories
  const durationVariation = Math.floor(Math.random() * 11) - 5; // -5 à +5 minutes
  const caloriesVariation = Math.floor(Math.random() * 41) - 20; // -20 à +20 calories

  return {
    id: generateId(),
    type: randomWorkout.type,
    duration: randomWorkout.duration + durationVariation,
    caloriesBurned: randomWorkout.calories + caloriesVariation,
    timestamp: new Date(date).toISOString(),
  };
};

// Générer un log quotidien avec des valeurs aléatoires
const generateDailyLog = (date: Date, baseWeight: number, dayIndex: number): DailyLog => {
  // Générer 2 à 4 entrées alimentaires par jour
  const numFoodEntries = Math.floor(Math.random() * 3) + 2;
  const foodEntries: FoodEntry[] = [];
  
  for (let i = 0; i < numFoodEntries; i++) {
    foodEntries.push(generateRandomFoodEntry(date));
  }

  // Calculer les totaux pour la journée
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.macros.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.macros.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.macros.fat, 0);

  // Générer les entraînements
  const workoutEntry = generateRandomWorkoutEntry(date);
  const workouts = workoutEntry ? [workoutEntry] : [];
  
  // 10% de chance d'avoir un deuxième entraînement le même jour
  if (workoutEntry && Math.random() > 0.9) {
    const secondWorkout = generateRandomWorkoutEntry(date);
    if (secondWorkout) {
      workouts.push(secondWorkout);
    }
  }

  // Générer l'entrée de poids (peut être null)
  const weightEntry = generateRandomWeightEntry(date, baseWeight, dayIndex);

  return {
    date: format(date, "yyyy-MM-dd"),
    foodEntries,
    totalCalories,
    totalMacros: {
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    } as MacroNutrients,
    workouts,
    weight: weightEntry,
  };
};

export const initializeMockData = () => {
  console.info("Initializing mock data...");
  
  // Vérifier si des données existent déjà
  const existingData = localStorage.getItem("nutrition-tracker-daily-logs");
  if (existingData) {
    const parsedData = JSON.parse(existingData);
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      console.info("Mock data already exists, skipping initialization");
      return;
    }
  }

  const today = new Date();
  const mockLogs: DailyLog[] = [];
  
  // Poids de départ (légèrement aléatoire entre 70 et 80 kg)
  const startingWeight = 70 + Math.random() * 10;
  
  // Générer des données pour les 60 derniers jours (au lieu de 30) pour avoir plus de données
  for (let i = 59; i >= 0; i--) {
    const date = subDays(today, i);
    // Réduire légèrement le poids au fil du temps (tendance à la perte)
    const adjustedBaseWeight = startingWeight - (i * 0.07);
    
    const dailyLog = generateDailyLog(date, adjustedBaseWeight, i);
    mockLogs.push(dailyLog);
  }
  
  // Enregistrer les données dans le localStorage
  localStorage.setItem("nutrition-tracker-daily-logs", JSON.stringify(mockLogs));
  console.info("Mock data initialization complete with extended history data");
};

// Création des images factices
export { createMockWeightImages };
