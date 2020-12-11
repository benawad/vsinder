<script lang="ts">
  import { onMount } from "svelte";
  // @ts-ignore
  import {} from "googlemaps";

  import Labeler from "./Labeler.svelte";

  export let name: string;
  export let label = "";
  export let placeholder = "";
  export let value: string | number;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let required: boolean = false;

  let inputField: any;

  onMount(() => {
    const autocomplete = new google.maps.places.Autocomplete(inputField, {
      type: "(cities)",
    });
    autocomplete.addListener("place_changed", () => {
      value = inputField.value;
    });
  });
</script>

<style>
  input {
    margin-top: 4px;
  }
</style>

<Labeler {name} {label}>
  <input
    bind:this={inputField}
    {placeholder}
    {required}
    {name}
    {min}
    {max}
    bind:value
    id={name} />
</Labeler>
