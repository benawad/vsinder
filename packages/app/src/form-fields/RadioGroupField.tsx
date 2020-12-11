import { useField } from "formik";
import React from "react";
import { View } from "react-native";
import { ErrorText } from "../ui/ErrorText";
import { Label } from "../ui/Label";
import { RadioWithLabel } from "../ui/RadioWithLabel";

interface TextFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onValue?: (v: string) => void;
}

export const RadioGroupField: React.FC<TextFieldProps> = ({
  name,
  label,
  onValue,
  options,
}) => {
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <Label>{label}</Label>
      </View>
      <View style={{ flexDirection: "row" }}>
        {options.map((o, i) => (
          <View key={o.value} style={{ marginLeft: i ? 10 : 0 }}>
            <RadioWithLabel
              disabled={o.disabled}
              label={o.label}
              checked={field.value === o.value}
              onPress={() => {
                onValue?.(o.value);
                setValue(o.value);
              }}
            />
          </View>
        ))}
      </View>
      {meta.error ? (
        <ErrorText style={{ marginTop: 4 }}>{meta.error}</ErrorText>
      ) : null}
    </View>
  );
};
