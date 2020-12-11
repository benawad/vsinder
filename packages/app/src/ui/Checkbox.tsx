import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { TextStyle } from "react-native";
import { ThemeContext } from "../ThemeProvider";

interface Props {
  style?: TextStyle;
  selected: boolean;
}

const size = 20;

export const Checkbox: React.FC<Props> = ({ selected, style }) => {
  const [{ buttonBackground }] = React.useContext(ThemeContext);
  return selected ? (
    <MaterialCommunityIcons
      style={[style, { height: size }]}
      color={buttonBackground}
      size={size}
      name="checkbox-marked"
    />
  ) : (
    <MaterialCommunityIcons
      style={[style, { height: size }]}
      size={size}
      color={buttonBackground}
      name="checkbox-blank-outline"
    />
  );
};
