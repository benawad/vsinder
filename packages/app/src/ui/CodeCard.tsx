import { Feather } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useMutation } from "react-query";
import { Profile } from "../types";
import { Avatar } from "./Avatar";
import { CodeImage, codeImageWidth } from "./CodeImage";
import { Flair } from "./Flair";
import {
  FullscreenImageZoomProvider,
  FullscreenImageZoomContext,
} from "./FullscreenImageZoom";
import { MyButton } from "./MyButton";
import { ReportDialog } from "./ReportDialog";

type Fn = (message: string) => void;

interface CodeCardProps {
  profile: Profile;
  onReport: Fn | undefined;
}

export const CodeCard: React.FC<CodeCardProps> = ({
  onReport,
  profile: { codeImgIds, photoUrl, displayName, age, flair, bio },
}) => {
  const [expand, setExpand] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const setSrc = useContext(FullscreenImageZoomContext);

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{ width: codeImageWidth / 2 }}
            onPress={() =>
              setImgIdx(imgIdx === 0 ? codeImgIds.length - 1 : imgIdx - 1)
            }
          />
          <TouchableOpacity
            style={{
              flex: 1,
              width: codeImageWidth / 2,
            }}
            onPress={() => setImgIdx((imgIdx + 1) % codeImgIds.length)}
          />
        </View>
        <View
          style={{
            backgroundColor: "#0d0d0d",
            borderBottomLeftRadius: 9,
            borderBottomRightRadius: 9,
            width: "100%",
            padding: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setExpand(!expand)}
            style={{ flexDirection: "row" }}
          >
            <Avatar src={photoUrl} />
            <View
              style={{
                marginLeft: 12,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text numberOfLines={1} style={{ color: "#fff" }}>
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 20,
                      }}
                    >
                      {displayName}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "300",
                        fontSize: 18,
                      }}
                    >
                      {"  "}
                      {age}
                    </Text>
                  </Text>
                  {flair ? (
                    <View style={{ marginLeft: 4 }}>
                      <Flair name={flair as any} />
                    </View>
                  ) : null}
                </View>
                <Text
                  style={{ color: "#fff", marginTop: 4 }}
                  numberOfLines={expand ? undefined : 1}
                >
                  {bio}
                </Text>
              </View>
              {!expand ? (
                <TouchableOpacity
                  onPress={() => {
                    setSrc(`https://img.vsinder.com/${codeImgIds[imgIdx]}`);
                  }}
                  style={{ paddingLeft: 12 }}
                >
                  <Feather name="zoom-in" color="#fff" size={28} />
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
          {onReport ? (
            <ReportDialog onReportMessage={onReport}>
              {(setOpen) =>
                expand ? (
                  <MyButton
                    onPress={() => setOpen(true)}
                    style={{ marginTop: 10 }}
                  >
                    report
                  </MyButton>
                ) : null
              }
            </ReportDialog>
          ) : null}
        </View>
      </View>
      <CodeImage id={codeImgIds[imgIdx]} />
    </View>
  );
};
