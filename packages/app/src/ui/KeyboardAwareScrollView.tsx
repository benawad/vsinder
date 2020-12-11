import React, { ReactNode, useRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useKeyboardContentInset } from "../hooks/useKeyboardContentInset";

export const KeyboardAwareScrollView = React.forwardRef<
  ScrollView,
  ScrollViewProps & { children: ReactNode; scrollToEndOnKeyboardOpen?: boolean }
>(({ scrollToEndOnKeyboardOpen, ...props }, ref) => {
  const localRef = useRef<ScrollView>(null);
  return (
    <ScrollView
      ref={(r) => {
        if (ref) {
          // @ts-ignore
          ref.current = r;
        }
        // @ts-ignore
        localRef.current = r;
      }}
      contentInset={useKeyboardContentInset(() => {
        if (scrollToEndOnKeyboardOpen) {
          localRef.current?.scrollToEnd();
        }
      })}
      {...props}
    />
  );
});
