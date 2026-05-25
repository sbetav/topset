import { useCallback, useState } from "react";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { scheduleOnRN } from "react-native-worklets";

export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);
  const setHeightJS = useCallback((value: number) => setHeight(value), []);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        scheduleOnRN(setHeightJS, e.height);
      },
      onEnd: (e) => {
        "worklet";
        scheduleOnRN(setHeightJS, e.height);
      },
    },
    [setHeightJS],
  );

  return height;
}
