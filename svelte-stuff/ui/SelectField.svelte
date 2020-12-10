<script lang="ts">
  import Labeler from "./Labeler.svelte";

  export let required = false;
  export let name: string;
  export let label = "";
  export let value: string;
  export let options: Array<{ value: string; label: string }>;
</script>

<style>
  select {
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    border: 1px solid var(--vscode-input-background);
    padding: 2px 23px 2px 8px;
  }
  select:hover {
    cursor: pointer;
  }
</style>

<Labeler {name} {label}>
    <select {required} {name} id={name} bind:value>
      {#each options as o}
        <option value={o.value}>{o.label}</option>
      {/each}
    </select>
</Labeler>
