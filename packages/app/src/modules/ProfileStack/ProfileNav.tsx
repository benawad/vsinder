import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type ProfileStackParamList = {
  editProfile: undefined;
  viewProfile: undefined;
  changeTheme: undefined;
  manageCodePics: undefined;
  settings: undefined;
  codeSnippeter:
    | undefined
    | {
        replace?: boolean;
      };
  viewCard: {
    id: string;
  };
};

export type ProfileStackNav<RouteName extends keyof ProfileStackParamList> = {
  navigation: StackNavigationProp<ProfileStackParamList, RouteName>;
  route: RouteProp<ProfileStackParamList, RouteName>;
};
