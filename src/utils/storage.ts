
import { DailyLog, FoodEntry, MacroNutrients, UserGoals, WorkoutEntry } from "@/types";
import { format } from "date-fns";

// Clé de stockage pour les journaux quotidiens
const DAILY_LOGS_KEY = "nutrition-tracker-daily-logs";

// Clé de stockage pour les objectifs de l'utilisateur
const USER_GOALS_KEY = "nutrition-tracker-user-goals";

// Générer un ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Formater une date pour la clé du journal
export const formatDateKey = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// Charger tous les journaux quotidiens
export const loadDailyLogs = (): Record<string, DailyLog> => {
  const storedLogs = localStorage.getItem(DAILY_LOGS_KEY);
  if (!storedLogs) return {};
  
  try {
    return JSON.parse(storedLogs);
  } catch (error) {
    console.error("Erreur lors du chargement des journaux quotidiens:", error);
    return {};
  }
};

// Charger le journal d'un jour spécifique
export const loadDailyLog = (date: Date): DailyLog => {
  const dateKey = formatDateKey(date);
  const dailyLogs = loadDailyLogs();
  
  // Si le journal existe déjà, le renvoyer
  if (dailyLogs[dateKey]) {
    return dailyLogs[dateKey];
  }
  
  // Sinon, créer un nouveau journal vide
  const emptyLog: DailyLog = {
    date: dateKey,
    foodEntries: [],
    totalCalories: 0,
    totalMacros: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    workouts: []
  };
  
  return emptyLog;
};

// Sauvegarder un journal quotidien
export const saveDailyLog = (log: DailyLog): void => {
  const dailyLogs = loadDailyLogs();
  dailyLogs[log.date] = log;
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(dailyLogs));
};

// Recalculer les totaux d'un journal quotidien
export const recalculateDailyTotals = (log: DailyLog): DailyLog => {
  const totalMacros: MacroNutrients = {
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  let totalCalories = 0;
  
  // Additionner les calories et macros de chaque entrée alimentaire
  log.foodEntries.forEach(entry => {
    totalCalories += entry.calories;
    totalMacros.protein += entry.macros.protein;
    totalMacros.carbs += entry.macros.carbs;
    totalMacros.fat += entry.macros.fat;
  });
  
  // Arrondir les valeurs
  totalMacros.protein = Math.round(totalMacros.protein * 10) / 10;
  totalMacros.carbs = Math.round(totalMacros.carbs * 10) / 10;
  totalMacros.fat = Math.round(totalMacros.fat * 10) / 10;
  
  return {
    ...log,
    totalCalories,
    totalMacros
  };
};

// Ajouter une entrée alimentaire
export const addFoodEntry = (entry: FoodEntry): void => {
  const entryDate = new Date(entry.timestamp);
  let dailyLog = loadDailyLog(entryDate);
  
  // Ajouter l'entrée à la liste
  dailyLog.foodEntries.unshift(entry);
  
  // Recalculer les totaux
  dailyLog = recalculateDailyTotals(dailyLog);
  
  // Enregistrer le journal mis à jour
  saveDailyLog(dailyLog);
};

// Supprimer une entrée alimentaire
export const removeFoodEntry = (id: string): boolean => {
  const dailyLogs = loadDailyLogs();
  
  // Rechercher dans tous les journaux
  for (const dateKey in dailyLogs) {
    const log = dailyLogs[dateKey];
    const entryIndex = log.foodEntries.findIndex(entry => entry.id === id);
    
    if (entryIndex !== -1) {
      // Supprimer l'entrée
      log.foodEntries.splice(entryIndex, 1);
      
      // Recalculer les totaux
      dailyLogs[dateKey] = recalculateDailyTotals(log);
      
      // Enregistrer les journaux mis à jour
      localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(dailyLogs));
      return true;
    }
  }
  
  return false;
};

// Mettre à jour une entrée alimentaire
export const updateFoodEntry = (id: string, updatedEntry: FoodEntry): boolean => {
  const dailyLogs = loadDailyLogs();
  
  // Rechercher dans tous les journaux
  for (const dateKey in dailyLogs) {
    const log = dailyLogs[dateKey];
    const entryIndex = log.foodEntries.findIndex(entry => entry.id === id);
    
    if (entryIndex !== -1) {
      // Mise à jour de l'entrée
      log.foodEntries[entryIndex] = {
        ...updatedEntry,
        id: id, // S'assurer que l'ID reste le même
        timestamp: log.foodEntries[entryIndex].timestamp // Conserver le timestamp d'origine
      };
      
      // Recalculer les totaux
      dailyLogs[dateKey] = recalculateDailyTotals(log);
      
      // Enregistrer les journaux mis à jour
      localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(dailyLogs));
      return true;
    }
  }
  
  return false;
};

// Ajouter une entrée d'entraînement
export const addWorkoutEntry = (entry: WorkoutEntry): void => {
  const entryDate = new Date(entry.timestamp);
  const dailyLog = loadDailyLog(entryDate);
  
  // Ajouter l'entrée à la liste
  dailyLog.workouts.unshift(entry);
  
  // Enregistrer le journal mis à jour
  saveDailyLog(dailyLog);
};

// Charger les objectifs de l'utilisateur
export const loadUserGoals = (): UserGoals => {
  const storedGoals = localStorage.getItem(USER_GOALS_KEY);
  
  if (!storedGoals) {
    // Objectifs par défaut
    const defaultGoals: UserGoals = {
      dailyCalories: 2000,
      macros: {
        protein: 100,
        carbs: 250,
        fat: 70
      }
    };
    
    localStorage.setItem(USER_GOALS_KEY, JSON.stringify(defaultGoals));
    return defaultGoals;
  }
  
  try {
    return JSON.parse(storedGoals);
  } catch (error) {
    console.error("Erreur lors du chargement des objectifs:", error);
    return { dailyCalories: 2000 };
  }
};

// Sauvegarder les objectifs de l'utilisateur
export const saveUserGoals = (goals: UserGoals): void => {
  localStorage.setItem(USER_GOALS_KEY, JSON.stringify(goals));
};
