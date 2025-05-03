
import { UserGoals } from "@/types";
import { USER_GOALS_KEY } from "./core";

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
