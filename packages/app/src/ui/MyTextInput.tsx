import React, { useContext, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export const MyTextInput: React.FC<TextInputProps> = ({
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [showBorder, setShowBorder] = useState(false);
  const [
    { inputBackground, inputOptionActiveBorder, inputForeground },
  ] = useContext(ThemeContext);
  return (
    <TextInput
      {...props}
      onBlur={(e) => {
        setShowBorder(false);
        onBlur?.(e);
      }}
      underlineColorAndroid="transparent"
      onFocus={(e) => {
        setShowBorder(true);
        onFocus?.(e);
      }}
      style={[
        {
          paddingVertical: 8,
          paddingHorizontal: 6,
          fontSize: 16,
          color: inputForeground,
          backgroundColor: inputBackground,
          borderColor: showBorder ? inputOptionActiveBorder : "transparent",
          borderWidth: 1,
        },
        style,
      ]}
    />
  );
};
