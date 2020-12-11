export const _prod_ = process.env.NODE_ENV === "production";
export const apiBaseUrl = _prod_
  ? "https://api.vsinder.com"
  : "http://localhost:3001";
export const accessTokenKey = "@vsinder/token" + (_prod_ ? "" : "dev");
export const refreshTokenKey = "@vsinder/refresh-token" + (_prod_ ? "" : "dev");
