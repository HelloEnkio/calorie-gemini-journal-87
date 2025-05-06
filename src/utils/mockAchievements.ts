
import { Achievement } from "@/types";

// Clé de stockage pour les achievements
const ACHIEVEMENTS_KEY = "nutrition-tracker-achievements";

// Initialiser les achievements dans le localStorage
export const initializeMockAchievements = (): void => {
  console.info("Initializing mock achievements...");
  
  const achievements: Achievement[] = [
    {
      id: "first-entry",
      name: "Premier pas",
      description: "Enregistrer votre premier aliment",
      icon: "🎯",
      unlocked: true,
      level: 1
    },
    {
      id: "daily-streak",
      name: "Constance",
      description: "Utiliser l'application 7 jours de suite",
      icon: "📅",
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      level: 2
    },
    {
      id: "macro-master",
      name: "Maître des macros",
      description: "Atteindre vos objectifs de macronutriments 5 jours consécutifs",
      icon: "🧪",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      level: 3
    },
    {
      id: "weight-goal",
      name: "Objectif atteint",
      description: "Atteindre votre objectif de poids",
      icon: "⚖️",
      unlocked: false,
      level: 3
    },
    {
      id: "photo-tracker",
      name: "Suivi visuel",
      description: "Ajouter 10 photos de progression",
      icon: "📸",
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      level: 1
    },
    {
      id: "water-master",
      name: "Hydratation parfaite",
      description: "Compléter l'habitude 'Boire 2L d'eau' pendant 10 jours",
      icon: "💧",
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      level: 2
    }
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  console.info("Mock achievements initialization complete");
};

// Obtenir tous les achievements
export const getAchievements = (): Achievement[] => {
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
  
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Erreur lors du chargement des achievements:", error);
    return [];
  }
};

// Débloquer un achievement
export const unlockAchievement = (id: string): boolean => {
  const achievements = getAchievements();
  const achievementIndex = achievements.findIndex(a => a.id === id);
  
  if (achievementIndex === -1) return false;
  
  achievements[achievementIndex].unlocked = true;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  
  return true;
};

// Mettre à jour la progression d'un achievement
export const updateAchievementProgress = (id: string, progress: number): boolean => {
  const achievements = getAchievements();
  const achievementIndex = achievements.findIndex(a => a.id === id);
  
  if (achievementIndex === -1) return false;
  
  const achievement = achievements[achievementIndex];
  
  if (!achievement.maxProgress) return false;
  
  achievement.progress = progress;
  
  // Vérifier si l'achievement est maintenant débloqué
  if (progress >= achievement.maxProgress) {
    achievement.unlocked = true;
  }
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  
  return true;
};
