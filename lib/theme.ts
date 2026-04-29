import { storage } from "@/lib/mmkv";

const THEME_KEY = "app_theme";

export type AppTheme = "light" | "dark";

export function getStoredTheme(): AppTheme | null {
  const value = storage.getString(THEME_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function setStoredTheme(theme: AppTheme) {
  storage.set(THEME_KEY, theme);
}
