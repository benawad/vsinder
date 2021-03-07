import React, { useEffect } from "react";
import { Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMutation, useQueryCache } from "react-query";
import pkg from "../../../package.json";
import { defaultMutationFn, setTokens } from "../../Providers";
import { MeResponse } from "../../types";
import { Cell } from "../../ui/Cell";
import { MyText } from "../../ui/MyText";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { ProfileStackNav } from "./ProfileNav";
import * as Updates from "expo-updates";
import { showMessage } from "react-native-flash-message";
import { FullscreenLoading } from "../../ui/FullscreenLoading";

export const Settings: React.FC<ProfileStackNav<"settings">> = ({
  navigation,
}) => {
  const [status, setStatus] = React.useState<"loading" | "">("");
  const [mutate, { isLoading }] = useMutation(defaultMutationFn);
  const cache = useQueryCache();

  useEffect(() => {
    if (status === "loading") {
      Updates.fetchUpdateAsync()
        .then(() => {
          Updates.reloadAsync();
        })
        .catch((e) => {
          setStatus("");
          showMessage({
            message: (e as Error).message,
            duration: 10000,
            type: "danger",
          });
        });
    }
  }, [status]);

  if (isLoading || status === "loading") {
    return <FullscreenLoading />;
  }

  return (
    <ScreenWrapper noPadding>
      <ScrollView alwaysBounceVertical={false}>
        <Cell onPress={() => navigation.navigate("changeTheme")}>
          Change theme
        </Cell>
        <Cell
          onPress={async () => {
            try {
              const update = await Updates.checkForUpdateAsync();
              if (update.isAvailable) {
                Alert.alert(
                  "Update Available",
                  "Would you like to update now?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        setStatus("loading");
                      },
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                Alert.alert(
                  "You're on the latest version",
                  "",
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                    },
                  ],
                  { cancelable: false }
                );
              }
            } catch (e) {
              showMessage({
                message: (e as Error).message,
                duration: 10000,
                type: "danger",
              });
            }
          }}
        >
          Check for update
        </Cell>
        <Cell
          onPress={() => {
            Alert.alert(
              "Do you want to logout?",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    setTokens("", "");
                    cache.setQueryData<MeResponse>("/me", { user: null });
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          Logout
        </Cell>
        <Cell
          onPress={() => {
            Alert.alert(
              "Confirm delete account",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    try {
                      await mutate(["/account/delete", {}, "POST"]);
                      setTokens("", "");
                      cache.setQueryData<MeResponse>("/me", { user: null });
                    } catch {}
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          Delete account
        </Cell>
        <MyText
          style={{ textAlign: "center", marginTop: 60, marginBottom: 40 }}
        >
          Version: {pkg.version}
        </MyText>
      </ScrollView>
    </ScreenWrapper>
  );
};
