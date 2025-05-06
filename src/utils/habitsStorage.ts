
import { Habit, HabitEntry, HabitStats, DailyLog } from '@/types';
import { format, subDays, parseISO, differenceInDays, isAfter } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { getAllLogs } from './storage';

const HABITS_STORAGE_KEY = 'nutrition-tracker-habits';

// Helper function to get a daily log
const getDailyLog = (dateKey: string): DailyLog => {
  const logs = getAllLogs();
  const existingLog = logs.find(log => log.date === dateKey);
  
  if (existingLog) {
    return existingLog;
  }
  
  // Create a new empty log if none exists
  return {
    date: dateKey,
    totalCalories: 0,
    totalMacros: { protein: 0, carbs: 0, fat: 0 },
    foodEntries: [],
    workouts: [],
    habits: {}
  };
};

// Helper function to update a daily log
const updateDailyLog = (dateKey: string, updatedLog: DailyLog): void => {
  const logs = getAllLogs();
  const existingLogIndex = logs.findIndex(log => log.date === dateKey);
  
  if (existingLogIndex >= 0) {
    logs[existingLogIndex] = updatedLog;
  } else {
    logs.push(updatedLog);
  }
  
  localStorage.setItem('nutrition-tracker-daily-logs', JSON.stringify(logs));
};

// Récupérer toutes les habitudes
export const getAllHabits = (): Habit[] => {
  const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
  
  if (!habitsJson) {
    return [];
  }
  
  try {
    return JSON.parse(habitsJson);
  } catch (error) {
    console.error('Error parsing habits from storage:', error);
    return [];
  }
};

// Ajouter une nouvelle habitude
export const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'createdAt'>): Habit => {
  const habits = getAllHabits();
  
  const newHabit: Habit = {
    ...habitData,
    id: uuidv4(),
    streak: 0,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify([...habits, newHabit]));
  
  return newHabit;
};

// Mettre à jour une habitude
export const updateHabit = (id: string, habitData: Partial<Habit>): boolean => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === id);
  
  if (habitIndex === -1) {
    return false;
  }
  
  habits[habitIndex] = {
    ...habits[habitIndex],
    ...habitData,
  };
  
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  return true;
};

// Supprimer une habitude
export const deleteHabit = (id: string): boolean => {
  const habits = getAllHabits();
  const filteredHabits = habits.filter(h => h.id !== id);
  
  if (filteredHabits.length === habits.length) {
    return false;
  }
  
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(filteredHabits));
  return true;
};

// Marquer une habitude comme complétée pour un jour spécifique
export const completeHabit = (
  habitId: string, 
  date: Date = new Date(), 
  notes?: string
): boolean => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const habits = getAllHabits();
  
  // Vérifier si l'habitude existe
  const habitExists = habits.some(h => h.id === habitId);
  if (!habitExists) {
    return false;
  }
  
  // Récupérer le journal du jour
  const dayLog = getDailyLog(formattedDate);
  
  // Créer ou mettre à jour l'entrée d'habitude
  const habitEntry: HabitEntry = {
    id: uuidv4(),
    completed: true,
    timestamp: new Date().toISOString(),
    notes,
  };
  
  // Mettre à jour le journal
  const updatedDayLog = {
    ...dayLog,
    habits: {
      ...dayLog.habits || {},
      [habitId]: habitEntry
    }
  };
  
  updateDailyLog(formattedDate, updatedDayLog);
  
  // Mettre à jour le streak si nécessaire
  updateHabitStreak(habitId);
  
  return true;
};

// Annuler la complétion d'une habitude pour un jour spécifique
export const uncompleteHabit = (habitId: string, date: Date = new Date()): boolean => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const dayLog = getDailyLog(formattedDate);
  
  if (!dayLog.habits || !dayLog.habits[habitId]) {
    return false;
  }
  
  // Créer une copie des habitudes sans celle que l'on veut supprimer
  const { [habitId]: removedHabit, ...remainingHabits } = dayLog.habits;
  
  // Mettre à jour le journal
  const updatedDayLog = {
    ...dayLog,
    habits: remainingHabits
  };
  
  updateDailyLog(formattedDate, updatedDayLog);
  
  // Mettre à jour le streak
  updateHabitStreak(habitId);
  
  return true;
};

