<script lang="ts">
  import Labeler from "./Labeler.svelte";

  export let required = false;
  export let name: string;
  export let label = "";
  export let value: string;
  export let options: Array<{ value: string; label: string }>;
</script>

<style>
</style>

<Labeler {name} {label}>
  <select {required} {name} id={name} bind:value>
    {#each options as o}
      <option value={o.value}>{o.label}</option>
    {/each}
  </select>
</Labeler>
