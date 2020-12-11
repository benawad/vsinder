<script lang="ts">
  import { onMount } from "svelte";
  import { query } from "../shared/query";
  import type { OneUserResponse, Profile } from "../shared/types";
  import CodeCard from "../ui/CodeCard.svelte";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";

  let loadingState: "init" | "ready" = "init";
  let profile: Profile | null = null;

  onMount(async () => {
    try {
      const payload: OneUserResponse = await query(`/user/${userId}`);
      profile = payload.user;
    } catch {}
    loadingState = "ready";
  });
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

{#if loadingState === 'init'}
  <LoadingSpinner />
{:else if !profile}
  <h1 style="text-align: center; margin: auto; max-width: 500px">
    Could not find profile
  </h1>
{:else}
  <div class="center">
    <CodeCard {profile} />
  </div>
{/if}
