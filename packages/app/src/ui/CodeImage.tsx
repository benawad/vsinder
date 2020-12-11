import React from "react";
import { Dimensions, Image, View } from "react-native";

interface CodeImageProps {
  id: string;
}

const { width } = Dimensions.get("window");
const padding = 16;
export const codeImageWidth = width - padding * 2;
export const codeImageHeight = (codeImageWidth * 10) / 7;

export const CodeImage: React.FC<CodeImageProps> = ({ id }) => {
  return (
    <Image
      style={{
        borderRadius: 9,
        height: codeImageHeight,
        width: codeImageWidth,
      }}
      resizeMode="contain"
      source={{ uri: `https://img.vsinder.com/${id}` }}
    />
  );
};
