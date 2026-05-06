import { router } from "expo-router";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ArrowLeftIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";
import { Icon } from "./icon";
import { Text } from "./text";

type ScreenHeaderProps = {
  title: string;
};

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-center px-6 py-4 border-b border-border bg-surface dark:bg-surface/70">
      <PressableFeedback
        onPress={() => router.back()}
        className="absolute left-5 p-1"
      >
        <Icon as={ArrowLeftIcon} size={20} className="text-muted" />
      </PressableFeedback>
      <Text className="font-semibold">{title}</Text>
    </View>
  );
}
