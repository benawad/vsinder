<script lang="ts">
  import { onMount } from "svelte";
  export let fn: () => void;

  onMount(() => fn());
</script>
