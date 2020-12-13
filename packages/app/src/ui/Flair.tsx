import React from "react";
import { Image } from "react-native";
interface FlairProps {
  size?: number;
  name: keyof typeof flairMap;
}

export const flairMap = {
  kubernetes: "kubernetes.png",
  python: "python.png",
  flutter: "flutter.png",
  angular: "angular.png",
  cpp: "cpp.png",
  haskell: "haskell.png",
  java: "java.png",
  rust: "rust.png",
  vue: "vue.png",
  javascript: "javascript.png",
  go: "go.png",
  cSharp: "cSharp.png",
  html: "html.png",
  swift: "swift.png",
  react: "react.png",
  kafka: "kafka.png",
  c: "c.png",
  typescript: "typescript.png",
  css: "css.png",
  dart: "dart.png",
  svelte: "svelte.png",
  kotlin: "kotlin.png",
  ruby: "ruby.png",
  tailwindcss: "tailwindcss.png",
  ionic: "ionic.png",
  bash: "bash.png",
  php: "php.png"
};

export const Flair: React.FC<FlairProps> = ({ size = 24, name }) => {
  if (!(name in flairMap)) {
    return null;
  }
  return (
    <Image
      source={{
        uri: `https://flair.benawad.com/` + flairMap[name],
      }}
      style={{ height: size, width: size }}
    />
  );
};
