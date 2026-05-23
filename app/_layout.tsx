import { db } from "@/db/client";
import { useKeyboard } from "@/hooks/use-keyboard";
import { useThemePersistence } from "@/hooks/use-theme-persistence";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "heroui-native";
import { HeroUINativeProvider } from "heroui-native/provider";
import { Alert, BackHandler, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import migrations from "../db/migrations/migrations";
import "./global.css";

dayjs.locale("es", {
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  weekdays: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
});

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
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useKeyboard({
    onClose: () =>
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedInput()),
  });

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

  if (!loaded || loadingMigrations || !fontsLoaded) return null;

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
          initialRouteName="(tabs)"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: background,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
            animation: "ios_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="exercise" />
          <Stack.Screen name="session" />
          <Stack.Screen name="settings" />
        </Stack>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
