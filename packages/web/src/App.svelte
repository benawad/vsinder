<script lang="ts">
  import { onMount } from "svelte";
  import CodeCard from "./CodeCard.svelte";

  import type { Profile } from "./types";

  let hasLoadedMale = false;

  let state: "overall" | "male" = "overall";
  let profiles: Profile[] = [];
  let maleProfiles: Profile[] = [];

  onMount(async () => {
    const r = await fetch("https://api.vsinder.com/leaderboard");
    const data = await r.json();
    profiles = data.profiles;
  });
</script>

<style>
  main {
    text-align: center;
    padding: 8px;
  }
  .pwrapper {
    margin-bottom: 50px;
  }
  .cwrapper {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    justify-content: center;
  }
  .bwrapper {
    display: flex;
    max-width: 400px;
  }
</style>

<main>
  <div class="cwrapper">
    <div class="bwrapper">
      <button
        class:secondary={state !== 'overall'}
        on:click={() => {
          state = 'overall';
        }}>overall</button>
      <div style="width: 20px" /><button
        class:secondary={state !== 'male'}
        on:click={async () => {
          if (hasLoadedMale) {
            state = 'male';
            return;
          }
          hasLoadedMale = true;
          const r = await fetch('https://api.vsinder.com/leaderboard/male');
          const data = await r.json();
          maleProfiles = data.profiles;
          state = 'male';
        }}>male</button>
    </div>
  </div>
  {#each state === 'male' ? maleProfiles : profiles as p, i}
    <div class="pwrapper">
      <div class="cwrapper">
        <CodeCard profile={p} />
      </div>
      <h1>{p.numLikes} likes</h1>
    </div>
  {/each}
</main>
