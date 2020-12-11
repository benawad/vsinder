import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import CardStack, { Card } from "react-native-card-stack-swiper";
import { useMutation, useQuery } from "react-query";
import { useTheme } from "../../hooks/useTheme";
import { defaultMutationFn, defaultQueryFn } from "../../Providers";
import { FeedResponse } from "../../types";
import { CodeCard } from "../../ui/CodeCard";
import { codeImageHeight } from "../../ui/CodeImage";
import { FullscreenLoading } from "../../ui/FullscreenLoading";
import { FullscreenMessage } from "../../ui/FullscreenMessage";
import { IconButton } from "../../ui/IconButton";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { sleep } from "../../utils";
import { MainTabNav } from "./MainTabNav";

export const SwiperScreen: React.FC<MainTabNav<"swiper">> = ({
  navigation,
}) => {
  const viewMap = useRef<Record<string, "loading" | "done">>({});
  const [mutate] = useMutation(defaultMutationFn);
  const [report] = useMutation(defaultMutationFn);
  const swiper = useRef<CardStack>(null);
  const { buttonForeground } = useTheme();
  const [outOfProfiles, setOutOfProfiles] = useState(false);
  const fetchCount = useRef(0);
  const { isLoading, isFetching, data, refetch } = useQuery<FeedResponse>(
    "/feed",
    defaultQueryFn
  );

  const view = async (i: number, liked: boolean) => {
    const id = data?.profiles[i]?.id;
    if (!id || id in viewMap.current) {
      return;
    }
    viewMap.current[id] = "loading";
    try {
      await mutate([`/view`, { liked, userId: id }, "POST"]);
    } catch {}
    viewMap.current[id] = "done";

    if (i >= data!.profiles.length - 1) {
      for (let i = 0; i < 50; i++) {
        if (Object.values(viewMap.current).some((x) => x === "loading")) {
          await sleep(100);
        } else {
          break;
        }
      }
      refetch({ throwOnError: true })
        .then((x) => {
          viewMap.current = {};
          fetchCount.current++;
          if (!x?.profiles) {
            setOutOfProfiles(true);
          }
        })
        .catch(() => {});
    }
  };

  const navRef = useRef(navigation);
  navRef.current = navigation;
  useEffect(() => {
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      navRef.current.navigate("matches");
    });

    return () => {
      Notifications.removeNotificationSubscription(sub);
    };
  }, []);

  if (
    isLoading ||
    isFetching ||
    (data && !data.profiles.length && !outOfProfiles && fetchCount.current > 0)
  ) {
    return <FullscreenLoading />;
  }

  if (!data?.profiles.length) {
    return (
      <FullscreenMessage message="There are no more profiles, try changing your criteria or come back later" />
    );
  }

  return (
    <ScreenWrapper>
      <CardStack
        ref={swiper}
        renderNoMoreCards={() => null}
        disableTopSwipe={true}
        disableBottomSwipe={true}
        onSwipedRight={(i) => {
          view(i, true);
        }}
        onSwipedLeft={(i) => {
          view(i, false);
        }}
      >
        {data.profiles.map((x) => (
          <Card key={x.id}>
            <CodeCard
              onReport={(message) => {
                report([
                  "/report",
                  { message, unmatchOrReject: "reject", userId: x.id },
                  "POST",
                ]).then(() => {
                  viewMap.current[x.id] = "done";
                  swiper.current?.swipeLeft();
                });
              }}
              profile={x}
            />
          </Card>
        ))}
      </CardStack>
      <View
        style={{
          marginTop: codeImageHeight + 40,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <IconButton onPress={() => swiper.current?.swipeLeft()} size={60}>
            <AntDesign name="close" size={30} color={buttonForeground} />
          </IconButton>
          <View style={{ width: 50 }} />
          <IconButton onPress={() => swiper.current?.swipeRight()} size={60}>
            <FontAwesome
              style={{ marginTop: 2 }}
              name="heart"
              size={30}
              color={buttonForeground}
            />
          </IconButton>
        </View>
      </View>
    </ScreenWrapper>
  );
};
