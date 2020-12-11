import React, { Children } from "react";
import { View } from "react-native";

interface FormSpacerProps {}

export const FormSpacer: React.FC<FormSpacerProps> = ({ children }) => {
  return <View style={{ marginBottom: 30 }}>{children}</View>;
};
