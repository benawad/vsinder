<script lang="ts">
  import SmallButton from "./SmallButton.svelte";

  export let onBack: () => void;
</script>

<style>
  div {
    margin-top: 4px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
</style>

<div>
  <SmallButton on:click={onBack}>&lt; back</SmallButton>
  <slot />
</div>