// Calcul du streak actuel d'une habitude
export const updateHabitStreak = (habitId: string): void => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex === -1) {
    return;
  }
  
  const today = new Date();
  const logs = getAllLogs();
  
  // Trier les logs par date (du plus récent au plus ancien)
  logs.sort((a, b) => {
    return parseISO(b.date).getTime() - parseISO(a.date).getTime();
  });
  
  let streak = 0;
  let previousDate = today;
  
  // Parcourir les logs pour calculer le streak
  for (const log of logs) {
    const logDate = parseISO(log.date);
    
    // Si la différence est supérieure à 1 jour, la série est interrompue
    if (differenceInDays(previousDate, logDate) > 1) {
      break;
    }
    
    // Vérifier si l'habitude a été complétée ce jour-là
    if (log.habits && log.habits[habitId] && log.habits[habitId].completed) {
      streak++;
      previousDate = logDate;
    } else {
      // Si l'habitude n'a pas été complétée aujourd'hui, on interrompt le streak
      // sauf si c'est la date d'aujourd'hui (on ne pénalise pas pour la journée en cours)
      if (format(logDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')) {
        break;
      }
      previousDate = logDate;
    }
  }
  
  // Mettre à jour le streak de l'habitude
  habits[habitIndex].streak = streak;
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

// Récupérer les statistiques d'une habitude
export const getHabitStats = (habitId: string): HabitStats | null => {
  const habits = getAllHabits();
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) {
    return null;
  }
  
  const logs = getAllLogs();
  const today = new Date();
  
  // Calcul du taux de complétion sur différentes périodes
  const calculateCompletionRate = (days: number): number => {
    const startDate = subDays(today, days);
    let completed = 0;
    let total = 0;
    
    for (const log of logs) {
      const logDate = parseISO(log.date);
      
      // Ne considérer que les journées incluses dans la période
      if (isAfter(logDate, startDate)) {
        total++;
        
        if (log.habits && log.habits[habitId] && log.habits[habitId].completed) {
          completed++;
        }
      }
    }
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  // Calculer le plus long streak
  const calculateLongestStreak = (): number => {
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;
    
    // Trier les logs par date (du plus ancien au plus récent)
    const sortedLogs = [...logs].sort((a, b) => {
      return parseISO(a.date).getTime() - parseISO(b.date).getTime();
    });
    
    for (const log of sortedLogs) {
      if (log.habits && log.habits[habitId] && log.habits[habitId].completed) {
        const logDate = parseISO(log.date);
        
        if (!previousDate || differenceInDays(logDate, previousDate) === 1) {
          // Continuation du streak
          currentStreak++;
        } else if (differenceInDays(logDate, previousDate) > 1) {
          // Interruption du streak
          currentStreak = 1;
        }
        
        maxStreak = Math.max(maxStreak, currentStreak);
        previousDate = logDate;
      } else {
        // Reset du streak
        currentStreak = 0;
        previousDate = parseISO(log.date);
      }
    }
    
    return maxStreak;
  };
  
  return {
    habitId,
    streak: habit.streak || 0,
    longestStreak: calculateLongestStreak(),
    completionRates: {
      week: calculateCompletionRate(7),
      month: calculateCompletionRate(30),
      threeMonths: calculateCompletionRate(90),
      sixMonths: calculateCompletionRate(180),
      year: calculateCompletionRate(365),
    }
  };
};

// Initialiser des habitudes par défaut si aucune n'existe
export const initializeDefaultHabits = (): void => {
  const habits = getAllHabits();
  
  if (habits.length === 0) {
    const defaultHabits = [
      {
        name: "Boire 2L d'eau",
        description: "Hydratation quotidienne",
        icon: "💧",
        color: "#3b82f6",
        frequency: "daily",
        active: true
      },
      {
        name: "Méditer 10 minutes",
        description: "Prendre du temps pour soi",
        icon: "🧘",
        color: "#8b5cf6",
        frequency: "daily",
        active: true
      },
      {
        name: "Faire 10 000 pas",
        description: "Rester actif",
        icon: "👣",
        color: "#ef4444",
        frequency: "daily",
        active: true
      }
    ];
    
    defaultHabits.forEach(habit => {
      addHabit(habit as Omit<Habit, 'id' | 'streak' | 'createdAt'>);
    });
  }
};
