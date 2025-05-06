
import { UserGoals } from '@/types';

const USER_GOALS_KEY = 'nutrition-tracker-user-goals';

// Load user goals
export const getUserGoals = (): UserGoals => {
  const storedGoals = localStorage.getItem(USER_GOALS_KEY);
  
  if (!storedGoals) {
    // Default goals
    const defaultGoals: UserGoals = {
      dailyCalories: 2000,
      macros: {
        protein: 100,
        carbs: 250,
        fat: 70
      }
    };
    
    localStorage.setItem(USER_GOALS_KEY, JSON.stringify(defaultGoals));
    return defaultGoals;
  }
  
  try {
    return JSON.parse(storedGoals);
  } catch (error) {
    console.error("Error loading user goals:", error);
    return { dailyCalories: 2000, macros: { protein: 100, carbs: 250, fat: 70 } };
  }
};

// Save user goals
export const saveUserGoals = (goals: UserGoals): void => {
  localStorage.setItem(USER_GOALS_KEY, JSON.stringify(goals));
};
