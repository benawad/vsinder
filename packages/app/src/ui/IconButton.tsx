import React, { useContext } from "react";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export const IconButton: React.FC<
  TouchableOpacityProps & { secondary?: boolean; size?: number }
> = ({ children, secondary, style, size = 40, ...props }) => {
  const [{ buttonBackground, buttonSecondaryBackground }] = useContext(
    ThemeContext
  );
  return (
    <TouchableOpacity
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: secondary
            ? buttonSecondaryBackground
            : buttonBackground,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
