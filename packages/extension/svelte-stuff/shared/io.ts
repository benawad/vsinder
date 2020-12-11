import ReconnectingWebSocket from "reconnecting-websocket";

let socket: ReconnectingWebSocket | null = null;
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
