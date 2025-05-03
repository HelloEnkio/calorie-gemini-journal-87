
import { FoodEntry, WorkoutEntry, WeightEntry, Achievement, DailyLog } from "@/types";
import { generateId, formatDateKey } from "./storage/core";
import { getUserGoals, saveUserGoals } from "./storage/goals";

// Generate a random number between min and max (inclusive)
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random date within the last N days
const randomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date;
};

// Generate mock food entries
const generateMockFoodEntries = (count: number): FoodEntry[] => {
  const foods = [
    { name: "Salade César", calories: 350, macros: { protein: 20, carbs: 15, fat: 25 } },
    { name: "Poulet grillé", calories: 280, macros: { protein: 40, carbs: 2, fat: 12 } },
    { name: "Pâtes bolognaise", calories: 550, macros: { protein: 25, carbs: 70, fat: 18 } },
    { name: "Omelette aux légumes", calories: 320, macros: { protein: 18, carbs: 10, fat: 22 } },
    { name: "Sandwich jambon-fromage", calories: 450, macros: { protein: 22, carbs: 48, fat: 15 } },
    { name: "Bowl de quinoa", calories: 380, macros: { protein: 15, carbs: 52, fat: 12 } },
    { name: "Smoothie protéiné", calories: 240, macros: { protein: 30, carbs: 25, fat: 5 } },
    { name: "Yaourt grec et fruits", calories: 180, macros: { protein: 12, carbs: 20, fat: 6 } },
  ];
  
  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const entries: FoodEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const food = foods[randomInt(0, foods.length - 1)];
    const timestamp = new Date();
    timestamp.setHours(randomInt(6, 22), randomInt(0, 59));
    
    entries.push({
      id: generateId(),
      name: food.name,
      calories: food.calories,
      macros: { ...food.macros },
      timestamp: timestamp.toISOString(),
      mealType: mealTypes[randomInt(0, 3)]
    });
  }
  
  return entries;
};

// Generate mock workout entries
const generateMockWorkoutEntries = (count: number): WorkoutEntry[] => {
  const workouts = [
    { type: "Course à pied", duration: 30, caloriesBurned: 320 },
    { type: "Musculation", duration: 60, caloriesBurned: 450 },
    { type: "Vélo", duration: 45, caloriesBurned: 380 },
    { type: "Natation", duration: 40, caloriesBurned: 400 },
    { type: "HIIT", duration: 25, caloriesBurned: 350 },
    { type: "Yoga", duration: 50, caloriesBurned: 200 },
  ];
  
  const entries: WorkoutEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const workout = workouts[randomInt(0, workouts.length - 1)];
    const timestamp = new Date();
    timestamp.setHours(randomInt(6, 22), randomInt(0, 59));
    
    entries.push({
      id: generateId(),
      type: workout.type,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      notes: "Séance " + (i + 1),
      timestamp: timestamp.toISOString()
    });
  }
  
  return entries;
};

// Generate a mock weight entry
const generateMockWeightEntry = (baseWeight: number): WeightEntry => {
  // Variation of +/- 0.5kg
  const variation = (Math.random() - 0.5);
  const weight = parseFloat((baseWeight + variation).toFixed(1));
  
  return {
    id: generateId(),
    weight,
    timestamp: new Date().toISOString()
  };
};

// Create a mock daily log
const createMockDailyLog = (date: Date, foodCount: number, workoutCount: number, baseWeight?: number): DailyLog => {
  const foodEntries = generateMockFoodEntries(foodCount);
  const workouts = generateMockWorkoutEntries(workoutCount);
  
  // Calculate totals
  const totalCalories = foodEntries.reduce((acc, entry) => acc + entry.calories, 0);
  const totalMacros = foodEntries.reduce((acc, entry) => ({
    protein: acc.protein + entry.macros.protein,
    carbs: acc.carbs + entry.macros.carbs,
    fat: acc.fat + entry.macros.fat
  }), { protein: 0, carbs: 0, fat: 0 });
  
  const log: DailyLog = {
    date: formatDateKey(date),
    totalCalories,
    totalMacros,
    foodEntries,
    workouts,
  };
  
  // Add weight entry if baseWeight is provided
  if (baseWeight) {
    log.weight = generateMockWeightEntry(baseWeight);
  }
  
  return log;
};

// Initialize mock data
export const initializeMockData = () => {
  // Check if data already exists
  const logsKey = localStorage.getItem('nutrition-tracker-daily-logs');
  if (logsKey) {
    console.log('Mock data already initialized');
    return;
  }
  
  console.log('Initializing mock data...');
  
  // Generate logs for the last 14 days
  const logs: DailyLog[] = [];
  const baseWeight = 75; // Starting weight
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const foodCount = i === 0 ? 3 : randomInt(2, 5);  // Today has 3 meals
    const workoutCount = Math.random() > 0.6 ? randomInt(1, 2) : 0; // 40% chance of workout
    const useWeight = i % 3 === 0; // Record weight every 3 days
    
    // Calculate weight progression: slight decrease over time
    const weightForDay = baseWeight - (i / 14) * 2;
    
    logs.push(createMockDailyLog(
      date,
      foodCount,
      workoutCount,
      useWeight ? weightForDay : undefined
    ));
  }
  
  // Save logs to localStorage
  localStorage.setItem('nutrition-tracker-daily-logs', JSON.stringify(logs));
  
  // Set custom user goals
  const goals = getUserGoals();
  saveUserGoals({
    ...goals,
    dailyCalories: 2200,
    macros: {
      protein: 150,
      carbs: 230,
      fat: 70
    },
    macroPercentages: {
      protein: 27,
      carbs: 42,
      fat: 31
    }
  });
  
  console.log('Mock data initialization complete');
};
