<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { mutation } from "../shared/mutation";
  import { query } from "../shared/query";
  import { sleep } from "../shared/sleep";
  import type { FeedResponse, Profile, User } from "../shared/types";
  import DoOnMount from "./DoOnMount.svelte";
  import LoadingButton from "../ui/LoadingButton.svelte";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import SmallButton from "../ui/SmallButton.svelte";
  import CodeImg from "../ui/CodeImg.svelte";
  import Avatar from "../ui/Avatar.svelte";
  import CodeCard from "../ui/CodeCard.svelte";
  import ButtonIcon from "../ui/ButtonIcon.svelte";
  import { fly } from "svelte/transition";
  import { linear } from "svelte/easing";
  import OnChange from "./OnChange.svelte";
  import type { da } from "date-fns/locale";
  import AnimateCardWrapper from "./AnimateCardWrapper.svelte";

  let loadingState: "init" | "more" | "ready" = "init";
  let dataToAnimate: {
    direction: "left" | "right";
    profile: Profile;
  } | null = null;
  let endOfProfiles = false;
  let viewMap: Record<string, "good" | "loading" | "bad"> = {};
  let profiles: Profile[] = [];

  $: {
    if (profiles[0]) {
      tsvscode.postMessage({
        type: "set-window-info",
        value: {
          displayName: profiles[0].displayName,
          flair: profiles[0].flair,
        },
      });
    }
  }

  function onWindowMessage(event: any) {
    const message = event.data;
    switch (message.command) {
      case "report-done":
        if (message.data.value.unmatchOrReject === "reject") {
          dataToAnimate = {
            direction: "left",
            profile: profiles[0],
          };
          profiles = profiles.slice(1);
        }
        break;
    }
  }

  onMount(async () => {
    window.addEventListener("message", onWindowMessage);
    try {
      const payload: FeedResponse = await query(`/feed`);
      profiles = payload.profiles;
    } catch {}
    loadingState = "ready";
  });
  onDestroy(() => {
    window.removeEventListener("message", onWindowMessage);
  });

  async function view(liked: boolean) {
    const id = profiles[0].id;
    if (dataToAnimate || !id || (id in viewMap && viewMap[id] !== "bad")) {
      return;
    }
    viewMap[id] = "loading";
    dataToAnimate = {
      direction: !liked ? "left" : "right",
      profile: profiles[0],
    };
    profiles = profiles.slice(1);
    try {
      await mutation(`/view`, { liked, userId: id });
      viewMap[id] = "good";
    } catch {
      viewMap[id] = "bad";
    }
  }

  async function loadMore() {
    if (loadingState === "more") {
      return;
    }
    loadingState = "more";
    for (let i = 0; i < 50; i++) {
      if (Object.values(viewMap).some((x) => x === "loading")) {
        await sleep(100);
      } else {
        break;
      }
    }
    try {
      const payload: FeedResponse = await query(`/feed`);
      if (payload.profiles.length === 0) {
        endOfProfiles = true;
      } else {
        profiles = [...profiles, ...payload.profiles];
      }
    } catch {}
    loadingState = "ready";
  }
</script>

<style>
  .center {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>

<svelte:window
  on:keydown={(e) => {
    if (!profiles[0]) {
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'h') {
      view(false);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'l') {
      view(true);
      e.preventDefault();
    }
  }} />

{#if loadingState === 'init'}
  <LoadingSpinner />
{:else if !endOfProfiles && !profiles[0]}
  <DoOnMount fn={loadMore} />
  <LoadingButton />
{:else if !profiles[0]}
  <h1 style="text-align: center; margin: auto; max-width: 500px">
    There are no more profiles, try changing your criteria or come back later
  </h1>
{:else}
  <div style="position: absolute;">
    <div style="margin-bottom: 4px;">Keyboard shortcuts:</div>
    <div>ArrowLeft or h: Nope</div>
    <div>ArrowRight or l: Like</div>
    <div>ArrowUp: Expand bio</div>
    <div>Spacebar or ArrowDown: Next photo</div>
  </div>
  <div class="center">
    <div style="position: relative;">
      {#if dataToAnimate}
        <AnimateCardWrapper direction={dataToAnimate.direction}>
          <CodeCard
            stamp={dataToAnimate.direction === 'left' ? 'nope' : 'liked'}
            profile={dataToAnimate.profile} />
        </AnimateCardWrapper>
        <OnChange
          v={dataToAnimate}
          fn={() => {
            dataToAnimate = null;
          }} />
      {/if}
      <CodeCard bind:profile={profiles[0]} />
    </div>
    <div style="display: flex; margin-top: 20px;">
      <ButtonIcon
        on:click={() => {
          view(false);
        }}
        icon="x" />
      <div style="width: 70px;" />
      <ButtonIcon
        on:click={() => {
          view(true);
        }}
        icon="heart" />
    </div>
    <div style="margin-top: 30px;">
      <button
        on:click={() => {
          tsvscode.postMessage({
            type: 'report',
            value: { userId: profiles[0].id, unmatchOrReject: 'reject' },
          });
        }}
        style="padding-left: 10px; padding-right: 10px;">Report
        {profiles[0].displayName}</button>
    </div>
  </div>
{/if}
