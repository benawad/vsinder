import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, Image, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ImageZoom from "react-native-image-pan-zoom";
import { MyButton } from "./MyButton";

const { width, height } = Dimensions.get("window");
const codeImageWidth = width;
const codeImageHeight = (codeImageWidth * 10) / 7;

export const FullscreenImageZoomContext = React.createContext<
  (s: string) => void
>(() => {});

export const FullscreenImageZoomProvider: React.FC = ({ children }) => {
  const srcRef = useRef("");
  const [src, setSrc] = useState("");
  srcRef.current = src;

  useEffect(() => {
    const onBackPress = () => {
      if (srcRef.current) {
        setSrc("");
        return true;
      } else {
        return false;
      }
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, []);

  return (
    <FullscreenImageZoomContext.Provider value={setSrc}>
      {src ? (
        <SafeAreaView
          style={{
            position: "absolute",
            top: 0,
            zIndex: 50,
            flex: 1,
            backgroundColor: "#000",
          }}
        >
          <MyButton onPress={() => setSrc("")}>close</MyButton>
          <ImageZoom
            cropWidth={width}
            cropHeight={height}
            imageWidth={codeImageWidth}
            imageHeight={codeImageHeight}
          >
            <ScrollView>
              <Image
                style={{
                  borderRadius: 9,
                  height: codeImageHeight,
                  width: codeImageWidth,
                }}
                resizeMode="contain"
                source={{ uri: src }}
              />
            </ScrollView>
          </ImageZoom>
        </SafeAreaView>
      ) : null}
      {children}
    </FullscreenImageZoomContext.Provider>
  );
};
