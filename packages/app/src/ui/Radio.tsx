import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../ThemeProvider";

export interface RadioProps {
  size?: number;
  checked: boolean;
}

export const Radio: React.FC<RadioProps> = ({ size = 20, checked }) => {
  const [{ buttonBackground }] = useContext(ThemeContext);
  const innerCircleSize = size - 8;
  return (
    <View
      style={{
        borderColor: buttonBackground,
        borderWidth: 2,
        borderRadius: size / 2,
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? (
        <View
          style={{
            width: innerCircleSize,
            height: innerCircleSize,
            borderRadius: innerCircleSize / 2,
            backgroundColor: buttonBackground,
          }}
        />
      ) : null}
    </View>
  );
};
