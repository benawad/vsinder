<script lang="ts">
  export let flair: string;
</script>

<style>
  img {
    height: 14px;
    width: 14px;
  }
</style>

{#if flair in flairMap}<img src={flairMap[flair]} alt={flair} />{/if}
