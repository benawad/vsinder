import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type AuthStackParamList = {
  login: undefined;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  EmailLogin: undefined;
};

export type AuthStackNav<RouteName extends keyof AuthStackParamList> = {
  navigation: StackNavigationProp<AuthStackParamList, RouteName>;
  route: RouteProp<AuthStackParamList, RouteName>;
};
