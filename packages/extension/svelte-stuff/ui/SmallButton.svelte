<script lang="ts">
  export let disabled = false;
  export let type = "button";
  export let className = "";
</script>

<style>
  button {
    width: unset;
  }
</style>

<button class={className} {type} {disabled} on:click>
  <slot />
</button>
