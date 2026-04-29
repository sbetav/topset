import { ControlField } from "heroui-native/control-field";
import { Description } from "heroui-native/description";
import { Label } from "heroui-native/label";
import { Surface } from "heroui-native/surface";
import { View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

export default function ThemeToggle() {
  const { theme } = useUniwind();

  return (
    <Surface className="px-5 py-4 w-full">
      <ControlField
        isSelected={theme === "dark"}
        onSelectedChange={() =>
          Uniwind.setTheme(theme === "dark" ? "light" : "dark")
        }
      >
        <View className="flex-1">
          <Label>
            <Label.Text>Modo oscuro</Label.Text>
          </Label>
          <Description>Cambia entre modo claro y oscuro</Description>
        </View>
        <ControlField.Indicator />
      </ControlField>
    </Surface>
  );
}
