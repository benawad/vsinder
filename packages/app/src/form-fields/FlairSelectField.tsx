import { useField } from "formik";
import React, { ReactNode } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { flairOptions } from "../constants";
import { ErrorText } from "../ui/ErrorText";
import { Flair } from "../ui/Flair";
import { MyButton } from "../ui/MyButton";
import { MyView } from "../ui/MyView";

interface TextFieldProps {
  name: string;
  label: string | ReactNode;
}

export const FlairSelectField: React.FC<TextFieldProps> = ({ name, label }) => {
  const [open, setOpen] = React.useState(false);
  const [field, meta, { setValue }] = useField({ name });
  return (
    <View>
      <MyButton secondary onPress={() => setOpen(true)}>
        {label}
      </MyButton>
      <Modal
        isVisible={open}
        onBackButtonPress={() => setOpen(false)}
        onBackdropPress={() => setOpen(false)}
        style={{
          justifyContent: "flex-end",
          marginBottom: 50,
          marginHorizontal: 20,
        }}
      >
        <View>
          <MyView
            style={{
              maxHeight: 500,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                paddingBottom: 10,
              }}
              keyboardShouldPersistTaps="always"
            >
              {flairOptions.map(({ value }) => {
                return (
                  <TouchableOpacity
                    key={value}
                    style={{
                      padding: 14,
                    }}
                    onPress={() => {
                      setValue(value);
                      setOpen(false);
                    }}
                  >
                    <Flair name={value as any} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </MyView>
          <MyButton style={{ marginTop: 10 }} onPress={() => setOpen(false)}>
            Cancel
          </MyButton>
        </View>
      </Modal>
      {meta.error ? (
        <ErrorText style={{ marginTop: 4 }}>{meta.error}</ErrorText>
      ) : null}
    </View>
  );
};
