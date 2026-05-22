import { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";

type UseKeyboardOptions = {
  onOpen?: () => void;
  onClose?: () => void;
};

export function useKeyboard({ onOpen, onClose }: UseKeyboardOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setIsOpen(true);
      onOpenRef.current?.();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setIsOpen(false);
      onCloseRef.current?.();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return { isOpen };
}
