import { useKeyboard } from "./use-keyboard";

export function useKeyboardBehavior() {
  const { isOpen } = useKeyboard();
  return isOpen ? "padding" : undefined;
}
