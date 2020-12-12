import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useQuery, useQueryCache } from "react-query";
import { useTheme } from "../hooks/useTheme";
import { defaultQueryFn } from "../Providers";
import { MeResponse } from "../types";
import { MyText } from "./MyText";

interface MessageIconProps {
  size: number;
  color: string;
}

export const MessageIcon: React.FC<MessageIconProps> = ({ size, color }) => {
  const { data } = useQuery<MeResponse>("/me", defaultQueryFn);
  const { inputValidationErrorBorder } = useTheme();
  const cSize = 18;

  return (
    <View style={{ position: "relative" }}>
      <AntDesign name="message1" size={size} color={color} />
      {data?.user?.unreadMatchUserIds.length ? (
        <View
          style={{
            position: "absolute",
            top: -8,
            right: -10,
            minWidth: cSize,
            paddingHorizontal: 4,
            backgroundColor: inputValidationErrorBorder,
            borderRadius: cSize / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MyText>{data.user.unreadMatchUserIds.length}</MyText>
        </View>
      ) : null}
    </View>
  );
};
