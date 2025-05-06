
import { Habit, HabitEntry, HabitStats } from "@/types";
import { generateId } from "./storage/core";
import { getDailyLog, saveDailyLog } from "./storage/logs";
import { format } from "date-fns";

const HABITS_KEY = "nutrition-tracker-habits";
const DEFAULT_HABITS = [
  {
    id: "habit-water",
    name: "Boire 2L d'eau",
    description: "Boire au moins 2 litres d'eau par jour",
    icon: "💧",
    color: "#3b82f6",
    frequency: "daily",
    active: true,
    streak: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "habit-meditation",
    name: "Méditation",
    description: "Prendre 10 minutes pour méditer",
    icon: "🧘",
    color: "#8b5cf6",
    frequency: "daily",
    active: true,
    streak: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "habit-veggies",
    name: "5 fruits et légumes",
    description: "Manger au moins 5 portions de fruits et légumes",
    icon: "🥦",
    color: "#10b981",
    frequency: "daily",
    active: true,
    streak: 0,
    createdAt: new Date().toISOString()
  }
];

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

// Initialize default habits if none exist
export const initializeDefaultHabits = (): void => {
  const habits = getAllHabits();
  if (habits.length === 0) {
    saveHabits(DEFAULT_HABITS as Habit[]);
  }
};

// Save habits
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

// Add new habit
export const addHabit = (habitData: Partial<Habit>): void => {
  const habits = getAllHabits();
  const newHabit: Habit = {
    id: habitData.id || generateId(),
    name: habitData.name || "Nouvelle habitude",
    description: habitData.description || "",
    icon: habitData.icon || "✅",
    color: habitData.color || "#3b82f6",
    frequency: habitData.frequency || "daily",
    active: habitData.active !== undefined ? habitData.active : true,
    streak: habitData.streak || 0,
    createdAt: habitData.createdAt || new Date().toISOString()
  };
  
  habits.push(newHabit);
  saveHabits(habits);
};

// Update habit
export const updateHabit = (habitId: string, updatedData: Partial<Habit>): boolean => {
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(habit => habit.id === habitId);
  
  if (habitIndex >= 0) {
    habits[habitIndex] = {
      ...habits[habitIndex],
      ...updatedData
    };
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
export const completeHabit = (habitId: string, date: Date = new Date()): void => {
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
  };
  
  // Update streak
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  if (habitIndex >= 0) {
    habits[habitIndex].streak = (habits[habitIndex].streak || 0) + 1;
    saveHabits(habits);
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
  const habits = getAllHabits();
  const habitIndex = habits.findIndex(h => h.id === habitId);
  if (habitIndex >= 0 && habits[habitIndex].streak && habits[habitIndex].streak > 0) {
    habits[habitIndex].streak -= 1;
    saveHabits(habits);
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
