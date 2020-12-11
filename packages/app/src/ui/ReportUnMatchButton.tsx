import { TouchableOpacity } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useMutation, useQueryCache } from "react-query";
import { defaultMutationFn } from "../Providers";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MatchesStackNav } from "../modules/MatchesStack/MatchesNav";
import { MatchesResponse } from "../types";
import { ReportDialog } from "./ReportDialog";

interface ReportUnMatchButtonProps {}

export const ReportUnMatchButton: React.FC<ReportUnMatchButtonProps> = ({}) => {
  const { buttonBackground } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const cache = useQueryCache();
  const navigation = useNavigation();
  const [mutate] = useMutation(defaultMutationFn, {
    onSuccess: () => {
      navigation.goBack();
      cache.setQueryData<MatchesResponse>("/matches/0", (m) => {
        return {
          matches: m?.matches.filter((x) => x.userId !== params.id) || [],
        };
      });
    },
  });
  const { params } = useRoute<MatchesStackNav<"messages">["route"]>();
  return (
    <ReportDialog
      onReportMessage={(message) => {
        mutate([
          "/report",
          { message, unmatchOrReject: "unmatch", userId: params.id },
          "POST",
        ]);
      }}
    >
      {(setOpen) => (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 15,
          }}
          onPress={() => {
            const options = ["Report", "Unmatch", "Cancel"];
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
                  setOpen(true);
                } else if (buttonIndex === 1) {
                  mutate([`/unmatch`, { userId: params.id }, "POST"]);
                }
              }
            );
          }}
        >
          <MaterialIcons name="bug-report" size={27} color={buttonBackground} />
        </TouchableOpacity>
      )}
    </ReportDialog>
  );
};
