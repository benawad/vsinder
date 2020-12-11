import { useEffect, useRef } from "react";
import { getSocket } from "../Providers";
import { WebsocketMessages } from "../types";

type WsFn = (e: WebsocketMessages) => void;

export const useOnWebSocket = (fn: WsFn) => {
  const _fn = useRef<WsFn>(() => {});
  _fn.current = fn;
  useEffect(() => {
    const socket = getSocket();
    const callRef = (e: MessageEvent) => _fn.current(JSON.parse(e.data));
    socket.addEventListener("message", callRef);

    return () => {
      socket.removeEventListener("message", callRef);
    };
  }, []);
};
