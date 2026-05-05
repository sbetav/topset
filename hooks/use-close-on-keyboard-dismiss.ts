import { useEffect } from "react";
import { Keyboard } from "react-native";

interface UseCloseOnKeyboardDismissOptions {
  isEnabled: boolean;
  onClose: () => void;
}

export function useCloseOnKeyboardDismiss({
  isEnabled,
  onClose,
}: UseCloseOnKeyboardDismissOptions) {
  useEffect(() => {
    if (!isEnabled) return;

    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      onClose();
    });

    return () => {
      hideListener.remove();
    };
  }, [isEnabled, onClose]);
}
