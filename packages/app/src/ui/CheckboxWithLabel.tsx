import React from "react";
import { TouchableOpacity } from "react-native";
import { Checkbox } from "./Checkbox";
import { MyText } from "./MyText";

interface MyCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  big?: boolean;
}

export const CheckboxWithLabel: React.FC<MyCheckboxProps> = ({
  label,
  onPress,
  checked,
  big,
}) => {
  return (
    <TouchableOpacity style={{ flexDirection: "row" }} onPress={onPress}>
      <Checkbox selected={checked} />
      <MyText style={{ marginLeft: 4, fontSize: big ? 16 : undefined }}>
        {label}
      </MyText>
    </TouchableOpacity>
  );
};
