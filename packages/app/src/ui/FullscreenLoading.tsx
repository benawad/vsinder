import React from "react";
import { Center } from "./Center";
import { Loading } from "./Loading";
import { ScreenWrapper } from "./ScreenWrapper";

interface FullscreenLoadingProps {}

export const FullscreenLoading: React.FC<FullscreenLoadingProps> = ({}) => {
  return (
    <ScreenWrapper>
      <Center>
        <Loading />
      </Center>
    </ScreenWrapper>
  );
};
