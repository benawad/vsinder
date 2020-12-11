import { getConnection } from "typeorm";
import { User } from "../entities/User";

const meFields: Array<keyof User> = [
  "numLikes",
  "global",
  "flair",
  "id",
  "bio",
  "displayName",
  "photoUrl",
  "codeImgIds",
  "gender",
  "genderToShow",
  "goal",
  "ageRangeMax",
  "ageRangeMin",
  "birthday",
];

const quotedMeFields = meFields.map((x) => `"${x}"`).join(", ");

export const getUser = (userId: string) =>
  getConnection()
    .query(
      `select (u."pushToken" is not null or u."pushToken" != '') "hasPushToken",
      COALESCE("location", '') "location", ${quotedMeFields},
  array(select json_build_object('userId1', m."userId1", 'userId1', m."userId2")
    from match m
    where (m."userId1" = $2 and read1 = false)
    or (m."userId2" = $3 and read2 = false)
    ) "unreadMatchUserIds"
  from "user" u where id = $1 limit 1`,
      [userId, userId, userId]
    )
    .then((x) => x[0]);
