import React from "react";
import { useField } from "formik";
import { View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ErrorText } from "../ui/ErrorText";
import { MyButton } from "../ui/MyButton";

interface TextFieldProps {
  name: string;
  label: string;
}

export const DatePickerField: React.FC<TextFieldProps> = ({ name, label }) => {
  const [open, setOpen] = React.useState(false);
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <MyButton secondary onPress={() => setOpen(true)}>
        {label}
      </MyButton>
      <DateTimePickerModal
        date={field.value}
        isVisible={open}
        mode="date"
        onConfirm={(dt) => {
          setValue(dt);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
      {meta.error ? (
        <ErrorText style={{ marginTop: 4 }}>{meta.error}</ErrorText>
      ) : null}
    </View>
  );
};
