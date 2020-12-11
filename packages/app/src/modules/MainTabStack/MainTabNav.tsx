import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { RouteProp } from "@react-navigation/native";

export type MainTabParamList = {
  swiper: undefined;
  profile: undefined | { isNewUser: boolean };
  matches: undefined;
};

export type MainTabNav<RouteName extends keyof MainTabParamList> = {
  navigation: MaterialTopTabNavigationProp<MainTabParamList, RouteName>;
  route: RouteProp<MainTabParamList, RouteName>;
};
