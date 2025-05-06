
import { generateId } from "./storage/core";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

// Fonction pour générer des données aléatoires pour les logs quotidiens
export const initializeMockData = () => {
  // Générer des données pour les 30 derniers jours
  const logs = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    
    // Variation des calories selon les jours
    const calorieVariation = Math.random() > 0.7 ? 
      Math.floor((Math.random() * 600) - 300) : 
      Math.floor((Math.random() * 200) - 100);
    
    const totalCalories = 2100 + calorieVariation;
    
    // Variation des macros
    const proteinPercent = 0.25 + (Math.random() * 0.1);
    const carbsPercent = 0.5 + (Math.random() * 0.15);
    const fatPercent = 1 - proteinPercent - carbsPercent;
    
    const protein = Math.round((totalCalories * proteinPercent) / 4);
    const carbs = Math.round((totalCalories * carbsPercent) / 4);
    const fat = Math.round((totalCalories * fatPercent) / 9);
    
    // Générer des repas pour ce jour
    const foodEntries = generateMealsForDay(date, totalCalories, { protein, carbs, fat });
    
    // Générer des entraînements pour certains jours (seulement 3 jours par semaine)
    const workouts = (i % 2 === 0 || i % 5 === 0) ? 
      [generateWorkout(date)] : [];
    
    // Générer des habitudes pour ce jour
    const habits = {};
    if (i % 2 === 0) {
      habits["habit1"] = {
        id: generateId(),
        habitId: "habit1",
        completed: true,
        timestamp: date.toISOString()
      };
    }
    if (i % 3 === 0) {
      habits["habit2"] = {
        id: generateId(),
        habitId: "habit2",
        completed: true,
        timestamp: date.toISOString()
      };
    }
    
    // Ajouter la mesure du poids tous les 3 jours
    let weight = null;
    if (i % 3 === 0) {
      // Simuler une perte de poids progressive
      const baseWeight = 85.0;
      const weightLoss = (i / 30) * 2.5; // 2.5kg sur 30 jours
      
      weight = {
        id: generateId(),
        weight: Math.round((baseWeight - weightLoss) * 10) / 10,
        timestamp: date.toISOString(),
        notes: "Poids mesuré le matin",
        photoUrl: i <= 3 ? `weight-photo-day-${i}.png` : undefined
      };
    }
    
    // Créer l'entrée de journal pour ce jour
    logs.push({
      date: dateKey,
      totalCalories,
      totalMacros: {
        protein,
        carbs,
        fat
      },
      foodEntries,
      workouts,
      weight,
      habits
    });
  }
  
  // Sauvegarder dans le localStorage
  localStorage.setItem("nutrition-tracker-daily-logs", JSON.stringify(logs));
  
  // Sauvegarder les objectifs
  const goals = {
    dailyCalories: 2100,
    macros: {
      protein: 131,
      carbs: 263,
      fat: 58
    }
  };
  
  localStorage.setItem("nutrition-tracker-goals", JSON.stringify(goals));
  
  // Sauvegarder les habitudes
  const habits = [
    {
      id: "habit1",
      name: "Boire 2L d'eau",
      description: "Rester hydraté tout au long de la journée",
      icon: "💧",
      color: "blue",
      frequency: "daily",
      streak: 12,
      active: true,
      createdAt: subDays(today, 45).toISOString()
    },
    {
      id: "habit2",
      name: "Méditation",
      description: "15 minutes de méditation le matin",
      icon: "🧘",
      color: "purple",
      frequency: "daily",
      streak: 5,
      active: true,
      createdAt: subDays(today, 30).toISOString()
    },
    {
      id: "habit3",
      name: "Marche",
      description: "Faire au moins 8000 pas",
      icon: "👣",
      color: "green",
      frequency: "daily",
      streak: 0,
      active: true,
      createdAt: subDays(today, 15).toISOString()
    }
  ];
  
  localStorage.setItem("nutrition-tracker-habits", JSON.stringify(habits));
};

