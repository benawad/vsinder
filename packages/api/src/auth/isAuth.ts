import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../entities/User";
import { createTokens } from "./createTokens";

export const isAuth: (st?: boolean) => RequestHandler<{}, any, any, {}> = (
  shouldThrow = true
) => async (req, res, next) => {
  const accessToken = req.headers["access-token"];
  if (!accessToken || typeof accessToken !== "string") {
    return next(
      !shouldThrow ? undefined : createError(401, "not authenticated")
    );
  }

  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
    (req as any).userId = data.userId;
    return next();
  } catch {}

  const refreshToken = req.headers["refresh-token"];
  if (!refreshToken || typeof refreshToken !== "string") {
    return next(
      !shouldThrow ? undefined : createError(401, "not authenticated")
    );
  }

  let data;
  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
  } catch {
    return next(
      !shouldThrow ? undefined : createError(401, "not authenticated")
    );
  }

  const user = await User.findOne(data.userId);
  // token has been invalidated or user deleted
  if (!user || user.tokenVersion !== data.tokenVersion) {
    return next(
      !shouldThrow ? undefined : createError(401, "not authenticated")
    );
  }

  const tokens = createTokens(user);

  res.setHeader("refresh-token", tokens.refreshToken);
  res.setHeader("access-token", tokens.accessToken);
  (req as any).userId = data.userId;

  next();
};
