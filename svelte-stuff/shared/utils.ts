import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import differenceInDays from "date-fns/differenceInDays";

export function getAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

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

export function dtToMsgStr(dt: Date) {
  const now = new Date();
  if (isSameDay(dt, now)) {
    return format(dt, "h:mm a");
  }
  if (differenceInDays(dt, now) < 7) {
    return format(dt, "E h:mm a");
  }
  return format(dt, "MMM d, yyyy, h:mm a");
}

export const genId = () => "_" + Math.random().toString(36).substr(2, 9);

export const getUserIdOrder = (...uuids: string[]) => {
  const [userId1, userId2] = uuids.sort();

  return { userId1, userId2 };
};
