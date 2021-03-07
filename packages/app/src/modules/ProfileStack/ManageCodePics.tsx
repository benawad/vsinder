import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useMutation, useQueryCache } from "react-query";
import { defaultMutationFn } from "../../Providers";
import { MeResponse } from "../../types";
import { CodeImage } from "../../ui/CodeImage";
import { Loading } from "../../ui/Loading";
import { LoadingButton } from "../../ui/LoadingButton";
import { MyText } from "../../ui/MyText";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { SelectModal } from "../../ui/SelectModal";
import { ProfileStackNav } from "./ProfileNav";
import { useCodeImgs } from "./useCodeImgs";

import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { showMessage } from "react-native-flash-message";
const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const closed = { open: false, start: 0 };
export const ManageCodePics: React.FC<ProfileStackNav<"manageCodePics">> = ({
  navigation,
}) => {
  const [{ open, start }, setOpen] = useState(closed);
  const { showActionSheetWithOptions } = useActionSheet();
  const { codeImgs, set } = useCodeImgs();
  const cache = useQueryCache();
  const [mutate, { isLoading }] = useMutation(defaultMutationFn);
  const { inputBackground, inputForeground } = useTheme();
  const loadingSomeImgs = codeImgs.some((x) => !x.value);
  return (
    <ScreenWrapper>
      <SelectModal
        isVisible={open}
        onBackButtonPress={() => setOpen(closed)}
        onBackdropPress={() => setOpen(closed)}
        options={codeImgs.map((_, i) => ({ value: i, label: "" + i }))}
        onItem={(item) => {
          const newList = [...codeImgs];
          const target = item.value as number;

          if (start < target) {
            newList.splice(target + 1, 0, newList[start]);
            newList.splice(start, 1);
          } else {
            newList.splice(target, 0, newList[start]);
            newList.splice(start + 1, 1);
          }
          set({ codeImgs: newList });
          setOpen(closed);
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {codeImgs.map(({ value, tmpId }, i) =>
          !value ? (
            <View
              key={tmpId}
              style={[
                styles.card,
                {
                  borderRadius: 9,
                  padding: 16,
                  backgroundColor: inputBackground,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                },
              ]}
            >
              <MyText
                style={{
                  color: inputForeground,
                  fontSize: 18,
                  marginBottom: 20,
                }}
              >
                generating image
              </MyText>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              key={tmpId}
              style={styles.card}
              onPress={() => {
                const options = ["Delete", "Move", "Cancel"];
                const destructiveButtonIndex = 0;
                const cancelButtonIndex = 2;
                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      set({
                        codeImgs: codeImgs.filter((x) => x.tmpId !== tmpId),
                      });
                    } else if (buttonIndex === 1) {
                      setOpen({ open: true, start: i });
                    }
                  }
                );
              }}
            >
              <CodeImage id={value} />
            </TouchableOpacity>
          )
        )}
      </ScrollView>
      <View style={{ height: 20 }} />
      <LoadingButton
        disabled={loadingSomeImgs}
        isLoading={isLoading}
        onPress={async () => {
          if (!codeImgs.length) {
            showMessage({
              message: "You need to add at least 1 code image",
              duration: 10000,
              type: "danger",
            });
            return;
          }
          try {
            const ids = codeImgs.map((x) => x.value);
            await mutate(["/user/imgs", { codeImgIds: ids }, "PUT"]);
            const d = cache.getQueryData<MeResponse>("/me");
            if (d) {
              cache.setQueryData("/me", {
                user: { ...d.user, codeImgIds: ids },
              });
            }
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
            // navigation.reset({ routes: [{ name: "viewProfile" }] });
          } catch {}
        }}
      >
        {loadingSomeImgs ? "Wait while images are getting generated" : "Save"}
      </LoadingButton>
    </ScreenWrapper>
  );
};
