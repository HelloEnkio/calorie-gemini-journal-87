
import { FoodEntry, MacroNutrients, WeightEntry } from "@/types";
import { addDays, subDays, format } from "date-fns";
import { initFoodDatabase } from "./foodDatabase";

// Fonction pour initialiser les données factices
export const initializeMockData = () => {
  // Initialiser la base de données alimentaire
  initFoodDatabase();
  
  // Créer des entrées pour les 7 derniers jours
  const today = new Date();
  
  // Assurons-nous que les données sont stockées dans le localStorage
  const dailyLogData: Record<string, any> = {};
  
  // Journal sur les 7 derniers jours (avec variations aléatoires)
  for (let i = 0; i < 7; i++) {
    const currentDate = subDays(today, i);
    const dateKey = format(currentDate, "yyyy-MM-dd");
    
    // Calculer des valeurs pour ce jour (avec variation aléatoire)
    const variationFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
    
    // Entrées alimentaires pour ce jour
    const todaysFoodEntries: FoodEntry[] = generateRandomFoodEntries(currentDate, Math.floor(3 + Math.random() * 3));
    
    // Calculer les totaux
    const totals = calculateTotals(todaysFoodEntries);
    
    // Simuler quelques jours avec poids enregistré
    const weightEntry = i % 2 === 0 ? generateRandomWeightEntry(currentDate, 75 - i * 0.2) : undefined;
    
    // Créer le journal quotidien
    dailyLogData[dateKey] = {
      date: dateKey,
      foodEntries: todaysFoodEntries,
      totalCalories: totals.calories,
      totalMacros: totals.macros,
      weight: weightEntry,
      workouts: [],
      habits: {
        "habit-1": { completed: i % 2 === 0, timestamp: currentDate.toISOString() },
        "habit-2": { completed: i % 3 === 0, timestamp: currentDate.toISOString() },
        "habit-3": { completed: i % 4 === 0, timestamp: currentDate.toISOString() }
      }
    };
  }
  
  // Enregistrer les données dans le localStorage
  localStorage.setItem("nutrition-tracker-daily-logs", JSON.stringify(dailyLogData));
};

// Générer des entrées alimentaires aléatoires
const generateRandomFoodEntries = (date: Date, count: number): FoodEntry[] => {
  const entries: FoodEntry[] = [];
  const timestamp = date.toISOString();
  
  // Aliments de base avec leurs valeurs nutritionnelles
  const basicFoods = [
    {
      name: "Poulet grillé",
      calories: 165,
      macros: { protein: 31, carbs: 0, fat: 3.6 }
    },
    {
      name: "Riz blanc",
      calories: 130,
      macros: { protein: 2.7, carbs: 28, fat: 0.3 }
    },
    {
      name: "Salade verte",
      calories: 15,
      macros: { protein: 1.5, carbs: 2.9, fat: 0.2 }
    },
    {
      name: "Yaourt grec",
      calories: 100,
      macros: { protein: 10, carbs: 3.6, fat: 5 }
    },
    {
      name: "Pain complet",
      calories: 80,
      macros: { protein: 3.6, carbs: 14, fat: 1.1 }
    },
    {
      name: "Œufs brouillés",
      calories: 140,
      macros: { protein: 12, carbs: 1, fat: 10 }
    },
    {
      name: "Avocat",
      calories: 160,
      macros: { protein: 2, carbs: 8, fat: 15 }
    },
    {
      name: "Saumon",
      calories: 208,
      macros: { protein: 20, carbs: 0, fat: 13 }
    },
    {
      name: "Fruits rouges",
      calories: 70,
      macros: { protein: 1, carbs: 17, fat: 0.3 }
    },
    {
      name: "Amandes",
      calories: 180,
      macros: { protein: 6, carbs: 6, fat: 14 }
    }
  ];
  
  for (let i = 0; i < count; i++) {
    // Sélectionner un aliment aléatoire
    const randomFood = basicFoods[Math.floor(Math.random() * basicFoods.length)];
    
    // Facteur de variation pour les valeurs (entre 0.8 et 1.2)
    const variationFactor = 0.8 + Math.random() * 0.4;
    
    // Créer une entrée avec variation
    entries.push({
      id: `mock-entry-${date.getTime()}-${i}`,
      name: randomFood.name,
      calories: Math.round(randomFood.calories * variationFactor),
      macros: {
        protein: Math.round(randomFood.macros.protein * variationFactor * 10) / 10,
        carbs: Math.round(randomFood.macros.carbs * variationFactor * 10) / 10,
        fat: Math.round(randomFood.macros.fat * variationFactor * 10) / 10
      },
      timestamp
    });
  }
  
  return entries;
};

// Calculer les totaux à partir des entrées alimentaires
const calculateTotals = (entries: FoodEntry[]) => {
  const macros: MacroNutrients = { protein: 0, carbs: 0, fat: 0 };
  let calories = 0;
  
  entries.forEach(entry => {
    calories += entry.calories;
    macros.protein += entry.macros.protein;
    macros.carbs += entry.macros.carbs;
    macros.fat += entry.macros.fat;
  });
  
  // Arrondir les valeurs
  macros.protein = Math.round(macros.protein * 10) / 10;
  macros.carbs = Math.round(macros.carbs * 10) / 10;
  macros.fat = Math.round(macros.fat * 10) / 10;
  
  return {
    calories,
    macros
  };
};

// Générer une entrée de poids aléatoire
const generateRandomWeightEntry = (date: Date, baseWeight: number): WeightEntry => {
  // Petite variation aléatoire autour du poids de base
  const variationFactor = -0.2 + Math.random() * 0.4; // Entre -0.2 et 0.2
  
  return {
    weight: Math.round((baseWeight + variationFactor) * 10) / 10,
    timestamp: date.toISOString(),
    notes: Math.random() > 0.5 ? "Mesure du matin" : undefined,
    photoUrl: `weight-photo-day-${format(date, "d")}.png`
  };
};

// Fonction pour créer des images factices pour le suivi du poids
export const createMockWeightImages = () => {
  // Pour une démo, nous allons simplement stocker des chaînes dans le localStorage
  // qui seront traitées comme des URL d'images
  const imagePlaceholder = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20fill%3D%22%23f8f9fa%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3Ctext%20fill%3D%22%23999%22%20font-family%3D%22Arial%2CHelveTica%2Csans-serif%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EPhoto%3C%2Ftext%3E%3C%2Fsvg%3E";
  
  // Stocker 10 images (index 0-9)
  for (let i = 0; i < 10; i++) {
    localStorage.setItem(`nutrition-tracker-image-weight-photo-day-${i}.png`, imagePlaceholder);
  }
};
