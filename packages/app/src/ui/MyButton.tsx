import React, { useContext } from "react";
import { Text, TouchableOpacityProps, TouchableOpacity } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export const MyButton: React.FC<
  TouchableOpacityProps & { secondary?: boolean }
> = ({ children, secondary, style, ...props }) => {
  const [
    {
      buttonBackground,
      buttonForeground,
      buttonSecondaryBackground,
      buttonSecondaryForeground,
    },
  ] = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        {
          width: "100%",
          paddingVertical: 10,
          paddingHorizontal: 4,
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
      {typeof children === "string" ||
      (Array.isArray(children) && typeof children[0] === "string") ? (
        <Text
          style={{
            color: secondary ? buttonSecondaryForeground : buttonForeground,
            fontSize: 17,
            fontWeight: "600",
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
