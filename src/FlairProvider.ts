import * as fs from "fs";
import * as vscode from "vscode";
import btoa from "btoa";

export class FlairProvider {
  static extensionUri: vscode.Uri;
  static flairMap: Record<string, string> = {};
  static flairUriMap: Record<string, vscode.Uri> = {};
  static javascriptMapString = "";
  static init() {
    const flairPath = vscode.Uri.joinPath(this.extensionUri, "media", "flairs");
    const files = fs.readdirSync(flairPath.fsPath);
    files.forEach((f) => {
      const uri = vscode.Uri.joinPath(this.extensionUri, "media", "flairs", f);
      const content = fs.readFileSync(uri.fsPath, { encoding: "utf-8" });
      const flairName = f.split(".")[0];
      this.flairMap[flairName] = "data:image/svg+xml;base64," + btoa(content);
      this.flairUriMap[flairName] = uri;
    });
  }

  static getJavascriptMapString() {
    if (!this.javascriptMapString) {
      return `
      const flairMap = {
        ${Object.entries(this.flairMap).map(([k, v]) => `"${k}": "${v}"`)}
      }
      `;
    }

    return this.javascriptMapString;
  }
}
