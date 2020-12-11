import React from "react";
import FlashMessage from "react-native-flash-message";
import "react-native-gesture-handler";
import { setConsole } from "react-query";
import { Providers } from "./Providers";
import { Routes } from "./Routes";

setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
});

interface indexProps {}

export const index: React.FC<indexProps> = ({}) => {
  return (
    <Providers>
      <FlashMessage position="top" />
      <Routes />
    </Providers>
  );
};
