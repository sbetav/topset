import { useRef } from "react";
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";

export function useScrollGradient(initialShowRight = true) {
  const leftOpacity = useRef(new Animated.Value(0)).current;
  const rightOpacity = useRef(
    new Animated.Value(initialShowRight ? 1 : 0),
  ).current;

  const showLeft = useRef(false);
  const showRight = useRef(initialShowRight);

  function fade(value: Animated.Value, toValue: number) {
    Animated.timing(value, {
      toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const x = contentOffset.x;
    const maxX = contentSize.width - layoutMeasurement.width;

    const shouldShowLeft = x > 4;
    const shouldShowRight = x < maxX - 4;

    if (shouldShowLeft !== showLeft.current) {
      showLeft.current = shouldShowLeft;
      fade(leftOpacity, shouldShowLeft ? 0.9 : 0);
    }

    if (shouldShowRight !== showRight.current) {
      showRight.current = shouldShowRight;
      fade(rightOpacity, shouldShowRight ? 0.9 : 0);
    }
  };

  return { leftOpacity, rightOpacity, handleScroll };
}
