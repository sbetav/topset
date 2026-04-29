import { useThemePersistence } from "@/hooks/use-theme-persistence";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColor } from "heroui-native";
import { HeroUINativeProvider } from "heroui-native/provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUniwind } from "uniwind";
import "./global.css";

export default function RootLayout() {
  const { theme } = useUniwind();
  const [background] = useThemeColor(["background"]);
  const insets = useSafeAreaInsets();

  const { loaded } = useThemePersistence();
  if (!loaded) return null;

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