// Fonction pour générer des repas pour un jour
const generateMealsForDay = (date, totalCalories, macros) => {
  const meals = [];
  let remainingCalories = totalCalories;
  let remainingMacros = { ...macros };
  
  // Petit déjeuner (environ 25% des calories)
  const breakfastCal = Math.round(totalCalories * 0.25);
  const breakfast = generateMeal("Petit déjeuner", breakfastCal, date, {
    protein: Math.round(macros.protein * 0.25),
    carbs: Math.round(macros.carbs * 0.3),
    fat: Math.round(macros.fat * 0.2)
  });
  meals.push(breakfast);
  remainingCalories -= breakfast.calories;
  
  // Déjeuner (environ 35% des calories)
  const lunchCal = Math.round(totalCalories * 0.35);
  const lunch = generateMeal("Déjeuner", lunchCal, date, {
    protein: Math.round(macros.protein * 0.35),
    carbs: Math.round(macros.carbs * 0.35),
    fat: Math.round(macros.fat * 0.35)
  });
  meals.push(lunch);
  remainingCalories -= lunch.calories;
  
  // Dîner (environ le reste)
  const dinner = generateMeal("Dîner", remainingCalories, date, {
    protein: macros.protein - Math.round(macros.protein * 0.25) - Math.round(macros.protein * 0.35),
    carbs: macros.carbs - Math.round(macros.carbs * 0.3) - Math.round(macros.carbs * 0.35),
    fat: macros.fat - Math.round(macros.fat * 0.2) - Math.round(macros.fat * 0.35)
  });
  meals.push(dinner);
  
  return meals;
};

// Fonction pour générer un repas
const generateMeal = (name, calories, date, macros) => {
  // Pour simuler le fait que certains repas ont des données Gemini et d'autres non
  const hasGeminiData = Math.random() > 0.5;
  
  const hours = name === "Petit déjeuner" ? 8 : name === "Déjeuner" ? 12 : 19;
  const timestamp = new Date(date);
  timestamp.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  
  return {
    id: generateId(),
    name,
    calories,
    macros,
    timestamp: timestamp.toISOString(),
    geminiData: hasGeminiData ? {
      ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
      category: "healthy",
      healthScore: Math.floor(Math.random() * 100),
      suggestions: ["Suggestion 1", "Suggestion 2"],
      prompt: `Analyze the nutritional value of ${name}`,
      response: { 
        analysis: "This meal is well balanced",
        score: Math.floor(Math.random() * 100),
        tips: ["Tip 1", "Tip 2"]
      }
    } : undefined
  };
};

// Fonction pour générer un entraînement
const generateWorkout = (date) => {
  const workoutTypes = [
    "Course à pied",
    "Vélo",
    "Natation",
    "Musculation",
    "HIIT",
    "Yoga",
    "Marche rapide"
  ];
  
  const randomType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
  const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
  const caloriesBurned = Math.floor(duration * (Math.random() * 5 + 5)); // 5-10 calories par minute
  
  const hours = 17 + Math.floor(Math.random() * 4); // Entre 17h et 21h
  const timestamp = new Date(date);
  timestamp.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  
  return {
    id: generateId(),
    name: randomType,
    type: randomType.toLowerCase(),
    duration,
    caloriesBurned,
    timestamp: timestamp.toISOString(),
    notes: Math.random() > 0.7 ? "Bonne séance !" : undefined
  };
};

// Générer les images pour les photos de poids
export const createMockWeightImages = () => {
  // Normalement nous générerions des vraies images, mais pour ce mock,
  // nous allons juste stocker des références d'URL dans localStorage
  for (let i = 0; i < 4; i++) {
    const key = `nutrition-tracker-image-weight-photo-day-${i}.png`;
    localStorage.setItem(key, `weight-photo-day-${i}.png`);
  }
};
