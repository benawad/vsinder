import React from "react";
import { ActivityIndicator, TouchableOpacityProps } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { MyButton } from "./MyButton";

export const LoadingButton: React.FC<
  TouchableOpacityProps & { isLoading: boolean }
> = ({ isLoading, children, disabled, ...props }) => {
  const { buttonForeground } = useTheme();
  return (
    <MyButton {...props} disabled={disabled || isLoading}>
      {isLoading ? <ActivityIndicator color={buttonForeground} /> : children}
    </MyButton>
  );
};
