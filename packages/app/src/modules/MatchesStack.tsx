import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useHeaderOptions } from "../hooks/useHeaderOptions";
import { ReportUnMatchButton } from "../ui/ReportUnMatchButton";
import { MatchesStackParamList } from "./MatchesStack/MatchesNav";
import { MatchesScreen } from "./MatchesStack/MatchesScreen";
import { MessagesScreen } from "./MatchesStack/MessagesScreen";
import { ViewCardScreen } from "./ViewCardScreen";

const Stack = createStackNavigator<MatchesStackParamList>();

export const MatchesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={useHeaderOptions()}
      initialRouteName="matchy"
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="matchy"
        component={MatchesScreen}
      />
      <Stack.Screen
        options={{ title: "Card" }}
        name="viewCard"
        component={ViewCardScreen}
      />
      <Stack.Screen
        options={({ route, navigation }) => ({
          headerTitle: (props) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("viewCard", { id: route.params.id })
              }
            >
              <HeaderTitle {...props}>{route.params.displayName}</HeaderTitle>
            </TouchableOpacity>
          ),
          headerRight: ReportUnMatchButton,
        })}
        name="messages"
        component={MessagesScreen}
      />
    </Stack.Navigator>
  );
};
