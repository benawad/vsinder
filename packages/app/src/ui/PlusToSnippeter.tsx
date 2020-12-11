import AntDesign from "@expo/vector-icons/build/AntDesign";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { ProfileStackNav } from "../modules/ProfileStack/ProfileNav";
import { useCodeImgs } from "../modules/ProfileStack/useCodeImgs";

export const PlusToSnippeter = () => {
  const { buttonBackground } = useTheme();
  const navigation = useNavigation<
    ProfileStackNav<"manageCodePics">["navigation"]
  >();
  const { codeImgs } = useCodeImgs();

  if (codeImgs.length >= 6) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 15,
      }}
      onPress={() => {
        navigation.navigate("codeSnippeter");
      }}
    >
      <AntDesign size={27} color={buttonBackground} name="plus" />
    </TouchableOpacity>
  );
};
