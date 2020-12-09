import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { accessTokenKey, apiBaseUrl, refreshTokenKey } from "./constants";
import { FlairProvider } from "./FlairProvider";
import { getNonce } from "./getNonce";
import { mutationNoErr } from "./mutation";
import { placesApiKey } from "./places-api-key";
import { SnippetStatus } from "./SnippetStatus";
import { SwiperPanel } from "./SwiperPanel";
import { Util } from "./Util";
import { ViewCodeCardPanel } from "./ViewCodeCardPanel";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "report": {
          const message = await vscode.window.showInputBox({
            placeHolder: "why are you reporting this user?",
          });
          if (message) {
            await mutationNoErr(`/report`, { message, ...data.value });
            webviewView.webview.postMessage({
              command: "report-done",
              data,
            });
            vscode.window.showInformationMessage("Thank you for reporting!");
          }
          break;
        }
        case "send-tokens": {
          webviewView.webview.postMessage({
            command: "init-tokens",
            payload: {
              accessToken: Util.getAccessToken(),
              refreshToken: Util.getRefreshToken(),
            },
          });
          break;
        }
        case "logout": {
          await Util.globalState.update(accessTokenKey, "");
          await Util.globalState.update(refreshTokenKey, "");
          break;
        }
        case "show-snippet-status": {
          SnippetStatus.show();
          break;
        }
        case "hide-snippet-status": {
          SnippetStatus.hide();
          break;
        }
        case "view-code-card": {
          ViewCodeCardPanel.createOrShow(this._extensionUri, data.value);
          break;
        }
        case "start-swiping": {
          SwiperPanel.createOrShow(this._extensionUri);
          break;
        }
        case "login": {
          authenticate((payload) => {
            webviewView.webview.postMessage({
              command: "login-complete",
              payload,
            });
          });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "tokens": {
          await Util.globalState.update(accessTokenKey, data.accessToken);
          await Util.globalState.update(refreshTokenKey, data.refreshToken);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="default-src ${
          apiBaseUrl.includes("https")
            ? apiBaseUrl.replace("https", "wss")
            : apiBaseUrl.replace("http", "ws")
        } ${apiBaseUrl} https://x9lecdo5aj.execute-api.us-east-1.amazonaws.com; img-src https: data:; style-src 'unsafe-inline' ${
      webview.cspSource
    }; script-src https://maps.googleapis.com 'nonce-${nonce}';">
        <script src="https://maps.googleapis.com/maps/api/js?key=${placesApiKey}&libraries=places"></script>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
            const apiBaseUrl = ${JSON.stringify(apiBaseUrl)};
            const tsvscode = acquireVsCodeApi();
            let accessToken = ${JSON.stringify(Util.getAccessToken())};
            let refreshToken = ${JSON.stringify(Util.getRefreshToken())};
            ${FlairProvider.getJavascriptMapString()}
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
