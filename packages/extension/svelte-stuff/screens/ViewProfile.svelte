<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getSocket } from "../shared/io";

  import type { User, WebsocketMessages } from "../shared/types";
  import { getAge } from "../shared/utils";
  import Avatar from "../ui/Avatar.svelte";
  import ButtonIcon from "../ui/ButtonIcon.svelte";
  import CommentIcon from "../ui/CommentIcon.svelte";
  import Flair from "../ui/Flair.svelte";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import SmallButton from "../ui/SmallButton.svelte";

  export let onEditCode: (x: string[]) => void;
  export let onEditProfile: () => void;
  export let onViewMatches: () => void;
  export let onLogout: () => void;

  export let currentUser: User | null;
  export let currentUserIsLoading: boolean;
</script>

<style>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mb {
    margin-bottom: 16px;
  }

  .name {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: 500;
    font-size: calc(var(--vscode-font-size) * 1.3);
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  span {
    margin-top: 4px;
    margin-left: 4px;
  }
  .logout-container {
    margin-top: auto;
    width: 100%;
    padding-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  .top-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

{#if currentUserIsLoading}
  <LoadingSpinner />
{:else if currentUser}
  <div class="top-container">
    <div class="header">
      <div>{currentUser.numLikes} likes received</div>
      <CommentIcon
        on:click={() => onViewMatches()}
        n={currentUser.unreadMatchUserIds.length} />
    </div>
    {#if currentUser}
      <div style="margin-top: 16px;" class="center">
        <Avatar
          on:click={() => {
            if (currentUser) {
              tsvscode.postMessage({
                type: 'view-code-card',
                value: {
                  id: currentUser.id,
                  displayName: currentUser.displayName,
                  flair: currentUser.flair,
                },
              });
            }
          }}
          size={80}
          src={currentUser.photoUrl} />
      </div>
      <div
        style="display: flex; align-items: center; justify-content: center; margin-top: 6px;"
        class="mb">
        <div class="name">
          {currentUser.displayName},
          {getAge(new Date(currentUser.birthday))}
        </div>
        {#if currentUser && currentUser.flair in flairMap}
          <span>
            <Flair flair={currentUser.flair} />
          </span>
        {/if}
      </div>
      <div class="mb">
        <button class="secondary" on:click={() => onEditProfile()}>edit profile</button>
      </div>
      <div class="mb">
        <button
          class="secondary"
          on:click={() => {
            if (currentUser) {
              onEditCode(currentUser.codeImgIds);
            }
          }}>
          edit code pics
        </button>
      </div>
      <button
        type="button"
        on:click={() => {
          tsvscode.postMessage({ type: 'start-swiping' });
        }}>start swiping</button>
      <div class="mb" style="margin-top: 40px;">
        (To change your profile picture, you need to change it on GitHub then
        logout and login again)
      </div>
      <div>
        <a class="secondary" href="https://github.com/benawad/vsinder/issues">
          report a bug
        </a>
      </div>
    {/if}
    <div class="logout-container">
      <div style="width: 32px">
        <ButtonIcon
          icon="logout"
          on:click={() => {
            accessToken = '';
            refreshToken = '';
            tsvscode.postMessage({ type: 'logout' });
            onLogout();
          }} />
      </div>
      <SmallButton
        on:click={() => {
          tsvscode.postMessage({ type: 'delete-account' });
        }}>
        delete account
      </SmallButton>
    </div>
  </div>
{:else}
  <div>you should never see this :)</div>
{/if}
