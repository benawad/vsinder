import { useState, useEffect, useRef } from "react";
import { Keyboard } from "react-native";

export const useKeyboardContentInset = (onKeyboardOpen?: () => void) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const fn = useRef(() => {});
  if (onKeyboardOpen) {
    fn.current = onKeyboardOpen;
  }
  useEffect(() => {
    const x = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      fn.current();
    });
    return () => {
      x.remove();
    };
  }, []);

  useEffect(() => {
    const x = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      x.remove();
    };
  }, []);

  return { bottom: keyboardHeight };
};
