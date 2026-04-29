import { getStoredTheme, setStoredTheme } from "@/lib/theme";
import { useEffect, useRef, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";

export function useThemePersistence() {
  const { theme } = useUniwind();
  const hydratedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    if (storedTheme) Uniwind.setTheme(storedTheme);
    hydratedRef.current = true;
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (theme === "light" || theme === "dark") setStoredTheme(theme);
  }, [theme]);

  return { loaded };
}
