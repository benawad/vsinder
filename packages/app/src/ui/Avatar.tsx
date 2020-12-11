import React from "react";
import { Image } from "react-native";

interface AvatarProps {
  size?: number;
  src: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 50, src }) => {
  return (
    <Image
      style={{ borderRadius: size / 2, width: size, height: size }}
      source={{ uri: src }}
    />
  );
};
