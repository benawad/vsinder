import { useFocusEffect } from "@react-navigation/native";
import {
  dismissAllNotificationsAsync,
  getPresentedNotificationsAsync,
} from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useQuery, useQueryCache } from "react-query";
import { useOnWebSocket } from "../../hooks/useOnWebSocket";
import { useTheme } from "../../hooks/useTheme";
import { defaultQueryFn } from "../../Providers";
import { MatchesResponse, MeResponse } from "../../types";
import { Avatar } from "../../ui/Avatar";
import { Flair } from "../../ui/Flair";
import { FullscreenLoading } from "../../ui/FullscreenLoading";
import { FullscreenMessage } from "../../ui/FullscreenMessage";
import { MyText } from "../../ui/MyText";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { compareMatches, dtToHumanStr } from "../../utils";
import { MatchesStackNav } from "./MatchesNav";

export const MatchesScreen: React.FC<MatchesStackNav<"matchy">> = ({
  navigation,
}) => {
  const {
    buttonSecondaryHoverBackground,
    buttonSecondaryBackground,
  } = useTheme();
  const { data, isLoading } = useQuery<MatchesResponse>(
    "/matches/0",
    defaultQueryFn
  );

  const cache = useQueryCache();

  useOnWebSocket((e) => {
    if (e.type === "unmatch") {
      const d = cache.getQueryData<MatchesResponse>("/matches/0");
      if (d) {
        cache.setQueryData<MatchesResponse>("/matches/0", {
          matches: d.matches.filter((m) => m.userId !== e.userId),
        });
      }
    } else if (e.type === "new-match") {
      cache.invalidateQueries("/matches/0");
    } else if (e.type === "new-like") {
      cache.setQueryData<MeResponse>("/me", (u) => {
        return {
          user: {
            ...u!.user!,
            numLikes: u!.user!.numLikes + 1,
          },
        };
      });
    } else if (e.type === "new-message") {
      const state = navigation.dangerouslyGetState();
      const route: any = state.routes[state.index];
      const read = !!(route && route.params?.userId === e.message.senderId);
      const d = cache.getQueryData<MatchesResponse>("/matches/0");
      if (d) {
        cache.setQueryData<MatchesResponse>("/matches/0", {
          matches: d.matches.map((m) =>
            m.userId === e.message.senderId
              ? {
                  ...m,
                  read,
                  message: {
                    text: e.message.text,
                    createdAt: e.message.createdAt,
                  },
                }
              : m
          ),
        });
      }
    }
  });

  useEffect(() => {
    if (data?.matches) {
      const d0 = cache.getQueryData<MeResponse>("/me");
      if (!d0 || !d0.user) {
        return;
      }
      const newUnreadMatchUserIds: Array<{
        userId1: string;
        userId2: string;
      }> = [];
      data.matches.forEach((m) => {
        if (!m.read) {
          const [u1, u2] = [m.userId, d0.user!.id].sort();
          newUnreadMatchUserIds.push({ userId1: u1, userId2: u2 });
        }
      });
      cache.setQueryData<MeResponse>("/me", {
        user: {
          ...d0.user,
          unreadMatchUserIds: newUnreadMatchUserIds,
        },
      });
    }
  }, [data?.matches]);

  const isClearing = useRef(false);
  useFocusEffect(() => {
    getPresentedNotificationsAsync().then((x) => {
      if (x.length && !isClearing.current) {
        isClearing.current = true;
        dismissAllNotificationsAsync().finally(() => {
          isClearing.current = false;
        });
      }
    });
  });

  if (isLoading) {
    return <FullscreenLoading />;
  }

  if (!data?.matches.length) {
    return <FullscreenMessage message="No matches yet 😏" />;
  }

  return (
    <ScreenWrapper noPadding>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 16 }}
        data={data.matches.sort(compareMatches)}
        keyExtractor={(x) => x.userId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("messages", { ...item, id: item.userId })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: item.read
                ? undefined
                : buttonSecondaryHoverBackground,
              padding: 15,
              borderBottomColor: buttonSecondaryBackground,
              borderBottomWidth: 1,
            }}
          >
            <TouchableOpacity
              style={{ paddingRight: 12 }}
              onPress={() =>
                navigation.navigate(`viewCard`, { id: item.userId })
              }
            >
              <Avatar src={item.photoUrl} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <MyText
                  style={{ fontSize: 20, marginRight: 4 }}
                  numberOfLines={1}
                >
                  {item.displayName}
                </MyText>
                <Flair name={item.flair as any} />
                <MyText style={{ marginLeft: "auto" }} numberOfLines={1}>
                  {dtToHumanStr(
                    new Date(
                      item.message ? item.message.createdAt : item.createdAt
                    )
                  )}
                </MyText>
              </View>
              <MyText style={{ marginTop: 4 }}>
                {item.message?.text || " "}
              </MyText>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
};
