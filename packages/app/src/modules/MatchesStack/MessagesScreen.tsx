import { MaterialIcons } from "@expo/vector-icons";
import { produce } from "immer";
import React, { useEffect } from "react";
import { Clipboard } from "react-native";
import { GiftedChat, IMessage, Send, Bubble } from "react-native-gifted-chat";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryCache,
} from "react-query";
import { useOnWebSocket } from "../../hooks/useOnWebSocket";
import { useTheme } from "../../hooks/useTheme";
import { defaultMutationFn, defaultQueryFn, getSocket } from "../../Providers";
import { MatchesResponse, MeResponse, Message } from "../../types";
import { FullscreenLoading } from "../../ui/FullscreenLoading";
import { Loading } from "../../ui/Loading";
import { MyButton } from "../../ui/MyButton";
import { ScreenWrapper } from "../../ui/ScreenWrapper";
import { messageToGiftedMessage } from "../../utils";
import { MatchesStackNav } from "./MatchesNav";

type IMessageResponse = { hasMore: boolean; messages: IMessage[] };

export const MessagesScreen: React.FC<MatchesStackNav<"messages">> = ({
  route: { params },
  navigation,
}) => {
  const qKey = `/messages/${params.id}`;
  const {
    data,
    isLoading,
    isFetchingMore,
    fetchMore,
  } = useInfiniteQuery<IMessageResponse>(
    qKey,
    (key, cursor = "") =>
      defaultQueryFn(`${key}/${cursor}`).then((x) => ({
        hasMore: x.hasMore,
        messages: x.messages.map((m: Message) =>
          messageToGiftedMessage(m, { me: meData!.user!, them: params })
        ),
      })),
    {
      staleTime: 0,
      getFetchMore: ({ messages, hasMore }) =>
        hasMore && messages.length
          ? messages[messages.length - 1].createdAt
          : "",
    }
  );
  const { data: meData } = useQuery<MeResponse>("/me", defaultQueryFn);
  const cache = useQueryCache();
  const [mutate] = useMutation(defaultMutationFn);
  const {
    inputForeground,
    inputBackground,
    buttonBackground,
    buttonForeground,
    buttonSecondaryBackground,
    buttonSecondaryForeground,
    buttonForegroundDarker,
    buttonSecondaryForegroundDarker,
  } = useTheme();

  useOnWebSocket((e) => {
    if (e.type === "new-message" && e.message.senderId === params.id) {
      cache.setQueryData<IMessageResponse[]>(qKey, (d) => {
        return produce(d!, (x) => {
          x[0].messages = GiftedChat.append(x[0].messages, [
            messageToGiftedMessage(e.message, {
              me: meData!.user!,
              them: params,
            }),
          ]);
        });
      });
    } else if (e.type === "unmatch") {
      if (e.userId === params.id) {
        navigation.goBack();
      }
    }
  });

  useEffect(() => {
    getSocket().send(
      JSON.stringify({ type: "message-open", userId: params.id })
    );
    const d = cache.getQueryData<MatchesResponse>("/matches/0");
    if (d && d.matches.find((x) => x.userId === params.id && !x.read)) {
      cache.setQueryData<MatchesResponse>("/matches/0", {
        matches: d.matches.map((m) =>
          m.userId === params.id ? { ...m, read: true } : m
        ),
      });
    }

    return () => {
      getSocket().send(JSON.stringify({ type: "message-open", userId: null }));
    };
  }, []);

  if (isLoading) {
    return <FullscreenLoading />;
  }

  if (!meData?.user) {
    return null;
  }

  const messages = data ? data.map((x) => x.messages).flat() : [];

  return (
    <ScreenWrapper noPadding>
      <GiftedChat
        alignTop
        loadEarlier={data?.[data?.length - 1]?.hasMore}
        onPressAvatar={(u) =>
          navigation.navigate("viewCard", { id: u._id.toString() })
        }
        onLongPress={(context, message: IMessage) => {
          const allowDelete = meData.user?.id === message.user._id;
          const options = ['Copy Text', ...(allowDelete ? ["Delete"] : []), 'Cancel'];
          const cancelButtonIndex = options.length - 1;
          context.actionSheet().showActionSheetWithOptions({ 
            options, cancelButtonIndex 
          }, (buttonIndex: number) => {
            switch(buttonIndex) {
              case 0:
                Clipboard.setString(message.text);
                break;
              case 1:
                if (allowDelete) {
                  mutate([
                    "/delete-message", 
                    { "recipientId": params.id, "matchId": params.matchId, "messageId": message._id }, 
                    "DELETE"
                  ])
                    .then(({ messageId }) => {
                      cache.setQueryData<IMessageResponse[]>(qKey, (d) => {
                        return produce(d!, (x) => {
                          x[0].messages = x[0].messages.filter(message => message._id !== messageId)
                        });
                      });
                      const d = cache.getQueryData<MatchesResponse>("/matches/0");
                      if (d) {
                        cache.setQueryData<MatchesResponse>("/matches/0", {
                          matches: d.matches.map((m) =>
                            (m.userId === params.id && m?.message?.id === messageId)
                              ? {
                                  ...m,
                                  message: null,
                                }
                              : m
                          ),
                        });
                      }
                    });
                }
                break;
            }
          });
        }}
        isLoadingEarlier={!!isFetchingMore}
        renderLoadEarlier={({ isLoadingEarlier }) =>
          isLoadingEarlier ? (
            <Loading />
          ) : (
            <MyButton onPress={() => fetchMore()}>load more</MyButton>
          )
        }
        listViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        timeTextStyle={{
          left: { color: buttonSecondaryForegroundDarker },
          right: { color: buttonForegroundDarker },
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: buttonForeground,
                },
                left: {
                  color: buttonSecondaryForeground,
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: buttonSecondaryBackground,
                },
                right: {
                  backgroundColor: buttonBackground,
                },
              }}
            />
          );
        }}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginRight: 15,
            }}
          >
            <MaterialIcons name="send" size={24} color={buttonBackground} />
          </Send>
        )}
        // @ts-ignore
        containerStyle={{
          backgroundColor: inputBackground,
        }}
        textInputStyle={{
          color: inputForeground,
          backgroundColor: inputBackground,
        }}
        // @ts-ignore
        renderTicks={() => null}
        messages={messages}
        onSend={(messages) => {
          messages.forEach((m) => {
            mutate([
              "/message",
              { recipientId: params.id, text: m.text, matchId: params.matchId },
              "POST",
            ]).then(({ message: newMessage }) => {
              cache.setQueryData<IMessageResponse[]>(qKey, (d) => {
                return produce(d!, (x) => {
                  x[0].messages = GiftedChat.append(x[0].messages, [
                    messageToGiftedMessage(newMessage, {
                      me: meData.user!,
                      them: params,
                    }),
                  ]);
                });
              });
              const d = cache.getQueryData<MatchesResponse>("/matches/0");
              if (d) {
                cache.setQueryData<MatchesResponse>("/matches/0", {
                  matches: d.matches.map((m) =>
                    m.userId === params.id
                      ? {
                          ...m,
                          message: {
                            id: newMessage.id,
                            text: newMessage.text,
                            createdAt: newMessage.createdAt,
                          },
                        }
                      : m
                  ),
                });
              }
            });
          });
        }}
        user={{
          _id: meData.user.id,
        }}
      />
    </ScreenWrapper>
  );
};
