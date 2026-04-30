import { getStoredTheme, setStoredTheme } from "@/lib/theme";
import { useEffect, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";

export function useThemePersistence() {
  const { theme } = useUniwind();
  const [loaded, setLoaded] = useState(false);

  // hydrate on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    if (storedTheme) Uniwind.setTheme(storedTheme);
    setLoaded(true);
  }, []);

  // persist on change, but skip until loaded
  useEffect(() => {
    if (!loaded) return;
    if (theme === "light" || theme === "dark") setStoredTheme(theme);
  }, [theme, loaded]);

  return { loaded };
}
