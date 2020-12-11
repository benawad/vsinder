import { Formik } from "formik";
import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  fontOptions,
  languageOptions,
  themeOptions,
} from "../../carbon-constants";
import { SelectField } from "../../form-fields/SelectField";
import { TextField } from "../../form-fields/TextField";
import { FormSpacer } from "../../ui/FormSpacer";
import { KeyboardAwareScrollView } from "../../ui/KeyboardAwareScrollView";
import { MyButton } from "../../ui/MyButton";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { genId } from "../../utils";
import { ProfileStackNav } from "./ProfileNav";
import { useCodeImgs } from "./useCodeImgs";

export const CodeSnippeter: React.FC<ProfileStackNav<"codeSnippeter">> = ({
  navigation,
  route: { params },
}) => {
  const scrollView = useRef<ScrollView>(null);
  return (
    <ScreenWrapper>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          code: "",
          language: "auto",
          theme: "vscode",
          fontFamily: "Fira Code",
        }}
        validate={(v) => (v.code ? {} : { code: "required" })}
        onSubmit={async (values) => {
          const tmpId = genId();
          const { codeImgs, set } = useCodeImgs.getState();
          set({ codeImgs: [...codeImgs, { tmpId, value: "" }] });
          if (params?.replace) {
            navigation.replace("manageCodePics");
          } else {
            navigation.navigate("manageCodePics");
          }
          try {
            const r = await fetch(
              "https://x9lecdo5aj.execute-api.us-east-1.amazonaws.com/code-to-img",
              {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (r.status !== 200) {
              throw new Error(await r.text());
            }
            const { key } = await r.json();
            if (!key) {
              throw new Error("bad input");
            }
            const { codeImgs, set } = useCodeImgs.getState();
            set({
              codeImgs: codeImgs.map((x) =>
                x.tmpId === tmpId ? { tmpId, value: key } : x
              ),
            });
          } catch (err) {
            showMessage({
              message: err.message,
              duration: 10000,
              type: "danger",
            });
            const { codeImgs, set } = useCodeImgs.getState();
            set({
              codeImgs: codeImgs.filter((x) => x.tmpId !== tmpId),
            });
          }
        }}
      >
        {({ values, handleSubmit }) => {
          return (
            <KeyboardAwareScrollView
              ref={scrollView}
              scrollToEndOnKeyboardOpen
              automaticallyAdjustContentInsets={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormSpacer>
                <SelectField
                  label="Syntax Highlighting:"
                  name="language"
                  options={languageOptions}
                />
              </FormSpacer>
              <FormSpacer>
                <SelectField
                  label="Theme:"
                  name="theme"
                  options={themeOptions}
                />
              </FormSpacer>
              <FormSpacer>
                <SelectField
                  label="Font Family:"
                  name="fontFamily"
                  options={fontOptions}
                />
              </FormSpacer>
              <FormSpacer>
                <TextField
                  autoCapitalize="none"
                  multiline
                  numberOfLines={4}
                  name="code"
                  label={`Code ${values.code.length}/600`}
                />
              </FormSpacer>
              <MyButton onPress={() => handleSubmit()}>
                save code snippet
              </MyButton>
              <View style={{ height: 30 }} />
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
    </ScreenWrapper>
  );
};
