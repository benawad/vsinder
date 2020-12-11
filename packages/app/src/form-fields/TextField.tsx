import React from "react";
import { useField } from "formik";
import { View, TextInput, TextInputProps } from "react-native";
import { MyText } from "../ui/MyText";
import { Label } from "../ui/Label";
import { MyTextInput } from "../ui/MyTextInput";
import { ErrorText } from "../ui/ErrorText";

interface TextFieldProps extends TextInputProps {
  name: string;
  label: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  ...props
}) => {
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <Label>{label}</Label>
      </View>
      <MyTextInput
        {...props}
        value={field.value}
        onChangeText={(t) => setValue(t)}
      />
      {meta.error ? (
        <ErrorText style={{ marginTop: 4 }}>{meta.error}</ErrorText>
      ) : null}
    </View>
  );
};
