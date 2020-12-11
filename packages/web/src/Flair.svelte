<script lang="ts">
  import { flairMap } from "./flairMap";

  export let flair: string;
</script>

<style>
  img {
    height: 14px;
    width: 14px;
  }
</style>

{#if flair in flairMap}
  <img src={`https://flair.benawad.com/` + flairMap[flair]} alt={flair} />
{/if}
