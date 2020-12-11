import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { useQuery, useQueryCache } from "react-query";
import { defaultMutationFn, setTokens } from "../../Providers";
import { registerForPushNotifications } from "../../registerForPushNotifications";
import { MeResponse } from "../../types";
import { Center } from "../../ui/Center";
import { Loading } from "../../ui/Loading";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { AuthStackNav } from "./AuthNav";
const key = "@vsinder/notif-ask";

export const TokensScreen: React.FC<AuthStackNav<"tokens">> = ({
  route: {
    params: { accessToken, refreshToken },
  },
}) => {
  const cache = useQueryCache();
  const { refetch } = useQuery<MeResponse>("/me", { enabled: false });
  useEffect(() => {
    setTokens(accessToken, refreshToken);
    refetch().then((u) => {
      if (!u?.user || u.user.hasPushToken) {
        return;
      }
      AsyncStorage.getItem(key).then((x) => {
        if (x) {
          return;
        }

        registerForPushNotifications().then((pushToken) => {
          AsyncStorage.setItem(key, "true");
          if (!pushToken) {
            return;
          }

          defaultMutationFn([`/user/push-token`, { pushToken }, "PUT"]).then(
            () => {
              cache.setQueryData<MeResponse>(`/me`, (u) => {
                return {
                  user: {
                    ...u!.user!,
                    hasPushToken: true,
                  },
                };
              });
            }
          );
        });
      });
    });
  }, [refreshToken, accessToken, refetch]);
  return (
    <ScreenWrapper>
      <Center>
        <Loading />
      </Center>
    </ScreenWrapper>
  );
};
