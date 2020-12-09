import { window, StatusBarItem, StatusBarAlignment } from "vscode";

export class SnippetStatus {
  static snippetStatus: SnippetStatus;
  static storyId?: string;
  private item: StatusBarItem;
  constructor() {
    this.item = window.createStatusBarItem(StatusBarAlignment.Right);
    this.item.text = "$(file-code) VSinder Snippet";
    this.item.command = "vsinder.addCodeToProfile";
  }

  static show = () => {
    SnippetStatus.snippetStatus.item.show();
  };

  static hide = () => {
    SnippetStatus.snippetStatus.item.hide();
  };

  static createSnippetStatus = () => {
    if (!SnippetStatus.snippetStatus) {
      SnippetStatus.snippetStatus = new SnippetStatus();
    }
  };
}
