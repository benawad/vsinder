import { Formik } from "formik";
import React from "react";
import { useMutation } from "react-query";
import { TextField } from "../../form-fields/TextField";
import { defaultMutationFn } from "../../Providers";
import { FormSpacer } from "../../ui/FormSpacer";
import { KeyboardAwareScrollView } from "../../ui/KeyboardAwareScrollView";
import { LoadingButton } from "../../ui/LoadingButton";
import { MyButton } from "../../ui/MyButton";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { AuthStackNav } from "./AuthNav";
const yup = require("yup");

interface EmailLoginProps {}

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});

export const EmailLogin: React.FC<AuthStackNav<"EmailLogin">> = ({
  navigation,
}) => {
  const [mutate, { isLoading }] = useMutation(defaultMutationFn);
  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Formik
          validationSchema={schema}
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            const tokens = await mutate(["/email/login", values, "POST"]);
            navigation.navigate("tokens", tokens);
          }}
        >
          {({ handleSubmit }) => (
            <>
              <FormSpacer>
                <TextField
                  label="Email"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  name="email"
                />
              </FormSpacer>
              <FormSpacer>
                <TextField
                  autoCapitalize="none"
                  label="Password"
                  secureTextEntry
                  textContentType="password"
                  name="password"
                />
              </FormSpacer>
              <LoadingButton
                isLoading={isLoading}
                onPress={() => handleSubmit()}
              >
                Login
              </LoadingButton>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};
