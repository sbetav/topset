import GoogleDrive from "@/components/icons/google-drive";
import { ScreenContainer } from "@/components/screen-container";
import ThemeToggle from "@/components/settings/theme-toggle";
import Card from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import { APP_NAME } from "@/lib/constants";
import dayjs from "dayjs";
import { Button } from "heroui-native/button";
import { Description } from "heroui-native/description";
import { Label } from "heroui-native/label";
import React from "react";
import { View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1">
      <ScreenHeader title="Configuración" />
      <ScreenContainer className="flex-1">
        <View className="gap-6 flex-1">
          <View className="gap-2">
            <Text className="text-lg font-semibold ml-1">
              Copia de seguridad
            </Text>
            <Card className="gap-3.5">
              <View className="flex-row items-center gap-3">
                <GoogleDrive width={24} height={24} />
                <View className="flex-1">
                  <Label>
                    <Label.Text>Google Drive</Label.Text>
                  </Label>
                  <Description>Copias de seguridad automáticas</Description>
                </View>
              </View>
              <Button variant="secondary" size="sm">
                Conectar
              </Button>
            </Card>
          </View>

          <View className="gap-2">
            <Text className="text-lg font-semibold ml-1">Preferencias</Text>
            <ThemeToggle />
          </View>
        </View>

        <Text className="text-muted text-xs text-center">
          {APP_NAME} &copy;{dayjs().format("YYYY")}
        </Text>
      </ScreenContainer>
    </View>
  );
}
