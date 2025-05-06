
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
export const addHabit = (habit: Habit): void => {
  const habits = getAllHabits();
  habits.push(habit);
  saveHabits(habits);
};

// Update a habit
export const updateHabit = (habitId: string, updatedHabit: Habit): boolean => {
  const habits = getAllHabits();
  const index = habits.findIndex(h => h.id === habitId);
  
  if (index >= 0) {
    habits[index] = updatedHabit;
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
        frequency: 'daily',
        goal: 8,
        unit: 'glasses',
        category: 'health',
        color: 'blue'
      },
      {
        id: 'steps',
        name: '10,000 Steps',
        icon: 'footprints',
        frequency: 'daily',
        goal: 10000,
        unit: 'steps',
        category: 'fitness',
        color: 'green'
      },
      {
        id: 'meditation',
        name: 'Meditation',
        icon: 'brain',
        frequency: 'daily',
        goal: 10,
        unit: 'minutes',
        category: 'wellness',
        color: 'purple'
      }
    ];
    
    saveHabits(defaultHabits);
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
      date: dateKey,
      completed: true,
      value: typeof value === 'number' ? value : undefined
    };
    
    dayLog.habits[habitId] = entry;
  }
  
  saveDailyLog(dayLog);
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
    const entry = dayLog.habits[habitId];
    entry.value = value;
    entry.completed = value > 0;
  } else {
    const entry: HabitEntry = {
      id: `${habitId}-${dateKey}`,
      habitId,
      date: dateKey,
      completed: value > 0,
      value
    };
    
    dayLog.habits[habitId] = entry;
  }
  
  saveDailyLog(dayLog);
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
