import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { accessTokenKey, apiBaseUrl, refreshTokenKey } from "./constants";
import { ThemeProvider } from "./ThemeProvider";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppearanceProvider } from "react-native-appearance";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import ReconnectingWebSocket from "reconnecting-websocket";
import { FullscreenImageZoomProvider } from "./ui/FullscreenImageZoom";

interface ProvidersProps {}

let accessToken = "";
let refreshToken = "";

let socket: ReconnectingWebSocket | null = null;
const loadTokens = async () => {
  const [t1, t2] = await Promise.all([
    AsyncStorage.getItem(accessTokenKey),
    AsyncStorage.getItem(refreshTokenKey),
  ]);
  accessToken = t1 || "";
  refreshToken = t2 || "";
};

export const getSocket = () => {
  if (!socket) {
    socket = new ReconnectingWebSocket(
      () =>
        (apiBaseUrl.includes("https")
          ? apiBaseUrl.replace("https", "wss")
          : apiBaseUrl.replace("http", "ws")) +
        `?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }

  return socket;
};

export const setTokens = (_accessToken: string, _refreshToken: string) => {
  accessToken = _accessToken;
  refreshToken = _refreshToken;
  AsyncStorage.setItem(accessTokenKey, _accessToken);
  AsyncStorage.setItem(refreshTokenKey, _refreshToken);
};

export const defaultMutationFn = async ([path, body, method = "POST"]: [
  string,
  any,
  "POST" | "PUT"
]) => {
  if (!accessToken || !refreshToken) {
    await loadTokens();
  }
  const r = await fetch(apiBaseUrl + path, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "access-token": accessToken,
      "refresh-token": refreshToken,
    },
  });
  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  const _accessToken = r.headers.get("access-token");
  const _refreshToken = r.headers.get("refresh-token");
  if (_accessToken && _refreshToken) {
    accessToken = _accessToken;
    refreshToken = _refreshToken;
    AsyncStorage.setItem(accessTokenKey, accessToken);
    AsyncStorage.setItem(refreshTokenKey, refreshToken);
  }

  return await r.json();
};

export const defaultQueryFn = async <T extends any = any>(
  key: string
): Promise<T> => {
  if (!accessToken || !refreshToken) {
    await loadTokens();
  }
  const r = await fetch(`${apiBaseUrl}${key}`, {
    headers: {
      "access-token": accessToken,
      "refresh-token": refreshToken,
    },
  });
  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  const _accessToken = r.headers.get("access-token");
  const _refreshToken = r.headers.get("refresh-token");
  if (_accessToken && _refreshToken) {
    accessToken = _accessToken;
    refreshToken = _refreshToken;
    AsyncStorage.setItem(accessTokenKey, accessToken);
    AsyncStorage.setItem(refreshTokenKey, refreshToken);
  }
  return await r.json();
};

// provide the default query function to your app via the config provider
const queryCache = new QueryCache({
  defaultConfig: {
    mutations: {
      throwOnError: true,
      onError: (e) => {
        if ("message" in (e as Error)) {
          showMessage({
            message: (e as Error).message,
            duration: 10000,
            type: "danger",
          });
        }
      },
    },
    queries: {
      retry: false,
      staleTime: 60 * 1000 * 5, // 5 mins
      queryFn: defaultQueryFn,
      onError: (e) => {
        if ("message" in (e as Error)) {
          showMessage({
            message: (e as Error).message,
            duration: 10000,
            type: "danger",
          });
        }
      },
    },
  },
});

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ActionSheetProvider>
      <AppearanceProvider>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ThemeProvider>
            <FullscreenImageZoomProvider>
              {children}
            </FullscreenImageZoomProvider>
          </ThemeProvider>
        </ReactQueryCacheProvider>
      </AppearanceProvider>
    </ActionSheetProvider>
  );
};
