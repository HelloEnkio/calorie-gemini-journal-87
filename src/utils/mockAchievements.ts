
import { Achievement } from "@/types";

const ACHIEVEMENTS_KEY = 'nutrition-tracker-achievements';

// Initialize mock achievements
export const initializeMockAchievements = () => {
  const achievements: Achievement[] = [
    {
      id: "food-tracker-1",
      name: "Gourmet débutant",
      description: "Enregistrer 5 repas",
      icon: "🍽️",
      unlocked: true,
      level: 1,
      category: "alimentation"
    },
    {
      id: "food-tracker-2",
      name: "Chef cuisinier",
      description: "Enregistrer 25 repas",
      icon: "👨‍🍳",
      unlocked: false,
      progress: 15,
      maxProgress: 25,
      level: 2,
      category: "alimentation"
    },
    {
      id: "workout-1",
      name: "Premier pas sportif",
      description: "Enregistrer 3 séances d'entraînement",
      icon: "🏃‍♂️",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      level: 3,
      category: "sport"
    },
    {
      id: "consistency-1",
      name: "Régulier",
      description: "Utiliser l'application pendant 7 jours consécutifs",
      icon: "📅",
      unlocked: false,
      level: 3,
      category: "constance"
    },
    {
      id: "weight-1",
      name: "Suivi débutant",
      description: "Enregistrer votre poids 3 fois",
      icon: "⚖️",
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      level: 1,
      category: "poids"
    },
    {
      id: "weight-2",
      name: "Suivi régulier",
      description: "Enregistrer votre poids 14 jours consécutifs",
      icon: "📊",
      unlocked: false,
      progress: 5,
      maxProgress: 14,
      level: 2,
      category: "poids"
    }
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};
