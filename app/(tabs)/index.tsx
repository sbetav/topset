import { ScreenContainer } from "@/components/screen-container";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { Link } from "expo-router";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { GearIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";

const Home = () => {
  return (
    <ScreenContainer>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold tracking-tight">
          {dayjs().format("dddd, D [de] MMMM [de] YYYY")}
        </Text>
        <Link href="/settings" asChild>
          <PressableFeedback className="p-2.5 rounded-xl bg-surface border border-border">
            <Icon as={GearIcon} size={20} className="text-muted" />
          </PressableFeedback>
        </Link>
      </View>
    </ScreenContainer>
  );
};

export default Home;
