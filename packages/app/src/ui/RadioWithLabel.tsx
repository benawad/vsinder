import React, { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ThemeContext } from "../ThemeProvider";
import { MyText } from "./MyText";
import { Radio, RadioProps } from "./Radio";

type RadioWithLabelProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
} & RadioProps;

export const RadioWithLabel: React.FC<RadioWithLabelProps> = ({
  disabled,
  label,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ flexDirection: "row", paddingVertical: 4, marginTop: -4 }}
    >
      <Radio {...props} />
      <MyText style={{ marginLeft: 6, fontSize: 16 }}>{label}</MyText>
    </TouchableOpacity>
  );
};
