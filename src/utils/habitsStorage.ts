
import { format } from "date-fns";
import { Habit, HabitEntry, HabitStats } from "@/types";
import { getDailyLog, saveDailyLog } from "@/utils/storage/logs";
import { formatDateKey } from "@/utils/storage/core";

// Clé de stockage pour les habitudes
const HABITS_KEY = "nutrition-tracker-habits";
const HABIT_STATS_KEY = "nutrition-tracker-habit-stats";

// Initialiser les habitudes par défaut si nécessaire
export const initializeDefaultHabits = (): void => {
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
        streak: 0,
        frequency: "daily"
      },
      {
        id: "habit-2",
        name: "Manger 5 fruits et légumes",
        description: "Pour un apport en vitamines et fibres",
        icon: "🥗",
        color: "#22c55e",
        active: true,
        streak: 0,
        frequency: "daily"
      },
      {
        id: "habit-3",
        name: "Protéines à chaque repas",
        description: "Pour maintenir ou développer la masse musculaire",
        icon: "🍗",
        color: "#ef4444",
        active: true,
        streak: 0,
        frequency: "daily"
      }
    ];
    
    localStorage.setItem(HABITS_KEY, JSON.stringify(defaultHabits));
  }
};

// Charger toutes les habitudes
export const getAllHabits = (): Habit[] => {
  initializeDefaultHabits();
  const storedHabits = localStorage.getItem(HABITS_KEY);
  
  try {
    return JSON.parse(storedHabits || "[]");
  } catch (error) {
    console.error("Erreur lors du chargement des habitudes:", error);
    return [];
  }
};

// Ajouter une nouvelle habitude
export const addHabit = (habit: Omit<Habit, "id" | "streak">): Habit => {
  const habits = getAllHabits();
  
  const newHabit: Habit = {
    ...habit,
    id: `habit-${Date.now()}`,
    streak: 0,
    createdAt: new Date().toISOString()
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

// Alias pour removeHabit pour compatibilité avec le code existant
export const deleteHabit = removeHabit;

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

// Marquer une habitude comme terminée pour un jour spécifique
export const completeHabit = (habitId: string, date: Date): void => {
  const dailyLog = getDailyLog(date);
  
  // Initialiser la section des habitudes si elle n'existe pas
  if (!dailyLog.habits) {
    dailyLog.habits = {};
  }
  
  // Créer ou mettre à jour l'entrée d'habitude
  dailyLog.habits[habitId] = {
    id: `habit-entry-${Date.now()}`,
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
  const dailyLog = getDailyLog(date);
  
  // Si les habitudes n'existent pas ou si cette habitude n'est pas marquée, ne rien faire
  if (!dailyLog.habits || !dailyLog.habits[habitId]) {
    return;
  }
  
  // Mettre à jour l'entrée d'habitude
  dailyLog.habits[habitId] = {
    id: dailyLog.habits[habitId].id || `habit-entry-${Date.now()}`,
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
  
  // Mettre à jour les statistiques
  updateHabitStats(habitId);
};

// Obtenir les statistiques d'une habitude
export const getHabitStats = (habitId: string): HabitStats | null => {
  try {
    const statsJson = localStorage.getItem(HABIT_STATS_KEY);
    const allStats = statsJson ? JSON.parse(statsJson) : {};
    
    return allStats[habitId] || createDefaultHabitStats(habitId);
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques d'habitude:", error);
    return createDefaultHabitStats(habitId);
  }
};

// Créer des statistiques par défaut pour une habitude
const createDefaultHabitStats = (habitId: string): HabitStats => ({
  habitId,
  streak: 0,
  longestStreak: 0,
  completionRates: {
    week: 0,
    month: 0,
    threeMonths: 0,
    year: 0
  }
});

// Mettre à jour les statistiques d'une habitude
const updateHabitStats = (habitId: string): void => {
  try {
    const habit = getAllHabits().find(h => h.id === habitId);
    if (!habit) return;
    
    const statsJson = localStorage.getItem(HABIT_STATS_KEY);
    const allStats = statsJson ? JSON.parse(statsJson) : {};
    
    // Récupérer ou créer les stats pour cette habitude
    const habitStats = allStats[habitId] || createDefaultHabitStats(habitId);
    
    // Mettre à jour le streak actuel et le record
    habitStats.streak = habit.streak || 0;
    habitStats.longestStreak = Math.max(habitStats.longestStreak || 0, habitStats.streak);
    
    // Calculer les taux de complétion (à implémenter de manière plus complète)
    // Pour l'exemple, on utilise des valeurs factices
    habitStats.completionRates = {
      week: Math.min(100, (habitStats.streak || 0) * 15),
      month: Math.min(100, (habitStats.streak || 0) * 5),
      threeMonths: Math.min(100, (habitStats.streak || 0) * 2),
      year: Math.min(100, (habitStats.streak || 0))
    };
    
    // Sauvegarder les statistiques mises à jour
    allStats[habitId] = habitStats;
    localStorage.setItem(HABIT_STATS_KEY, JSON.stringify(allStats));
  } catch (error) {
    console.error("Erreur lors de la mise à jour des statistiques d'habitude:", error);
  }
};
