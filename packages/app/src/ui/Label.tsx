import React from "react";
import { MyText } from "./MyText";

interface LabelProps {}

export const Label: React.FC<LabelProps> = ({ children }) => {
  return <MyText style={{ fontSize: 14 }}>{children}</MyText>;
};
