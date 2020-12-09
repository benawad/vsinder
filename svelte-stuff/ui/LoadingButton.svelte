<script lang="ts">
  export let lt = false;
  export let disabled = false;
  export let type = "button";
</script>

<style>
  button:disabled {
    filter: opacity(0.75);
  }
  .one {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0s;
    animation: dot 1.3s infinite;
    animation-delay: 0s;
  }
  .two {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0.2s;
    animation: dot 1.3s infinite;
    animation-delay: 0.2s;
  }
  .three {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0.3s;
    animation: dot 1.3s infinite;
    animation-delay: 0.3s;
  }
  @-webkit-keyframes dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

<button {type} {disabled} on:click>
  {#if lt && disabled}
    loading
  {:else}
    <slot />
  {/if}
  {#if disabled}
    <span class="one">.</span><span class="two">.</span><span
      class="three">.</span>
  {/if}
</button>
