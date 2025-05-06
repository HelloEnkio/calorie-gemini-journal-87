
import { formatDateKey, loadDailyLog, saveDailyLog } from "./storage";
import { Habit, HabitEntry } from "@/types";

// Clé de stockage pour les habitudes
const HABITS_KEY = "nutrition-tracker-habits";

// Charger toutes les habitudes
export const getAllHabits = (): Habit[] => {
  const storedHabits = localStorage.getItem(HABITS_KEY);
  
  if (!storedHabits) {
    // Habitudes par défaut
    const defaultHabits: Habit[] = [
      {
        id: "habit-1",
        name: "Boire 2L d'eau",
        description: "Hydratation quotidienne",
        icon: "💧",
        color: "#3b82f6",
        active: true,
        streak: 0
      },
      {
        id: "habit-2",
        name: "Manger 5 fruits et légumes",
        description: "Pour un apport en vitamines et fibres",
        icon: "🥗",
        color: "#22c55e",
        active: true,
        streak: 0
      },
      {
        id: "habit-3",
        name: "Protéines à chaque repas",
        description: "Pour maintenir ou développer la masse musculaire",
        icon: "🍗",
        color: "#ef4444",
        active: true,
        streak: 0
      }
    ];
    
    localStorage.setItem(HABITS_KEY, JSON.stringify(defaultHabits));
    return defaultHabits;
  }
  
  try {
    return JSON.parse(storedHabits);
  } catch (error) {
    console.error("Erreur lors du chargement des habitudes:", error);
    return [];
  }
};

// Marquer une habitude comme terminée pour un jour spécifique
export const completeHabit = (habitId: string, date: Date): void => {
  const dateKey = formatDateKey(date);
  const dailyLog = loadDailyLog(date);
  
  // Initialiser la section des habitudes si elle n'existe pas
  if (!dailyLog.habits) {
    dailyLog.habits = {};
  }
  
  // Créer ou mettre à jour l'entrée d'habitude
  dailyLog.habits[habitId] = {
    completed: true,
    timestamp: new Date().toISOString()
  };
  
  // Mettre à jour le streak de l'habitude
  updateHabitStreak(habitId, true);
  
  // Sauvegarder le journal quotidien
  saveDailyLog(dailyLog);
};

// Marquer une habitude comme non terminée pour un jour spécifique
export const uncompleteHabit = (habitId: string, date: Date): void => {
  const dateKey = formatDateKey(date);
  const dailyLog = loadDailyLog(date);
  
  // Si les habitudes n'existent pas ou si cette habitude n'est pas marquée, ne rien faire
  if (!dailyLog.habits || !dailyLog.habits[habitId]) {
    return;
  }
  
  // Mettre à jour l'entrée d'habitude
  dailyLog.habits[habitId] = {
    completed: false,
    timestamp: new Date().toISOString()
  };
  
  // Mettre à jour le streak de l'habitude
  updateHabitStreak(habitId, false);
  
  // Sauvegarder le journal quotidien
  saveDailyLog(dailyLog);
};

// Mettre à jour le streak d'une habitude
const updateHabitStreak = (habitId: string, completed: boolean): void => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) return;
  
  if (completed) {
    // Augmenter le streak
    habits[habitIndex].streak = (habits[habitIndex].streak || 0) + 1;
  } else {
    // Réinitialiser le streak
    habits[habitIndex].streak = 0;
  }
  
  // Sauvegarder les habitudes mises à jour
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

// Ajouter une nouvelle habitude
export const addHabit = (habit: Omit<Habit, "id" | "streak">): Habit => {
  const habits = getAllHabits();
  
  const newHabit: Habit = {
    ...habit,
    id: `habit-${Date.now()}`,
    streak: 0
  };
  
  habits.push(newHabit);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  
  return newHabit;
};

// Supprimer une habitude
export const removeHabit = (habitId: string): boolean => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) return false;
  
  habits.splice(habitIndex, 1);
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  
  return true;
};

// Mettre à jour une habitude
export const updateHabit = (habitId: string, updates: Partial<Habit>): boolean => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) return false;
  
  habits[habitIndex] = {
    ...habits[habitIndex],
    ...updates
  };
  
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  
  return true;
};
