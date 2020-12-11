<script lang="ts">
  import DoOnMount from "../components/DoOnMount.svelte";
  import Messages from "./Messages.svelte";
  import { onDestroy, onMount } from "svelte";
  import { query } from "../shared/query";
  import type {
    MatchesResponse,
    Match,
    MatchState,
    State,
    User,
    Message,
    WebsocketMessages,
  } from "../shared/types";
  import { dtToHumanStr, getUserIdOrder } from "../shared/utils";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import { getSocket } from "../shared/io";
  import Avatar from "../ui/Avatar.svelte";
  import Backbar from "../ui/Backbar.svelte";
  import LoadingButton from "../ui/LoadingButton.svelte";
  import { mutation } from "../shared/mutation";
  import SmallButton from "../ui/SmallButton.svelte";
  import Flair from "../ui/Flair.svelte";

  export let currentUserIsLoading: boolean;
  export let currentUser: User | null;
  export let state: MatchState;
  export let onNewState: (s: State) => void;
  let loadingUnmatch = false;
  let cursor = 0;
  let loading = true;
  let matches: Match[] = [];

  $: isInMatches = matches.some(
    (m) => state.user && m.userId === state.user.id
  );

  function compareMatches(a: Match, b: Match) {
    const v1 = a.message?.createdAt || a.createdAt;
    const v2 = b.message?.createdAt || b.createdAt;
    if (v1 > v2) {
      return -1;
    }
    if (v1 < v2) {
      return 1;
    }
    return 0;
  }

  function onMessage(newMessage: Message) {
    matches = matches
      .map((m) =>
        m.userId === newMessage.senderId || m.userId === newMessage.recipientId
          ? {
              ...m,
              message: {
                createdAt: newMessage.createdAt,
                text: newMessage.text,
              },
            }
          : m
      )
      .sort(compareMatches);
  }

  function onUnmatch(userId: string) {
    matches = matches.filter((x) => x.userId !== userId);
  }

  function onWindowMessage(event: any) {
    const message = event.data;
    switch (message.command) {
      case "report-done":
        if (message.data.value.unmatchOrReject === "unmatch" && state.user) {
          onUnmatch(state.user.id);
          state = { page: "matches" };
        }
        break;
    }
  }

  async function fetchMatches() {
    loading = true;
    try {
      const r: MatchesResponse = await query("/matches/" + cursor);
      matches = r.matches.sort(compareMatches);
      if (currentUser) {
        currentUser.unreadMatchUserIds = matches
          .filter((x) => !x.read)
          .map((x) => getUserIdOrder(x.userId, currentUser!.id));
      }
    } catch {}
    loading = false;
  }

  function onWebsocketEvent(e: MessageEvent) {
    const payload: WebsocketMessages = JSON.parse(e.data);
    if (payload.type === "new-message") {
      onMessage(payload.message);
    } else if (payload.type === "new-match") {
      fetchMatches();
    }
  }

  onMount(async () => {
    await fetchMatches();
    window.addEventListener("message", onWindowMessage);
    getSocket().addEventListener("message", onWebsocketEvent);
  });
  onDestroy(() => {
    window.removeEventListener("message", onWindowMessage);
    getSocket().removeEventListener("message", onWebsocketEvent);
  });
</script>

<style>
  .cell {
    width: 100%;
    border-bottom: 1px solid var(--vscode-button-secondaryBackground);
    padding: 15px;
    display: flex;
    cursor: pointer;
  }
  .cell:hover {
    background-color: var(--vscode-button-secondaryHoverBackground);
  }
  .middle {
    padding: 0 10px;
    flex: 1;
    min-width: 0px;
  }
  .dotdotdot {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .unread {
    background-color: var(--vscode-button-secondaryBackground);
  }
  .container {
    padding: 0px var(--container-paddding);
  }
  main {
    padding: 0px var(--container-paddding);
  }
  .name {
    display: flex;
    align-items: center;
    font-size: calc(var(--vscode-font-size) * 1.2);
    color: var(--vscode-foreground);
    margin-bottom: 4px;
  }
  div {
    color: var(--vscode-descriptionForeground);
  }
  span {
    margin-top: 2px;
    margin-left: 4px;
  }
</style>

<main>
  <Backbar
    onBack={() => {
      if (state.page === 'matches' && state.user) {
        onNewState({ page: 'matches' });
      } else {
        onNewState({ page: 'view-profile' });
      }
    }}>
    {#if state.user && isInMatches}
      <div style="display: flex;">
        <div style="margin-right: 10px;">
          <SmallButton
            on:click={() => {
              if (state.user) {
                tsvscode.postMessage({
                  type: 'report',
                  value: { userId: state.user.id, unmatchOrReject: 'unmatch' },
                });
              }
            }}>
            report
          </SmallButton>
        </div>
        <LoadingButton
          lt
          disabled={loadingUnmatch}
          on:click={async () => {
            if (state.user) {
              loadingUnmatch = true;
              try {
                await mutation(`/unmatch`, { userId: state.user.id });
                onUnmatch(state.user.id);
                state = { page: 'matches' };
              } catch {}
              loadingUnmatch = false;
            }
          }}>
          unmatch
        </LoadingButton>
      </div>
    {/if}
  </Backbar>
</main>
{#if state.user && currentUser && isInMatches}
  <Messages {onUnmatch} {onMessage} myId={currentUser.id} user={state.user} />
{:else if loading || currentUserIsLoading}
  <LoadingSpinner />
{:else if state.user && !currentUser}
  <DoOnMount
    fn={() => {
      onNewState({ page: 'login' });
    }} />
{:else}
  <div class="container">
    {#if matches.length === 0}
      <div>no matches</div>
    {/if}
    {#each matches as match, i}
      <div
        on:click={() => {
          matches[i].read = true;
          state.user = { id: match.userId, photoUrl: match.photoUrl, flair: match.flair, displayName: match.displayName, matchId: match.matchId };
          if (currentUser) {
            const [u1, u2] = [currentUser.id, match.userId].sort();
            currentUser.unreadMatchUserIds = currentUser.unreadMatchUserIds.filter(({ userId1, userId2 }) => userId1 !== u1 && userId2 !== u2);
          }
        }}
        class:unread={!match.read}
        class="cell">
        <Avatar
          on:click={(e) => {
            e.stopPropagation();
            tsvscode.postMessage({
              type: 'view-code-card',
              value: {
                id: match.userId,
                flair: match.flair,
                displayName: match.displayName,
              },
            });
          }}
          src={match.photoUrl} />
        <div class="middle">
          <div class="name dotdotdot">
            {match.displayName}
            {#if match.flair in flairMap}
              <span>
                <Flair flair={match.flair} />
              </span>
            {/if}
          </div>
          {#if match.message}
            <div class="dotdotdot">{match.message.text}</div>
          {/if}
        </div>
        <div>
          {dtToHumanStr(new Date(match.message ? match.message.createdAt : match.createdAt))}
        </div>
      </div>
    {/each}
  </div>
{/if}
