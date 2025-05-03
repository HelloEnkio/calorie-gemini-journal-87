
import { DailyLog } from "@/types";

// Key constants
export const DAILY_LOGS_KEY = 'nutrition-tracker-daily-logs';
export const ACHIEVEMENTS_KEY = 'nutrition-tracker-achievements';
export const USER_GOALS_KEY = 'nutrition-tracker-user-goals';

// Helper for formatting dates consistently
export const formatDateKey = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper for generating IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Get all logs
export const getAllLogs = (): DailyLog[] => {
  const logsJson = localStorage.getItem(DAILY_LOGS_KEY);
  return logsJson ? JSON.parse(logsJson) : [];
};
