import { cn } from "@/lib/utils";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import React from "react";
import {
    FlatList,
    FlatListProps,
    ScrollView,
    ScrollViewProps,
    View,
    ViewProps,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

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
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      bottomOffset={16}
      contentContainerClassName={cn(
        SCREEN_CLASSNAME,
        contentContainerClassName,
      )}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
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

const RenderScrollComponent = React.forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => (
    <KeyboardAwareScrollView
      bottomOffset={0}
      extraKeyboardSpace={-100}
      {...props}
      ref={ref}
    />
  ),
);

RenderScrollComponent.displayName = "RenderScrollComponent";

const FlashListScreenContainer = <T,>({
  contentContainerClassName,
  contentContainerStyle,
  estimatedItemSize = 80,
  ...props
}: FlashListProps<T> & {
  contentContainerClassName?: string;
  estimatedItemSize?: number;
}) => {
  return (
    <FlashList
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName={cn(
        SCREEN_CLASSNAME,
        contentContainerClassName,
      )}
      contentContainerStyle={contentContainerStyle}
      renderScrollComponent={RenderScrollComponent}
      {...props}
    />
  );
};

export {
    FlashListScreenContainer,
    FlatListScreenContainer,
    ScreenContainer,
    ScrollableScreenContainer
};
