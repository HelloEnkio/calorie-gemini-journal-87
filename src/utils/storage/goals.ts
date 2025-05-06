
import { UserGoals } from '@/types';

const USER_GOALS_KEY = 'nutrition-tracker-user-goals';

export const getUserGoals = (): UserGoals => {
  try {
    const goalsJson = localStorage.getItem(USER_GOALS_KEY);
    
    if (!goalsJson) {
      return {
        dailyCalories: 2000,
      };
    }
    
    return JSON.parse(goalsJson);
  } catch (error) {
    console.error("Error loading user goals:", error);
    return {
      dailyCalories: 2000,
    };
  }
};

export const saveUserGoals = (goals: UserGoals): void => {
  try {
    localStorage.setItem(USER_GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error("Error saving user goals:", error);
  }
};
