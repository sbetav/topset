import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingViewProps } from "react-native";

export function useKeyboardBehavior() {
  const defaultValue: KeyboardAvoidingViewProps["behavior"] = "padding";

  const [behavior, setBehavior] = useState<
    KeyboardAvoidingViewProps["behavior"] | undefined
  >(defaultValue);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehavior(defaultValue);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehavior(undefined);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [defaultValue]);

  return behavior;
}
