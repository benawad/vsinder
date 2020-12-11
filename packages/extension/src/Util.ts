import * as vscode from "vscode";
import { accessTokenKey, refreshTokenKey } from "./constants";

export class Util {
  static globalState: vscode.ExtensionContext["globalState"];

  static getRefreshToken() {
    return this.globalState.get<string>(refreshTokenKey) || "";
  }

  static getAccessToken() {
    return this.globalState.get<string>(accessTokenKey) || "";
  }

  static isLoggedIn() {
    return (
      !!this.globalState.get(accessTokenKey) &&
      !!this.globalState.get(refreshTokenKey)
    );
  }
}
