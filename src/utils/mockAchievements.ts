
import { Achievement } from "@/types";
import { ACHIEVEMENTS_KEY } from "./storage/core";

// Generate mock achievements
export const generateMockAchievements = (): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: "streak-3",
      name: "Démarrage rapide",
      description: "Connectez-vous 3 jours de suite",
      icon: "trophy",
      unlocked: true,
      progress: 100,
      maxProgress: 3,
      category: "consistency",
      level: "bronze"
    },
    {
      id: "streak-7",
      name: "Sur la bonne voie",
      description: "Connectez-vous 7 jours de suite",
      icon: "trophy",
      unlocked: true,
      progress: 100,
      maxProgress: 7,
      category: "consistency",
      level: "silver"
    },
    {
      id: "streak-30",
      name: "Maestro de la régularité",
      description: "Connectez-vous 30 jours de suite",
      icon: "trophy",
      unlocked: false,
      progress: 14,
      maxProgress: 30,
      category: "consistency",
      level: "gold"
    },
    {
      id: "calories-goal-5",
      name: "À la frontière",
      description: "Atteignez votre objectif calorique 5 fois",
      icon: "star",
      unlocked: true,
      progress: 100,
      maxProgress: 5,
      category: "nutrition",
      level: "bronze"
    },
    {
      id: "calories-goal-15",
      name: "Le juste milieu",
      description: "Atteignez votre objectif calorique 15 fois",
      icon: "star",
      unlocked: false,
      progress: 8,
      maxProgress: 15,
      category: "nutrition",
      level: "silver"
    },
    {
      id: "workout-5",
      name: "Débutant sportif",
      description: "Enregistrez 5 séances d'entraînement",
      icon: "badge",
      unlocked: true,
      progress: 100,
      maxProgress: 5,
      category: "fitness",
      level: "bronze"
    },
    {
      id: "workout-20",
      name: "Adepte du fitness",
      description: "Enregistrez 20 séances d'entraînement",
      icon: "badge",
      unlocked: false,
      progress: 8,
      maxProgress: 20,
      category: "fitness",
      level: "silver"
    },
    {
      id: "weight-trend",
      name: "Le chemin du progrès",
      description: "Perdez du poids pendant 4 semaines consécutives",
      icon: "award",
      unlocked: false,
      progress: 2,
      maxProgress: 4,
      category: "weight",
      level: "gold"
    },
    {
      id: "macro-balance-3",
      name: "Équilibre nutritionnel",
      description: "Atteignez l'équilibre parfait des macros 3 fois",
      icon: "star",
      unlocked: true,
      progress: 100,
      maxProgress: 3,
      category: "nutrition",
      level: "bronze"
    },
    {
      id: "macro-balance-10",
      name: "Maestro des macronutriments",
      description: "Atteignez l'équilibre parfait des macros 10 fois",
      icon: "star",
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      category: "nutrition",
      level: "silver"
    }
  ];

  return achievements;
};

// Initialize mock achievements
export const initializeMockAchievements = () => {
  // Check if data already exists
  const achievementsData = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (achievementsData) {
    console.log('Mock achievements already initialized');
    return;
  }
  
  console.log('Initializing mock achievements...');
  
  const achievements = generateMockAchievements();
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  
  console.log('Mock achievements initialization complete');
};
