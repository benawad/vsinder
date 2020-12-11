import React, { useContext } from "react";
import { TextProps, Text } from "react-native";
import { ThemeContext } from "../ThemeProvider";
import { MyText } from "./MyText";

export const MyHeader: React.FC<TextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <MyText {...props} style={[style, { fontSize: 20 }]}>
      {children}
    </MyText>
  );
};
