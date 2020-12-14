import { initialProfileData } from "./constants";
import { Match, Message, User } from "./types";
import { IMessage } from "react-native-gifted-chat";
import { format } from "date-fns";

export function userToInitialFormData(u: User) {
  return {
    bio: u.bio,
    displayName: u.displayName,
    gender: u.gender || initialProfileData.gender,
    genderToShow: u.genderToShow || initialProfileData.genderToShow,
    gendersToShow: u.gendersToShow,
    goal: u.goal || initialProfileData.goal,
    ageRangeMax: "" + (u.ageRangeMax || initialProfileData.ageRangeMax),
    ageRangeMin: "" + (u.ageRangeMin || initialProfileData.ageRangeMin),
    global: u.global,
    flair: u.flair,
    birthday: new Date(u.birthday),
    location: u.location,
    sendNotifs: u.goal ? u.hasPushToken : true,
  };
}

export function getAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const genId = () => "_" + Math.random().toString(36).substr(2, 9);

export function shadeColor(color: string, amount: number) {
  if ("#fff" === color) {
    color = "#ffffff";
  }
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function dtToHumanStr(dt: Date) {
  const ms = new Date().getTime() - dt.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(ms / 60 / 1000);
  const hours = Math.floor(ms / 60 / 60 / 1000);

  if (hours > 140) {
    return `${format(dt, "MMM d, yyyy")}`;
  }

  if (hours > 23) {
    return `${format(dt, "EEEE")}`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  if (seconds > 0) {
    return `${seconds}s`;
  }

  return "0s";
}

export function messageToGiftedMessage(
  m: Message,
  {
    me,
    them,
  }: {
    me: { id: string; displayName: string };
    them: { id: string; photoUrl: string; displayName: string };
  }
): IMessage {
  const received = m.senderId === them.id;
  return {
    _id: m.id,
    createdAt: m.createdAt,
    text: m.text,
    received,
    sent: !received,
    user: {
      _id: received ? them.id : me.id,
      avatar: received ? them.photoUrl : undefined,
      name: received ? them.displayName : me.displayName,
    },
  };
}

export function compareMatches(a: Match, b: Match) {
  const v1 = a.message?.createdAt || a.createdAt;
  const v2 = b.message?.createdAt || b.createdAt;
  if (v1 > v2) {
    return -1;
  }
  if (v1 < v2) {
    return 1;
  }
  return 0;
}
