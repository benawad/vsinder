<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getSocket } from "../shared/io";
  import { mutation } from "../shared/mutation";
  import { query } from "../shared/query";
  import type {
    MatchState,
    Message,
    MessagesResponse,
    WebsocketMessages,
  } from "../shared/types";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import MessageGroup from "../components/MessageGroup.svelte";
  import LoadingButton from "../ui/LoadingButton.svelte";

  export let user: NonNullable<MatchState["user"]>;
  export let myId: string;
  export let onMessage: (m: Message) => void;
  export let onUnmatch: (x: string) => void;
  let loadingMessageSent = false;
  let loading = true;
  let isLoadingMore = false;
  let unmatched = false;
  let hasMore = false;
  let messages: Message[] = [];
  let text = "";
  let messageGroups: Message[][] = [];
  $: {
    let newMessageGroups: Message[][] = [];
    messages.forEach((m) => {
      if (!newMessageGroups[0]) {
        newMessageGroups.push([m]);
        return;
      }

      const lastGroup = newMessageGroups[newMessageGroups.length - 1];
      const lastMessage = lastGroup[lastGroup.length - 1];

      if (
        lastMessage.createdAt - m.createdAt > 120000 ||
        m.senderId !== lastMessage.senderId
      ) {
        newMessageGroups.push([m]);
        return;
      }

      newMessageGroups[newMessageGroups.length - 1].push(m);
    });
    messageGroups = newMessageGroups;
  }

  function onWebsocketEvent(e: MessageEvent) {
    const payload: WebsocketMessages = JSON.parse(e.data);
    if (
      payload.type === "new-message" &&
      payload.message.senderId === user.id
    ) {
      messages = [payload.message, ...messages];
    } else if (payload.type === "unmatch") {
      onUnmatch(payload.userId);
      unmatched = true;
    }
  }

  async function fetchMessages() {
    const payload: MessagesResponse = await query(
      `/messages/${user.id}/${
        messages.length ? messages[messages.length - 1].createdAt : ""
      }`
    );
    messages = [
      ...messages,
      ...payload.messages.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      }),
    ];
    hasMore = payload.hasMore;
  }

  onMount(async () => {
    try {
      const socket = getSocket();
      socket.addEventListener("message", onWebsocketEvent);
    } catch (err) {
      console.log(err);
    }
    try {
      await fetchMessages();
    } catch {}
    loading = false;
  });
  onDestroy(() => {
    const socket = getSocket();
    socket.send(JSON.stringify({ type: "message-open", userId: null }));
    socket.removeEventListener("message", onWebsocketEvent);
  });
</script>

<style>
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
  form {
    padding: 0px var(--container-paddding);
  }
  .display-name {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-top: -5px;
    cursor: pointer;
  }
</style>

{#if unmatched}
  <div class="panel">
    <div class="msg-container">
      <div>They unmatched you</div>
    </div>
  </div>
{:else if loading}
  <LoadingSpinner />
{:else}
  <h2
    on:click={() => {
      tsvscode.postMessage({ type: 'view-code-card', value: user });
    }}
    class="display-name">
    {user.displayName}
  </h2>
  <div class="panel">
    <div class="msg-container">
      {#each messageGroups as mg, i}
        <MessageGroup
          userInfo={{ id: user.id, flair: user.flair, displayName: user.displayName }}
          {i}
          {mg}
          {myId}
          photoUrl={user.photoUrl} />
      {/each}
      {#if hasMore}
        <div
          style="margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
          <LoadingButton
            lt
            disabled={isLoadingMore}
            on:click={async () => {
              isLoadingMore = true;
              try {
                await fetchMessages();
              } catch {}
              isLoadingMore = false;
            }}>
            load more
          </LoadingButton>
        </div>
      {/if}
    </div>
    <form
      disabled={loadingMessageSent}
      on:submit|preventDefault={async () => {
        if (!text) {
          return;
        }
        loadingMessageSent = true;
        try {
          const { message } = await mutation(`/message`, {
            recipientId: user.id,
            text,
            matchId: user.matchId,
          });
          messages = [message, ...messages];
          onMessage(message);
        } catch {}
        loadingMessageSent = false;
        text = '';
      }}>
      <input placeholder="Type a message" bind:value={text} />
    </form>
  </div>
{/if}
