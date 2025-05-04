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
    { name: "Steak et purée", calories: 520, macros: { protein: 35, carbs: 30, fat: 28 } },
    { name: "Soupe aux légumes", calories: 220, macros: { protein: 8, carbs: 25, fat: 10 } },
    { name: "Pizza margherita", calories: 650, macros: { protein: 22, carbs: 80, fat: 25 } },
    { name: "Salade niçoise", calories: 380, macros: { protein: 18, carbs: 22, fat: 24 } },
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
    { type: "Pilates", duration: 45, caloriesBurned: 220 },
    { type: "Boxe", duration: 60, caloriesBurned: 500 },
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

// Generate a mock weight entry with photo
const generateMockWeightEntry = (baseWeight: number, date: Date): WeightEntry => {
  // Variation of +/- 0.5kg
  const variation = (Math.random() - 0.5);
  const weight = parseFloat((baseWeight + variation).toFixed(1));
  
  // Assign photos to specific dates (first day of each month for the last few months)
  let photoUrl: string | undefined;
  const monthStart = new Date(date);
  monthStart.setDate(1);
  
  // Add a photo roughly once a month
  if (date.getDate() <= 2 || randomInt(1, 30) === 1) {
    // Generate a timestamp for the 1st of the month
    const timestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    photoUrl = `weight-photo-${timestamp}`;
  }
  
  return {
    id: generateId(),
    weight,
    timestamp: date.toISOString(),
    photoUrl
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
    log.weight = generateMockWeightEntry(baseWeight, date);
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
  
  // Generate logs for the last 30 days
  const logs: DailyLog[] = [];
  const baseWeight = 75; // Starting weight
  
  // Generate a more realistic weight trend that shows a gradual decrease over the month
  // with occasional fluctuations
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // More realistic food pattern (less on weekends, more meals on some days)
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6;
    
    // Some days have more food entries than others
    const foodCount = isWeekend ? randomInt(3, 5) : randomInt(2, 4);
    
    // More workouts during the week, less on weekends
    const workoutProbability = isWeekend ? 0.3 : 0.6;
    const workoutCount = Math.random() < workoutProbability ? randomInt(1, 2) : 0;
    
    // Record weight every 2-3 days
    const useWeight = i % 2 === 0 || i % 3 === 0;
    
    // Calculate weight progression: overall downward trend with fluctuations
    // Start at 76kg, end around 74kg with fluctuations
    const trendWeight = 76 - (i === 0 ? 0 : (30 - i) / 30 * 2);
    // Add some realistic fluctuations
    const fluctuation = (Math.random() - 0.5) * 0.6; // +/- 0.3kg fluctuation
    const weightForDay = parseFloat((trendWeight + fluctuation).toFixed(1));
    
    logs.push(createMockDailyLog(
      date,
      foodCount,
      workoutCount,
      useWeight ? weightForDay : undefined
    ));
  }
  
  // Add some days with really good diet adherence (close to target macros)
  const goodDays = [3, 7, 11, 15, 22, 27];
  goodDays.forEach(dayIndex => {
    if (logs[dayIndex]) {
      logs[dayIndex].totalMacros = { protein: 148, carbs: 225, fat: 72 };
      logs[dayIndex].totalCalories = 2150;
    }
  });
  
  // Add some days with higher calories (cheat days)
  const cheatDays = [5, 12, 19, 26];
  cheatDays.forEach(dayIndex => {
    if (logs[dayIndex]) {
      logs[dayIndex].totalCalories = randomInt(2600, 2900);
      logs[dayIndex].totalMacros = {
        protein: randomInt(120, 130),
        carbs: randomInt(300, 350),
        fat: randomInt(90, 110)
      };
    }
  });
  
  // Add historical data for weight tracking (last 12 months)
  // This will allow us to show longer-term trends
  const historicalMonths = 11; // Additional months of history
  let currentWeight = 76; // Starting weight a year ago
  
  for (let month = historicalMonths; month > 0; month--) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - month);
    
    // Generate between 7-10 entries per historical month
    const entriesPerMonth = randomInt(7, 10);
    
    for (let i = 0; i < entriesPerMonth; i++) {
      const date = new Date(startDate);
      date.setDate(randomInt(1, 28)); // Random day in the month
      
      // Weight trend: slight increase until 6 months ago, then gradual decrease
      const monthTrend = month > 6 ? 0.1 : -0.3; // Monthly weight change direction
      const weightTarget = 76 + ((6 - Math.min(month, 6)) * monthTrend);
      const dailyFluctuation = (Math.random() - 0.5) * 0.8;
      
      currentWeight = parseFloat((weightTarget + dailyFluctuation).toFixed(1));
      
      // Create a simplified daily log for historical data
      const log: DailyLog = {
        date: formatDateKey(date),
        totalCalories: randomInt(1800, 2500),
        totalMacros: {
          protein: randomInt(100, 150),
          carbs: randomInt(200, 250),
          fat: randomInt(60, 90),
        },
        foodEntries: [],
        workouts: [],
        weight: generateMockWeightEntry(currentWeight, date),
      };
      
      logs.push(log);
    }
  }
  
  // Sort logs by date before saving
  logs.sort((a, b) => a.date.localeCompare(b.date));
  
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
  
  console.log('Mock data initialization complete with extended history data');
};
