import { useField } from "formik";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { ErrorText } from "../ui/ErrorText";
import { Label } from "../ui/Label";
import { MyButton } from "../ui/MyButton";
import { MyText } from "../ui/MyText";
import { MyView } from "../ui/MyView";
import { SelectModal } from "../ui/SelectModal";

interface TextFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectField: React.FC<TextFieldProps> = ({
  name,
  label,
  options,
}) => {
  const [open, setOpen] = React.useState(false);
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <View style={{ marginBottom: 4 }}>
        <Label>{label}</Label>
      </View>
      <MyButton secondary onPress={() => setOpen(true)}>
        {options.find((x) => x.value === field.value)?.label || ""}
      </MyButton>
      <SelectModal
        isVisible={open}
        onBackButtonPress={() => setOpen(false)}
        onBackdropPress={() => setOpen(false)}
        options={options}
        onItem={(item) => {
          setValue(item.value);
          setOpen(false);
        }}
      />
      {meta.error ? (
        <ErrorText style={{ marginTop: 4 }}>{meta.error}</ErrorText>
      ) : null}
    </View>
  );
};
