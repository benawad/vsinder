import { index } from "./src";
import { LogBox } from "react-native";
import * as Sentry from "sentry-expo";
import { SENTRY_DSN } from "./src/dsn";

if (__DEV__) {
  LogBox.ignoreLogs([
    "Setting a timer for a long period of time, i.e. multiple minutes",
    "Accessing the 'state' property of the 'route' object is not supported.",
  ]);
} else {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

export default index;
