import ReconnectingWebSocket from "reconnecting-websocket";

let socket: ReconnectingWebSocket | null = null;
export const getSocket = () => {
  if (!socket) {
    socket = new ReconnectingWebSocket(
      () =>
        `${apiBaseUrl.replace("http", "ws")}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }

  return socket;
};
