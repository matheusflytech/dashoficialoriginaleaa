import { parse } from "date-fns";

/**
 * Parse Brazilian date format "28/01/2026 14:18:11" to Date object
 */
export const parseBrazilianDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Try parsing with time first (dd/MM/yyyy HH:mm:ss)
  const withTime = parse(dateStr, "dd/MM/yyyy HH:mm:ss", new Date());
  if (!isNaN(withTime.getTime())) return withTime;
  
  // Try with shorter time format (dd/MM/yyyy HH:mm)
  const withShortTime = parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
  if (!isNaN(withShortTime.getTime())) return withShortTime;
  
  // Fallback to date only
  const dateOnly = parse(dateStr, "dd/MM/yyyy", new Date());
  if (!isNaN(dateOnly.getTime())) return dateOnly;
  
  // Last fallback - try ISO
  return new Date(dateStr);
};
