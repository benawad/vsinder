import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as Linking from "expo-linking";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Clipboard, SafeAreaView, ScrollView } from "react-native";
import { useQuery } from "react-query";
import { useTheme } from "./hooks/useTheme";
import { AuthStack } from "./modules/AuthStack";
import { MainTabStack } from "./modules/MainTabStack";
import { useShowTabs } from "./modules/MainTabStack/useShowTabs";
import { MeResponse } from "./types";
import { FullscreenLoading } from "./ui/FullscreenLoading";
import { MyButton } from "./ui/MyButton";
import { MyHeader } from "./ui/MyHeader";
import { MyText } from "./ui/MyText";
import { ScreenWrapper } from "./ui/ScreenWrapper";
import { ReactQueryErrorResetBoundary } from "react-query";
import { ProfileStack } from "./modules/ProfileStack";
import * as Sentry from "sentry-expo";

const prefix = Linking.makeUrl("/");

interface RoutesProps {}

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      tokens: "tokens/:accessToken/:refreshToken",
    },
  },
};

function ErrorFallback({ resetErrorBoundary, error }: FallbackProps) {
  return (
    <ScreenWrapper>
      <ScrollView>
        <MyHeader>App Crashed:</MyHeader>
        <MyText style={{ marginVertical: 40, fontSize: 16 }}>
          {error?.message}
        </MyText>
        <MyButton
          style={{ marginBottom: 20 }}
          secondary
          onPress={() => Clipboard.setString(error?.stack || "")}
        >
          copy stacktrace to clipboard
        </MyButton>
        <MyButton onPress={resetErrorBoundary}>reload app</MyButton>
      </ScrollView>
    </ScreenWrapper>
  );
}

const myErrorHandler = (error: Error) => {
  Sentry.Native.captureException(error);
};

export const Routes: React.FC<RoutesProps> = ({}) => {
  const { editorBackground } = useTheme();
  const { data, isLoading } = useQuery<MeResponse>("/me");
  const routeNameRef = React.useRef<string | undefined>();
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  let body: any = null;

  if (isLoading) {
    body = <FullscreenLoading />;
  } else if (!data?.user) {
    body = <AuthStack />;
  } else if (data.user.goal && data.user.codeImgIds.length) {
    body = <MainTabStack />;
  } else {
    body = <ProfileStack isNewUser />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: editorBackground }}>
      <ReactQueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={ErrorFallback}
            onError={myErrorHandler}
          >
            <NavigationContainer
              ref={navigationRef}
              onStateChange={() => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current?.getCurrentRoute()
                  ?.name;

                if (previousRouteName !== currentRouteName) {
                  if (
                    !["swiper", "viewProfile", "matchy"].includes(
                      currentRouteName || ""
                    )
                  ) {
                    useShowTabs.getState().set({ show: false });
                  } else {
                    useShowTabs.getState().set({ show: true });
                  }
                }

                routeNameRef.current = currentRouteName;
              }}
              linking={linking}
              fallback={<FullscreenLoading />}
            >
              {body}
            </NavigationContainer>
          </ErrorBoundary>
        )}
      </ReactQueryErrorResetBoundary>
    </SafeAreaView>
  );
};
