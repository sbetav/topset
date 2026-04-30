import { db } from "@/db/client";
import { useThemePersistence } from "@/hooks/use-theme-persistence";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "heroui-native";
import { HeroUINativeProvider } from "heroui-native/provider";
import { Alert, BackHandler } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import migrations from "../db/migrations/migrations";
import "./global.css";

export default function RootLayout() {
  const { theme } = useUniwind();
  const [background] = useThemeColor(["background"]);
  const insets = useSafeAreaInsets();

  const { loaded } = useThemePersistence();
  const { success: migrationsSuccess, error: migrationsError } = useMigrations(
    db,
    migrations,
  );
  const loadingMigrations = !migrationsSuccess && !migrationsError;

  if (migrationsError) {
    return Alert.alert("Error", "Error al aplicar las migraciones", [
      {
        text: "OK",
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
  }

  if (!loaded || loadingMigrations) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider
        config={{
          devInfo: {
            stylingPrinciples: false,
          },
        }}
      >
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: background,
              paddingTop: insets.top,
            },
          }}
        />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
