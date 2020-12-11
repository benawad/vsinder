import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import { ThemeContext } from "../ThemeProvider";

interface ScreenWrapperProps {
  noPadding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  noPadding,
}) => {
  const [{ editorBackground }] = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={{
        backgroundColor: editorBackground,
        flex: 1,
        width: "100%",
      }}
    >
      <View
        style={{
          padding: noPadding ? 0 : 16,
          flex: 1,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
