
import { DailyLog, FoodEntry, WorkoutEntry, WeightEntry, Achievement, UserGoals } from "@/types";

// Key constants
const DAILY_LOGS_KEY = 'nutrition-tracker-daily-logs';
const ACHIEVEMENTS_KEY = 'nutrition-tracker-achievements';
const USER_GOALS_KEY = 'nutrition-tracker-user-goals';

// Helper for formatting dates consistently
export const formatDateKey = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Get today's log or create a new one
export const getTodaysLog = (): DailyLog => {
  return getLogForDate(formatDateKey());
};

// Get log for a specific date
export const getLogForDate = (dateKey: string): DailyLog => {
  const allLogs = getAllLogs();
  
  const dayLog = allLogs.find(log => log.date === dateKey);
  
  if (dayLog) {
    return dayLog;
  }
  
  // Create new log for the date
  const newLog: DailyLog = {
    date: dateKey,
    totalCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0 },
    foodEntries: [],
    workouts: [],
  };
  
  // Save and return the new log
  saveDailyLog(newLog);
  return newLog;
};

// Get all logs
export const getAllLogs = (): DailyLog[] => {
  const logsJson = localStorage.getItem(DAILY_LOGS_KEY);
  return logsJson ? JSON.parse(logsJson) : [];
};

// Save/update a daily log
export const saveDailyLog = (log: DailyLog): void => {
  const allLogs = getAllLogs();
  const logIndex = allLogs.findIndex(l => l.date === log.date);
  
  if (logIndex >= 0) {
    allLogs[logIndex] = log;
  } else {
    allLogs.push(log);
  }
  
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(allLogs));
};

// Add food entry
export const addFoodEntry = (entry: FoodEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.foodEntries.push(entry);
  
  // Update totals
  todayLog.totalCalories += entry.calories;
  todayLog.totalMacros.protein += entry.macros.protein;
  todayLog.totalMacros.carbs += entry.macros.carbs;
  todayLog.totalMacros.fat += entry.macros.fat;
  
  saveDailyLog(todayLog);
};

// Remove food entry
export const removeFoodEntry = (entryId: string): void => {
  const todayLog = getTodaysLog();
  const entryIndex = todayLog.foodEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex >= 0) {
    const entry = todayLog.foodEntries[entryIndex];
    
    // Update totals
    todayLog.totalCalories -= entry.calories;
    todayLog.totalMacros.protein -= entry.macros.protein;
    todayLog.totalMacros.carbs -= entry.macros.carbs;
    todayLog.totalMacros.fat -= entry.macros.fat;
    
    // Remove entry
    todayLog.foodEntries.splice(entryIndex, 1);
    saveDailyLog(todayLog);
  }
};

// Add workout entry
export const addWorkoutEntry = (entry: WorkoutEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.workouts.push(entry);
  saveDailyLog(todayLog);
};

// Remove workout entry
export const removeWorkoutEntry = (entryId: string): void => {
  const todayLog = getTodaysLog();
  todayLog.workouts = todayLog.workouts.filter(entry => entry.id !== entryId);
  saveDailyLog(todayLog);
};

// Add weight entry
export const addWeightEntry = (entry: WeightEntry): void => {
  const todayLog = getTodaysLog();
  todayLog.weight = entry;
  saveDailyLog(todayLog);
};

// Get logs for a date range
export const getLogsInDateRange = (startDate: string, endDate: string): DailyLog[] => {
  return getAllLogs().filter(log => log.date >= startDate && log.date <= endDate);
};

// Get logs for last N days
export const getLogsForLastDays = (days: number): DailyLog[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return getLogsInDateRange(formatDateKey(startDate), formatDateKey(endDate));
};

// User goals
export const getUserGoals = (): UserGoals => {
  const goalsJson = localStorage.getItem(USER_GOALS_KEY);
  if (goalsJson) {
    return JSON.parse(goalsJson);
  }
  
  // Default goals
  const defaultGoals: UserGoals = {
    dailyCalories: 2000,
    macros: { protein: 140, carbs: 220, fat: 65 }
  };
  
  localStorage.setItem(USER_GOALS_KEY, JSON.stringify(defaultGoals));
  return defaultGoals;
};

export const saveUserGoals = (goals: UserGoals): void => {
  localStorage.setItem(USER_GOALS_KEY, JSON.stringify(goals));
};

