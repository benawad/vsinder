import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface LoadingProps {
  isInButton?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isInButton }) => {
  const { buttonBackground, buttonForeground } = useTheme();
  return (
    <ActivityIndicator
      size="large"
      color={isInButton ? buttonForeground : buttonBackground}
    />
  );
};
