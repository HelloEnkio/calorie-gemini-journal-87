
import { Achievement } from "@/types";
import { getAllLogs } from "./logs";

const ACHIEVEMENTS_KEY = 'nutrition-tracker-achievements';

// Get all achievements
export const getAchievements = (): Achievement[] => {
  try {
    const achievementsJson = localStorage.getItem(ACHIEVEMENTS_KEY);
    
    if (!achievementsJson) {
      return initializeAchievements();
    }
    
    return JSON.parse(achievementsJson);
  } catch (error) {
    console.error("Error loading achievements:", error);
    return initializeAchievements();
  }
};

// Initialize default achievements
export const initializeAchievements = (): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: "achievement-1",
      name: "Premier pas",
      description: "Enregistrer votre première entrée alimentaire",
      icon: "🍽️",
      unlocked: false,
      level: 1,
      category: 'nutrition'
    },
    {
      id: "achievement-2",
      name: "Régime équilibré",
      description: "Atteindre un équilibre parfait entre protéines, lipides et glucides",
      icon: "⚖️",
      unlocked: false,
      level: 2,
      category: 'nutrition'
    },
    {
      id: "achievement-3",
      name: "Sportif en herbe",
      description: "Enregistrer 5 séances d'entraînement",
      icon: "🏃",
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      level: 1,
      category: 'fitness'
    },
    {
      id: "achievement-4",
      name: "Suivi régulier",
      description: "Utiliser l'application 7 jours consécutifs",
      icon: "📊",
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      level: 1,
      category: 'consistency'
    },
    {
      id: "achievement-5",
      name: "Objectif atteint",
      description: "Atteindre votre objectif calorique 5 jours de suite",
      icon: "🎯",
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      level: 2,
      category: 'nutrition'
    }
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  return achievements;
};

// Update achievement
export const updateAchievement = (id: string, updates: Partial<Achievement>): void => {
  const achievements = getAchievements();
  const index = achievements.findIndex(a => a.id === id);
  
  if (index !== -1) {
    achievements[index] = { ...achievements[index], ...updates };
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

// Unlock achievement
export const unlockAchievement = (id: string): Achievement | null => {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id);
  
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    return achievement;
  }
  
  return null;
};

// Check and update all achievements based on user data
export const checkAndUpdateAchievements = (): void => {
  const logs = getAllLogs();
  const achievements = getAchievements();
  
  // Check each achievement
  achievements.forEach(achievement => {
    switch (achievement.id) {
      case "achievement-1":
        // Premier pas - Enregistrer votre première entrée alimentaire
        if (!achievement.unlocked && logs.some(log => log.foodEntries.length > 0)) {
          unlockAchievement(achievement.id);
        }
        break;
        
      case "achievement-3":
        // Sportif en herbe - Enregistrer 5 séances d'entraînement
        const workoutsCount = logs.reduce((total, log) => total + log.workouts.length, 0);
        
        if (!achievement.unlocked) {
          updateAchievement(achievement.id, { progress: workoutsCount });
          
          if (workoutsCount >= 5) {
            unlockAchievement(achievement.id);
          }
        }
        break;
        
      // Add more achievement checks as needed
      
      default:
        break;
    }
  });
};

// Reset all achievements (for testing)
export const resetAchievements = (): void => {
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  initializeAchievements();
};
