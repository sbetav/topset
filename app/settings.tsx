import GoogleDrive from "@/components/icons/google-drive";
import { ScreenContainer } from "@/components/screen-container";
import ThemeToggle from "@/components/settings/theme-toggle";
import Card from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { APP_NAME } from "@/lib/constants";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Description } from "heroui-native/description";
import { Label } from "heroui-native/label";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ArrowLeftIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";

export default function Settings() {
  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-center px-6 py-4 border-b border-border bg-surface dark:bg-surface/70">
        <PressableFeedback
          onPress={() => router.back()}
          className="absolute left-6"
        >
          <Icon as={ArrowLeftIcon} size={20} className="text-muted" />
        </PressableFeedback>
        <Text className="font-semibold">Configuración</Text>
      </View>
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
