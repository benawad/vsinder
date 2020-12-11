import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { getSocket } from "../Providers";
import { MessageIcon } from "../ui/MessageIcon";
import { MainTabParamList } from "./MainTabStack/MainTabNav";
import { SwiperScreen } from "./MainTabStack/SwiperScreen";
import { useShowTabs } from "./MainTabStack/useShowTabs";
import { MatchesStack } from "./MatchesStack";
import { ProfileStack } from "./ProfileStack";

interface MainTabStackProps {}

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

export const MainTabStack: React.FC<MainTabStackProps> = ({}) => {
  const { show } = useShowTabs();
  const {
    editorBackground,
    buttonBackground,
    buttonHoverBackground,
  } = useTheme();

  useEffect(() => {
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        getSocket().reconnect();
      } else if (nextAppState === "background") {
        getSocket().close();
      }
    };

    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const size = 24;
          const color = focused ? buttonHoverBackground : buttonBackground;

          if (route.name === "swiper") {
            return <Entypo name="code" size={size} color={color} />;
          } else if (route.name === "profile") {
            return (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "matches") {
            return <MessageIcon size={size} color={color} />;
          }

          return null;
        },
      })}
      swipeEnabled={false}
      tabBarOptions={{
        style: {
          height: show ? undefined : 0,
          backgroundColor: editorBackground,
        },
        indicatorStyle: {
          backgroundColor: buttonHoverBackground,
        },
        showIcon: true,
        showLabel: false,
      }}
      initialRouteName={"swiper"}
    >
      <Tab.Screen name="swiper" component={SwiperScreen} />
      <Tab.Screen name="matches" component={MatchesStack} />
      <Tab.Screen name="profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};
