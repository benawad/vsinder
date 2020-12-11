import React, { useContext } from "react";
import { View, ViewProps } from "react-native";
import { ThemeContext } from "../ThemeProvider";

interface MyViewProps {}

export const MyView: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const [{ editorBackground }] = useContext(ThemeContext);
  return (
    <View {...props} style={[style, { backgroundColor: editorBackground }]}>
      {children}
    </View>
  );
};
