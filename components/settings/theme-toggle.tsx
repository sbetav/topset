import { ControlField } from "heroui-native/control-field";
import { Description } from "heroui-native/description";
import { Label } from "heroui-native/label";
import { View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";
import Card from "../ui/card";

export default function ThemeToggle() {
  const { theme } = useUniwind();

  return (
    <Card className="w-full">
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
          <Description>Cambia el tema de la aplicación</Description>
        </View>
        <ControlField.Indicator />
      </ControlField>
    </Card>
  );
}
