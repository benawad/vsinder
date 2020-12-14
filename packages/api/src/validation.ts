import {
  array,
  object,
  string,
  length,
  boolean,
  struct,
  number,
  refinement,
  pattern,
  optional,
  enums,
  nullable,
} from "superstruct";
import isUuid from "is-uuid";

const IntegerRange = (a: number, b: number) =>
  refinement(number(), `IntegerRange<${a}, ${b}>`, (value) => {
    return Number.isInteger(value) && value > a && value < b;
  });
const Uuid = struct("Uuid", (v) => isUuid.v4(v as string));

export const UpdateUser = object({
  displayName: length(string(), 0, 51),
  bio: length(string(), 0, 151),
  gender: length(string(), 0, 51),
  genderToShow: length(string(), 0, 51),
  gendersToShow: optional(length(array(length(string(), 0, 50)), -1, 4)),
  goal: length(string(), 0, 51),
  location: length(string(), -1, 201),
  global: boolean(),
  birthday: pattern(string(), /^\d\d\d\d-\d\d-\d\d$/),
  ageRangeMax: IntegerRange(17, 151),
  ageRangeMin: IntegerRange(17, 151),
  flair: length(string(), -1, 100),
  pushToken: nullable(optional(string())),
});

export const UpdatePushTokenStruct = object({
  pushToken: nullable(optional(string())),
});

export const UserCodeImgs = object({
  codeImgIds: length(
    array(length(pattern(string(), /^[\.a-z0-9\-]+$/), 0, 30)),
    0,
    7
  ),
});

export const OneUserStruct = object({
  id: Uuid,
});

export const ViewStruct = object({
  userId: Uuid,
  liked: boolean(),
});

export const MessageStruct = object({
  recipientId: Uuid,
  text: length(string(), 0, 2001),
  matchId: Uuid,
});

export const GetMessageStruct = object({
  userId: Uuid,
  cursor: optional(number()),
});

export const UnmatchStruct = object({
  userId: Uuid,
});

export const ReportStruct = object({
  unmatchOrReject: enums(["unmatch", "reject"]),
  userId: Uuid,
  message: length(string(), 0, 2001),
});