// Achievements
export const getAchievements = (): Achievement[] => {
  const achievementsJson = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (achievementsJson) {
    return JSON.parse(achievementsJson);
  }
  
  // Default achievements
  const defaultAchievements: Achievement[] = [
    {
      id: 'first-entry',
      name: 'Premier pas',
      description: 'Enregistrer votre premier repas',
      icon: '🍽️',
      unlocked: false,
      category: 'nutrition',
      level: 'bronze'
    },
    {
      id: 'calorie-goal-streak',
      name: 'Sur la bonne voie',
      description: 'Atteindre votre objectif calorique 3 jours de suite',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      category: 'nutrition',
      level: 'silver'
    },
    {
      id: 'first-workout',
      name: 'En mouvement',
      description: 'Enregistrer votre première séance d\'entraînement',
      icon: '💪',
      unlocked: false,
      category: 'fitness',
      level: 'bronze'
    },
    {
      id: 'weight-tracking',
      name: 'Suivi de poids',
      description: 'Enregistrer votre poids 5 jours d\'affilée',
      icon: '⚖️',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      category: 'consistency',
      level: 'gold'
    }
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  return defaultAchievements;
};

export const updateAchievement = (achievementId: string, updates: Partial<Achievement>): void => {
  const achievements = getAchievements();
  const achievementIndex = achievements.findIndex(a => a.id === achievementId);
  
  if (achievementIndex >= 0) {
    achievements[achievementIndex] = { 
      ...achievements[achievementIndex], 
      ...updates 
    };
    
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

export const checkAndUpdateAchievements = (): Achievement[] => {
  const achievements = getAchievements();
  const allLogs = getAllLogs();
  const todayLog = getTodaysLog();
  
  // Check "first-entry"
  if (!achievements.find(a => a.id === 'first-entry')?.unlocked && 
      todayLog.foodEntries.length > 0) {
    updateAchievement('first-entry', { unlocked: true });
  }
  
  // Check "first-workout"
  if (!achievements.find(a => a.id === 'first-workout')?.unlocked && 
      todayLog.workouts.length > 0) {
    updateAchievement('first-workout', { unlocked: true });
  }
  
  // Check "weight-tracking"
  const consecutiveWeightEntries = getConsecutiveDaysWithWeightEntries();
  const weightTracking = achievements.find(a => a.id === 'weight-tracking');
  if (weightTracking && !weightTracking.unlocked) {
    const newProgress = Math.min(consecutiveWeightEntries, weightTracking.maxProgress || 5);
    updateAchievement('weight-tracking', { 
      progress: newProgress,
      unlocked: newProgress >= (weightTracking.maxProgress || 5)
    });
  }
  
  // Check "calorie-goal-streak"
  const calorieGoalStreak = getCalorieGoalStreak();
  const calorieAchievement = achievements.find(a => a.id === 'calorie-goal-streak');
  if (calorieAchievement && !calorieAchievement.unlocked) {
    const newProgress = Math.min(calorieGoalStreak, calorieAchievement.maxProgress || 3);
    updateAchievement('calorie-goal-streak', { 
      progress: newProgress,
      unlocked: newProgress >= (calorieAchievement.maxProgress || 3)
    });
  }
  
  return getAchievements();
};

// Helper functions for achievements
const getConsecutiveDaysWithWeightEntries = (): number => {
  const allLogs = getAllLogs().sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0;
  const today = formatDateKey();
  
  // Start from today and go backwards
  for (let i = allLogs.length - 1; i >= 0; i--) {
    const log = allLogs[i];
    
    // Stop if we reach a day earlier than today with no weight entry
    if (log.date !== today && !log.weight) {
      break;
    }
    
    if (log.weight) {
      streak++;
    }
  }
  
  return streak;
};

const getCalorieGoalStreak = (): number => {
  const allLogs = getAllLogs().sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0;
  const goals = getUserGoals();
  const today = formatDateKey();
  
  // Start from today and go backwards
  for (let i = allLogs.length - 1; i >= 0; i--) {
    const log = allLogs[i];
    
    // Goal is met if calories are within 10% of target
    const calorieGoal = goals.dailyCalories;
    const isWithinGoal = log.totalCalories >= calorieGoal * 0.9 && 
                         log.totalCalories <= calorieGoal * 1.1;
    
    if (log.date === today || isWithinGoal) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Helper for generating IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
