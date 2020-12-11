import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
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
        options={({ route }) => ({
          title: route.params.displayName,
          headerRight: ReportUnMatchButton,
        })}
        name="messages"
        component={MessagesScreen}
      />
    </Stack.Navigator>
  );
};
