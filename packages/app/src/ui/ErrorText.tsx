import React, { useContext } from "react";
import { TextProps, Text } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export const ErrorText: React.FC<TextProps> = ({
  children,
  style,
  ...props
}) => {
  const [{ inputValidationErrorBorder }] = useContext(ThemeContext);
  return (
    <Text {...props} style={[style, { color: inputValidationErrorBorder }]}>
      {children}
    </Text>
  );
};
