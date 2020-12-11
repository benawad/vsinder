import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "./AuthStack/LoginScreen";
import { TokensScreen } from "./AuthStack/TokensScreen";
import { AuthStackParamList } from "./AuthStack/AuthNav";
import { useHeaderOptions } from "../hooks/useHeaderOptions";
import { EmailLogin } from "./AuthStack/EmailLogin";

interface MainTabStackProps {}

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC<MainTabStackProps> = ({}) => {
  return (
    <Stack.Navigator
      screenOptions={useHeaderOptions()}
      initialRouteName="login"
    >
      <Stack.Screen
        name="login"
        options={{ headerTitle: "Login" }}
        component={LoginScreen}
      />
      <Stack.Screen name="tokens" component={TokensScreen} />
      <Stack.Screen name="EmailLogin" component={EmailLogin} />
    </Stack.Navigator>
  );
};
