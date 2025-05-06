import { Achievement } from '@/types';

const ACHIEVEMENTS_KEY = 'nutrition-tracker-achievements';

// Get all achievements
export const getAchievements = (): Achievement[] => {
  const achievementsJson = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!achievementsJson) return [];
  
  try {
    return JSON.parse(achievementsJson);
  } catch (error) {
    console.error("Error loading achievements:", error);
    return [];
  }
};

// Save achievements
export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

// Check and update achievements
export const checkAndUpdateAchievements = (): Achievement[] => {
  // This would contain the logic to check for new achievements
  // For now, just return the current achievements
  return getAchievements();
};
