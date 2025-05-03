
import { Achievement } from "@/types";
import { ACHIEVEMENTS_KEY } from "./core";
import { getUserGoals } from "./goals";
import { getAllLogs, formatDateKey } from "./core";

// Get achievements
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
  const todayLog = allLogs.find(log => log.date === formatDateKey()) || {
    foodEntries: [],
    workouts: [],
    weight: undefined
  };
  
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
