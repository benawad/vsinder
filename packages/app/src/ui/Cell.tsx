import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "../hooks/useTheme";
import { MyText } from "./MyText";

interface CellProps {
  onPress: () => void;
}

export const Cell: React.FC<CellProps> = ({ children, onPress }) => {
  const { editorForeground } = useTheme();
  return (
    <TouchableOpacity
      style={{
        borderBottomColor: editorForeground,
        borderBottomWidth: 1,
        padding: 16,
      }}
      onPress={onPress}
    >
      <MyText style={{ fontSize: 18 }}>{children}</MyText>
    </TouchableOpacity>
  );
};
