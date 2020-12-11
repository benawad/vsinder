import * as _vscode from "vscode";

declare global {
  const tsvscode: any;
  const apiBaseUrl: string;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  const flairMap: Record<string, string>;
}
declare module "googlemaps";
