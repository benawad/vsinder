<script lang="ts">
  export let fn: () => void;
  export let v: any;

  $: {
    if (v) {
      fn();
    }
  }
</script>
