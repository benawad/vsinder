import React, { useContext } from "react";
import { TextProps, Text } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export const MyText: React.FC<TextProps> = ({ children, style, ...props }) => {
  const [{ editorForeground }] = useContext(ThemeContext);
  return (
    <Text {...props} style={[style, { color: editorForeground }]}>
      {children}
    </Text>
  );
};
