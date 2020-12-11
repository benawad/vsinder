import React from "react";
import { useQuery } from "react-query";
import { defaultQueryFn } from "../Providers";
import { OneUserResponse } from "../types";
import { CodeCard } from "../ui/CodeCard";
import { FullscreenLoading } from "../ui/FullscreenLoading";
import { FullscreenMessage } from "../ui/FullscreenMessage";
import { ScreenWrapper } from "../ui/ScreenWrapper";
import { MatchesStackNav } from "./MatchesStack/MatchesNav";

export const ViewCardScreen: React.FC<MatchesStackNav<"viewCard">> = ({
  route: {
    params: { id },
  },
}) => {
  const { data, isLoading } = useQuery<OneUserResponse>(
    `/user/${id}`,
    defaultQueryFn
  );

  if (isLoading) {
    return <FullscreenLoading />;
  }

  if (!data?.user) {
    return <FullscreenMessage message="Could not find user" />;
  }

  return (
    <ScreenWrapper>
      <CodeCard onReport={undefined} profile={data.user} />
    </ScreenWrapper>
  );
};
