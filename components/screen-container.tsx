import { cn } from "@/lib/utils";
import React from "react";
import { ScrollView, ScrollViewProps, View, ViewProps } from "react-native";

const SCREEN_CLASSNAME = "p-6 pb-7";

const ScreenContainer = ({ children, className, ...props }: ViewProps) => {
  return (
    <View className={cn(SCREEN_CLASSNAME, className)} {...props}>
      {children}
    </View>
  );
};

const ScrollableScreenContainer = ({
  children,
  contentContainerClassName,
  ...props
}: ScrollViewProps) => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={cn(
        SCREEN_CLASSNAME,
        contentContainerClassName,
      )}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

export { ScreenContainer, ScrollableScreenContainer };
