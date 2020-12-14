import { useField } from "formik";
import React from "react";
import { View } from "react-native";
import { CheckboxWithLabel } from "../ui/CheckboxWithLabel";
import { ErrorText } from "../ui/ErrorText";
import { Label } from "../ui/Label";

interface TextFieldProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export const CheckboxGroupField: React.FC<TextFieldProps> = ({
  name,
  label,
  options,
}) => {
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <Label>{label}</Label>
      </View>
      <View style={{ flexDirection: "row", width: "100%" }}>
        {options.map((o, i) => (
          <View
            key={o.value}
            style={{
              marginLeft: i ? 10 : 0,
            }}
          >
            <CheckboxWithLabel
              label={o.label}
              checked={field.value.includes(o.value)}
              big
              onPress={() => {
                if (field.value.includes(o.value)) {
                  setValue(field.value.filter((x: string) => x !== o.value));
                } else {
                  setValue([...field.value, o.value]);
                }
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
