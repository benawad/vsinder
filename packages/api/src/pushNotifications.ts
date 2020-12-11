import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { CronJob } from "cron";
import { User } from "./entities/User";

type Notif =
  | { type: "match"; idToSendTo: string; otherId: string }
  | { type: "message"; idToSendTo: string; otherId: string; text: string };

let messages: Notif[] = [];

const messagesToExpoMessages = async (
  notifs: Notif[]
): Promise<ExpoPushMessage[]> => {
  const userIds = new Set();
  notifs.forEach((x) => {
    userIds.add(x.idToSendTo);
    userIds.add(x.otherId);
  });

  const users = await User.findByIds([...userIds]);
  const userMap: Record<string, User> = {};
  users.forEach((u) => {
    userMap[u.id] = u;
  });

  const formattedNotifs: ExpoPushMessage[] = [];

  notifs.forEach((n) => {
    const userToSendTo = userMap[n.idToSendTo];
    const otherUser = userMap[n.otherId];

    if (!userToSendTo || !otherUser || !userToSendTo.pushToken) {
      return;
    }

    if (n.type === "match") {
      formattedNotifs.push({
        to: userToSendTo.pushToken,
        body: `New match ${otherUser.displayName?.slice(0, 20)}`,
      });
      return;
    }

    formattedNotifs.push({
      to: userToSendTo.pushToken,
      title: `New message from ${otherUser.displayName?.slice(0, 20)}`,
      body: n.text,
    });
  });

  return formattedNotifs;
};

export const startPushNotificationRunner = () => {
  const expo = new Expo();

  // every minute
  new CronJob(
    "0 * * * * *",
    async () => {
      if (!messages.length) {
        return;
      }
      const tmpMessages = [...messages];
      messages = [];
      const chunks = expo.chunkPushNotifications(
        await messagesToExpoMessages(tmpMessages)
      );
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          ticketChunk.forEach((x) => {
            if (x.status === "error") {
              console.error(x);
            }
          });
          // @todo
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    },
    null,
    true,
    "America/Chicago"
  );
};

export const queuePushNotifToSend = (m: Notif) => {
  messages.push(m);
};
