import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import { MeResponse } from "../../types";
import { Avatar } from "../../ui/Avatar";
import { Cog } from "../../ui/Cog";
import { Flair } from "../../ui/Flair";
import { FullscreenLoading } from "../../ui/FullscreenLoading";
import { MyButton } from "../../ui/MyButton";
import { MyText } from "../../ui/MyText";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { genId, getAge } from "../../utils";
import { ProfileStackNav } from "./ProfileNav";
import { useCodeImgs } from "./useCodeImgs";

export const ViewProfile: React.FC<ProfileStackNav<"viewProfile">> = ({
  navigation,
}) => {
  const { data } = useQuery<MeResponse>("/me");

  if (!data?.user) {
    return <FullscreenLoading />;
  }

  const { user } = data;

  return (
    <ScreenWrapper>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          width: "100%",
        }}
      >
        <MyText>{user.numLikes} likes</MyText>
        <View style={{ height: 28, marginLeft: "auto", flexDirection: "row" }}>
          <Cog />
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(`viewCard`, { id: user.id })}
        >
          <Avatar size={100} src={user.photoUrl} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MyText
            numberOfLines={1}
            style={{
              marginTop: 10,
              fontSize: 22,
              fontWeight: "600",
              flexShrink: 1,
            }}
          >
            {user.displayName}, {getAge(new Date(user.birthday))}
          </MyText>
          {user.flair ? (
            <View style={{ marginLeft: 4, marginTop: 10 }}>
              <Flair name={user.flair as any} />
            </View>
          ) : null}
        </View>
        <View style={{ width: "100%", marginTop: 20 }}>
          <MyButton
            style={{ width: "100%" }}
            onPress={() => navigation.navigate("editProfile")}
            secondary
          >
            edit profile
          </MyButton>
        </View>
        <View style={{ width: "100%", marginTop: 20 }}>
          <MyButton
            style={{ width: "100%" }}
            onPress={() => {
              useCodeImgs.getState().set({
                codeImgs: user.codeImgIds.map((value) => ({
                  value,
                  tmpId: genId(),
                })),
              });
              navigation.navigate("manageCodePics");
            }}
            secondary
          >
            edit code pics
          </MyButton>
        </View>
        <MyText style={{ marginTop: 40 }}>
          (to change your profile picture, you need to change it on GitHub then
          logout and login again)
        </MyText>
      </View>
    </ScreenWrapper>
  );
};
