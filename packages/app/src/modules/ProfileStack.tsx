import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useHeaderOptions } from "../hooks/useHeaderOptions";
import { PlusToSnippeter } from "../ui/PlusToSnippeter";
import { ChangeTheme } from "./ProfileStack/ChangeTheme";
import { CodeSnippeter } from "./ProfileStack/CodeSnippeter";
import { EditProfile } from "./ProfileStack/EditProfile";
import { ManageCodePics } from "./ProfileStack/ManageCodePics";
import { ProfileStackParamList } from "./ProfileStack/ProfileNav";
import { Settings } from "./ProfileStack/Settings";
import { ViewProfile } from "./ProfileStack/ViewProfile";
import { ViewCardScreen } from "./ViewCardScreen";

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC<{ isNewUser?: boolean }> = ({
  isNewUser,
}) => {
  return (
    <Stack.Navigator
      screenOptions={useHeaderOptions()}
      initialRouteName={isNewUser ? "editProfile" : "viewProfile"}
    >
      <Stack.Screen
        options={{ title: "Settings" }}
        name="settings"
        component={Settings}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="viewProfile"
        component={ViewProfile}
      />
      <Stack.Screen
        options={{ title: "Card" }}
        name="viewCard"
        component={ViewCardScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Edit Profile",
        }}
        name="editProfile"
        component={EditProfile}
      />
      <Stack.Screen
        options={{ headerTitle: "Code Pics", headerRight: PlusToSnippeter }}
        name="manageCodePics"
        component={ManageCodePics}
      />
      <Stack.Screen
        options={{ headerTitle: "Select Theme" }}
        name="changeTheme"
        component={ChangeTheme}
      />
      <Stack.Screen
        options={{ headerTitle: "New Code" }}
        name="codeSnippeter"
        component={CodeSnippeter}
      />
    </Stack.Navigator>
  );
};
