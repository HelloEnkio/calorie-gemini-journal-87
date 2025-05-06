
import { format } from 'date-fns';
import { DailyLog } from '@/types';
import { Habit, HabitEntry, HabitStats } from '@/types';
import { getAllLogs, saveDailyLog, getLogForDate } from './storage';

const HABITS_KEY = 'nutrition-tracker-habits';

// Get all habits
export const getAllHabits = (): Habit[] => {
  try {
    const habitsJson = localStorage.getItem(HABITS_KEY);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error("Error loading habits:", error);
    return [];
  }
};

// Save habits
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

// Add a new habit
export const addHabit = (habitData: Partial<Habit>): void => {
  const habits = getAllHabits();
  const newHabit: Habit = {
    id: crypto.randomUUID(),
    name: habitData.name || 'New Habit',
    description: habitData.description,
    icon: habitData.icon || '✅',
    color: habitData.color || '#3b82f6',
    frequency: habitData.frequency || 'daily',
    active: habitData.active !== undefined ? habitData.active : true,
    createdAt: new Date().toISOString()
  };
  
  habits.push(newHabit);
  saveHabits(habits);
};

// Update a habit
export const updateHabit = (habitId: string, updatedData: Partial<Habit>): boolean => {
  const habits = getAllHabits();
  const index = habits.findIndex(h => h.id === habitId);
  
  if (index >= 0) {
    habits[index] = { ...habits[index], ...updatedData };
    saveHabits(habits);
    return true;
  }
  
  return false;
};

// Delete a habit
export const deleteHabit = (habitId: string): boolean => {
  const habits = getAllHabits();
  const newHabits = habits.filter(h => h.id !== habitId);
  
  if (newHabits.length < habits.length) {
    saveHabits(newHabits);
    
    // Also remove habit entries from daily logs
    const logs = getAllLogs();
    let modified = false;
    
    for (const log of logs) {
      if (log.habits && log.habits[habitId]) {
        delete log.habits[habitId];
        saveDailyLog(log);
        modified = true;
      }
    }
    
    return true;
  }
  
  return false;
};

// Initialize default habits
export const initializeDefaultHabits = (): void => {
  const existingHabits = getAllHabits();
  
  // Only initialize if no habits exist
  if (existingHabits.length === 0) {
    const defaultHabits: Habit[] = [
      {
        id: 'water',
        name: 'Drink Water',
        icon: 'droplet',
        description: 'Drink 8 glasses of water daily',
        frequency: 'daily',
        active: true,
        createdAt: new Date().toISOString(),
        streak: 0
      },
      {
        id: 'steps',
        name: '10,000 Steps',
        icon: 'footprints',
        description: 'Walk 10,000 steps every day',
        frequency: 'daily',
        active: true,
        createdAt: new Date().toISOString(),
        streak: 0
      },
      {
        id: 'meditation',
        name: 'Meditation',
        icon: 'brain',
        description: 'Meditate for at least 10 minutes',
        frequency: 'daily',
        active: true,
        createdAt: new Date().toISOString(),
        streak: 0
      }
    ];
    
    saveHabits(defaultHabits);
  }
};

// Complete a habit for a specific date
export const completeHabit = (habitId: string, date: Date): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getLogForDate(dateKey);
  
  // Initialize habits object if it doesn't exist
  if (!dayLog.habits) {
    dayLog.habits = {};
  }
  
  // Add the completed habit entry
  const entry: HabitEntry = {
    id: `${habitId}-${dateKey}`,
    habitId: habitId,
    completed: true,
    timestamp: new Date().toISOString()
  };
  
  dayLog.habits[habitId] = entry;
  saveDailyLog(dayLog);
  
  // Update streak
  updateHabitStreak(habitId);
};

// Uncomplete (remove completion of) a habit for a specific date
export const uncompleteHabit = (habitId: string, date: Date): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getLogForDate(dateKey);
  
  if (dayLog.habits && dayLog.habits[habitId]) {
    delete dayLog.habits[habitId];
    saveDailyLog(dayLog);
    
    // Update streak
    updateHabitStreak(habitId);
  }
};

// Toggle a habit's completion status for a specific date
export const toggleHabitCompletion = (habitId: string, date: Date, value: number | boolean = true): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getLogForDate(dateKey);
  
  // Initialize habits object if it doesn't exist
  if (!dayLog.habits) {
    dayLog.habits = {};
  }
  
  // Toggle the completion status
  if (dayLog.habits[habitId]) {
    delete dayLog.habits[habitId];
  } else {
    const entry: HabitEntry = {
      id: `${habitId}-${dateKey}`,
      habitId: habitId,
      completed: true,
      timestamp: new Date().toISOString()
    };
    
    dayLog.habits[habitId] = entry;
  }
  
  saveDailyLog(dayLog);
  
  // Update streak
  updateHabitStreak(habitId);
};

// Update a habit's progress value
export const updateHabitProgress = (habitId: string, date: Date, value: number): void => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const dayLog = getLogForDate(dateKey);
  
  // Initialize habits object if it doesn't exist
  if (!dayLog.habits) {
    dayLog.habits = {};
  }
  
  // If the habit entry exists, update its value; otherwise, create a new one
  if (dayLog.habits[habitId]) {
    dayLog.habits[habitId].value = value;
    dayLog.habits[habitId].completed = value > 0;
  } else {
    const entry: HabitEntry = {
      id: `${habitId}-${dateKey}`,
      habitId,
      completed: value > 0,
      timestamp: new Date().toISOString(),
      value
    };
    
    dayLog.habits[habitId] = entry;
  }
  
  saveDailyLog(dayLog);
  
  // Update streak
  updateHabitStreak(habitId);
};

// Helper function to update a habit's streak
const updateHabitStreak = (habitId: string): void => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  
  if (habitIndex >= 0) {
    const logs = getAllLogs();
    let currentStreak = 0;
    
    // Sort logs by date (latest first)
    const sortedLogs = logs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Count consecutive days with completed habit
    for (const log of sortedLogs) {
      if (log.habits && log.habits[habitId] && log.habits[habitId].completed) {
        currentStreak++;
      } else {
        break; // Break on first day without completion
      }
    }
    
    // Update the habit's streak
    habits[habitIndex].streak = currentStreak;
    saveHabits(habits);
  }
};

// Get habit statistics
export const getHabitStats = (habitId: string, days: number = 30): HabitStats => {
  const logs = getAllLogs();
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);
  
  const relevantLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= today;
  });
  
  let completedCount = 0;
  let totalValues = 0;
  let valueCount = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort logs by date (oldest first)
  relevantLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Count completed habits and calculate streaks
  for (const log of relevantLogs) {
    if (log.habits && log.habits[habitId]) {
      const entry = log.habits[habitId];
      if (entry.completed) {
        completedCount++;
        tempStreak++;
        
        if (entry.value !== undefined) {
          totalValues += entry.value;
          valueCount++;
        }
      } else {
        // Break in streak
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    } else {
      // No entry for this day means incomplete
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  
  // Update longest streak if the current one is longer
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Calculate current streak (from today backwards)
  const reversedLogs = [...relevantLogs].reverse();
  currentStreak = 0;
  
  for (const log of reversedLogs) {
    if (log.habits && log.habits[habitId] && log.habits[habitId].completed) {
      currentStreak++;
    } else {
      break; // Break in streak
    }
  }
  
  return {
    habitId,
    completedCount,
    totalCount: relevantLogs.length,
    streakCurrent: currentStreak,
    streakLongest: longestStreak,
    averageValue: valueCount > 0 ? totalValues / valueCount : undefined
  };
};
