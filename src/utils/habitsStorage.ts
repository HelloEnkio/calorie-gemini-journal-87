
import { Habit, HabitEntry } from "@/types";
import { generateId } from "./storage/core";
import { getDailyLog, saveDailyLog } from "./storage/logs";
import { format } from "date-fns";

const HABITS_KEY = "nutrition-tracker-habits";

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

// Add new habit
export const addHabit = (habit: Habit): void => {
  const habits = getAllHabits();
  habits.push({
    ...habit,
    id: habit.id || generateId(),
    createdAt: habit.createdAt || new Date().toISOString(),
    active: habit.active !== undefined ? habit.active : true,
    streak: habit.streak || 0
  });
  saveHabits(habits);
};

// Update habit
export const updateHabit = (updatedHabit: Habit): boolean => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(habit => habit.id === updatedHabit.id);
  
  if (habitIndex >= 0) {
    habits[habitIndex] = updatedHabit;
    saveHabits(habits);
    return true;
  }
  
  return false;
};

// Delete habit
export const deleteHabit = (habitId: string): boolean => {
  const habits = getAllHabits();
  const filteredHabits = habits.filter(habit => habit.id !== habitId);
  
  if (filteredHabits.length < habits.length) {
    saveHabits(filteredHabits);
    return true;
  }
  
  return false;
};

// Complete a habit for the day
export const completeHabit = (habitId: string, date: Date = new Date(), value?: number): void => {
  const dateKey = format(date, "yyyy-MM-dd");
  const dayLog = getDailyLog(dateKey);
  
  // Initialize habits object if it doesn't exist
  if (!dayLog.habits) {
    dayLog.habits = {};
  }
  
  // Create or update habit entry
  dayLog.habits[habitId] = {
    id: generateId(),
    habitId,
    completed: true,
    timestamp: new Date().toISOString(),
    date: dateKey,
    value
  };
  
  // Update streak
  const habit = getAllHabits().find(h => h.id === habitId);
  if (habit) {
    habit.streak = (habit.streak || 0) + 1;
    updateHabit(habit);
  }
  
  saveDailyLog(dayLog);
};

// Uncomplete a habit for the day
export const uncompleteHabit = (habitId: string, date: Date = new Date()): void => {
  const dateKey = format(date, "yyyy-MM-dd");
  const dayLog = getDailyLog(dateKey);
  
  // If no habits or the habit is not completed, do nothing
  if (!dayLog.habits || !dayLog.habits[habitId]) {
    return;
  }
  
  // Update habit entry to not completed
  dayLog.habits[habitId].completed = false;
  
  // Update streak
  const habit = getAllHabits().find(h => h.id === habitId);
  if (habit && habit.streak && habit.streak > 0) {
    habit.streak -= 1;
    updateHabit(habit);
  }
  
  saveDailyLog(dayLog);
};

// Check if a habit is completed for the day
export const isHabitCompletedForDay = (habitId: string, date: Date = new Date()): boolean => {
  const dateKey = format(date, "yyyy-MM-dd");
  const dayLog = getDailyLog(dateKey);
  
  return !!(dayLog.habits && dayLog.habits[habitId] && dayLog.habits[habitId].completed);
};

// Get habit value for the day
export const getHabitValueForDay = (habitId: string, date: Date = new Date()): number | undefined => {
  const dateKey = format(date, "yyyy-MM-dd");
  const dayLog = getDailyLog(dateKey);
  
  return dayLog.habits && dayLog.habits[habitId] ? dayLog.habits[habitId].value : undefined;
};

// Get stats for a habit
export const getHabitStats = (habitId: string): HabitStats => {
  // Implementation for habit statistics
  return {
    habitId,
    completedCount: 0,
    totalCount: 0,
    streakCurrent: 0,
    streakLongest: 0,
    streak: 0,
    longestStreak: 0,
    completionRates: {
      week: 0,
      month: 0,
      threeMonths: 0,
      year: 0
    }
  };
};
