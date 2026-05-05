import { cn } from "@/lib/utils";
import React from "react";
import {
    FlatList,
    FlatListProps,
    ScrollView,
    ScrollViewProps,
    View,
    ViewProps,
} from "react-native";

const SCREEN_CLASSNAME = "p-5 pb-7";

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

const FlatListScreenContainer = <T,>({
  contentContainerClassName,
  ...props
}: FlatListProps<T>) => {
  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={cn(
        SCREEN_CLASSNAME,
        contentContainerClassName,
      )}
      {...props}
    />
  );
};

export { FlatListScreenContainer, ScreenContainer, ScrollableScreenContainer };
