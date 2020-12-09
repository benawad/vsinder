<script lang="ts">
  import type { Message } from "../shared/types";
  import { dtToMsgStr } from "../shared/utils";
  import Avatar from "../ui/Avatar.svelte";

  export let userInfo: { id: string; displayName: string; flair: string };
  export let myId: string;
  export let photoUrl: string;
  export let mg: Message[];
  export let i: number;

  $: lastMessage = mg[mg.length - 1];
  $: isSender = lastMessage.senderId === myId;
</script>

<style>
  .dt {
    display: flex;
    margin-bottom: 20px;
  }
  .sender.bubble {
    margin-left: 30px;
  }
  .recipient.bubble {
    margin-right: 30px;
  }
  .bubble {
    display: flex;
    margin-bottom: 4px;
  }

  .sender.bubble > div {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  .recipient.bubble > div {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .sender.start > div {
    border-top-right-radius: 16px;
  }
  .recipient.start > div {
    border-top-left-radius: 16px;
  }

  .sender > div {
    padding: 10px 15px;
    margin-left: auto;
    color: var(--vscode-button-foreground);
    background: var(--vscode-button-background);
  }
  .sender-date {
    margin-left: auto;
  }
  .recipient > div {
    padding: 10px;
    margin-right: auto;
    color: var(--vscode-button-secondaryForeground);
    background: var(--vscode-button-secondaryBackground);
  }
  .recipient-date {
    margin-right: auto;
  }
  .panel {
    height: 100%;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }
  .msg-container {
    padding: 0px var(--container-paddding);
    display: flex;
    flex-direction: column-reverse;
    flex: 1;
    min-height: 0px;
    overflow-y: auto;
  }
  .message-group {
    display: flex;
    flex-direction: column-reverse;
  }
  .mb {
    margin-bottom: auto;
  }
  .ml {
    margin-left: 43px;
  }
  .flex {
    display: flex;
  }
  .avatar {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
</style>

<div class="message-group" class:mb={i === 0}>
  <div class:ml={!isSender} class="dt">
    <div class={`${isSender ? 'sender' : 'recipient'}-date`}>
      {dtToMsgStr(new Date(lastMessage.createdAt))}
    </div>
  </div>
  <div class:flex={lastMessage.senderId !== myId}>
    {#if !isSender}
      <div style="margin-top: auto; margin-bottom: 1px;">
        <Avatar
          on:click={(e) => {
            e.stopPropagation();
            tsvscode.postMessage({ type: 'view-code-card', value: userInfo });
          }}
          size={39}
          src={photoUrl} />
      </div>
    {/if}
    <div style="margin-left: 4px; flex: 1;" class="message-group">
      {#each mg as m, i}
        <div
          class={`bubble ${isSender ? 'sender' : 'recipient'} ${i === mg.length - 1 ? 'start' : ''}`}>
          <div>{m.text}</div>
        </div>
      {/each}
    </div>
  </div>
</div>
