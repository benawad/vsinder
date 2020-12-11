import React from "react";
import { View } from "react-native";
import { MyHeader } from "./MyHeader";
import { ScreenWrapper } from "./ScreenWrapper";

interface FullscreenMessageProps {
  message: string;
}

export const FullscreenMessage: React.FC<FullscreenMessageProps> = ({
  message,
}) => {
  return (
    <ScreenWrapper>
      <View style={{ marginTop: 20 }}>
        <MyHeader>{message}</MyHeader>
      </View>
    </ScreenWrapper>
  );
};
