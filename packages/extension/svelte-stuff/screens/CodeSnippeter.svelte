<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import {
    fontOptions,
    languageOptions,
    themeOptions,
  } from "../shared/constants";
  import type { SnippetData } from "../shared/types";
  import InputField from "../ui/InputField.svelte";
  import SelectField from "../ui/SelectField.svelte";

  export let onImg: (x: SnippetData) => void;
  export let data: SnippetData;
  onMount(() => {
    tsvscode.postMessage({ type: "show-snippet-status" });
  });

  onDestroy(() => {
    tsvscode.postMessage({ type: "hide-snippet-status" });
  });
</script>

<style>
  main > div {
    margin-bottom: 30px;
  }
  .note {
    margin-top: 6px;
    color: var(--vscode-descriptionForeground);
  }
</style>

<main>
  <div>
    <SelectField
      label="Syntax Highlighting"
      name="language"
      bind:value={data.language}
      options={languageOptions} />
  </div>
  <div>
    <SelectField
      label="Theme"
      name="theme"
      bind:value={data.theme}
      options={themeOptions} />
  </div>
  <div>
    <SelectField
      label="Font Family"
      name="fontFamily"
      bind:value={data.fontFamily}
      options={fontOptions} />
  </div>
  <div>
    <InputField
      min={0}
      max={600}
      textArea
      name="code"
      label={`Code ${data.code.length}/600`}
      bind:value={data.code} />
  </div>
  <div>
    <a
      href="https://dreamy-ptolemy-eb4e80.netlify.app/?code={encodeURIComponent(data.code)}&l={encodeURIComponent(data.language)}&t={encodeURIComponent(data.theme)}&fm={encodeURIComponent(data.fontFamily)}&fs=14px">click
      to preview</a>
    <div class="note">
      note: the canvas will be set to width 400px and height
      {Math.floor((400 * 10) / 7)}px for the image
    </div>
  </div>
  <div style="padding-top: 20px;">
    <button
      on:click={() => {
        if (data.code) {
          onImg(data);
        }
      }}
      type="button">
      save code snippet
    </button>
  </div>
</main>
