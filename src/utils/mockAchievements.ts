
import { Achievement } from "@/types";
import { generateId } from "./storage";

// Create mock achievements
export const initializeMockAchievements = () => {
  const achievements: Achievement[] = [
    {
      id: generateId(),
      title: "Premier jour parfait",
      name: "Premier jour parfait",
      description: "Atteindre tous les objectifs nutritionnels en une journée",
      icon: "🌟",
      unlocked: true,
      level: 1,
      category: "nutrition"
    },
    {
      id: generateId(),
      title: "Sur la bonne voie",
      name: "Sur la bonne voie",
      description: "Maintenir un déficit calorique pendant 5 jours consécutifs",
      icon: "🔥",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      level: 2,
      category: "nutrition"
    },
    {
      id: generateId(),
      title: "Charge protéinée",
      name: "Charge protéinée",
      description: "Atteindre votre objectif de protéines pendant 10 jours",
      icon: "💪",
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      level: 3,
      category: "nutrition"
    },
    {
      id: generateId(),
      title: "Premier entraînement",
      name: "Premier entraînement",
      description: "Enregistrer votre première séance d'entraînement",
      icon: "🏋️",
      unlocked: false,
      level: 3,
      category: "fitness"
    },
    {
      id: generateId(),
      title: "Perte de poids",
      name: "Perte de poids",
      description: "Perdre 1 kg de poids corporel",
      icon: "⚖️",
      unlocked: false,
      progress: 0.5,
      maxProgress: 1,
      level: 1,
      category: "weight"
    },
    {
      id: generateId(),
      title: "L'habitude fait le moine",
      name: "L'habitude fait le moine",
      description: "Accomplir une habitude pendant 7 jours consécutifs",
      icon: "📆",
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      level: 2,
      category: "consistency"
    }
  ];
  
  localStorage.setItem("nutrition-tracker-achievements", JSON.stringify(achievements));
};
