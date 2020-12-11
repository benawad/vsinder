import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { ProfileStackNav } from "../modules/ProfileStack/ProfileNav";

export const Cog = () => {
  const { buttonBackground } = useTheme();
  const navigation = useNavigation<
    ProfileStackNav<"viewProfile">["navigation"]
  >();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 4,
        paddingLeft: 8,
        paddingBottom: 4,
      }}
      onPress={() => {
        navigation.navigate("settings");
      }}
    >
      <Ionicons name="md-settings" size={27} color={buttonBackground} />
    </TouchableOpacity>
  );
};
