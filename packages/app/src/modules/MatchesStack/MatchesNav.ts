import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type MatchesStackParamList = {
  matchy: undefined;
  messages: {
    id: string;
    photoUrl: string;
    flair: string;
    displayName: string;
    matchId: string;
  };
  viewCard: {
    id: string;
  };
};

export type MatchesStackNav<RouteName extends keyof MatchesStackParamList> = {
  navigation: StackNavigationProp<MatchesStackParamList, RouteName>;
  route: RouteProp<MatchesStackParamList, RouteName>;
};
