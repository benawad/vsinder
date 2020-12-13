<script lang="ts">
  import { flip } from "svelte/animate";
  import LoadingButton from "../ui/LoadingButton.svelte";
  import { mutation } from "../shared/mutation";
  import SmallButton from "../ui/SmallButton.svelte";
  import CodeImg from "../ui/CodeImg.svelte";
  import type { CodeImgIdItem } from "../shared/types";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import { onMount } from "svelte";

  export let codeImgIds: CodeImgIdItem[];
  export let onDone: (x: string[]) => void;
  export let onWantsToAddAnotherImg: () => void;

  let disabled = false;
  let hovering = -1;
  $: atleastOneImgIsLoading = codeImgIds.some((x) => !x.value);

  const drop = (event: any, target: any) => {
    event.dataTransfer.dropEffect = "move";
    const start = parseInt(event.dataTransfer.getData("text/plain"));
    const newList = [...codeImgIds];

    if (start < target) {
      newList.splice(target + 1, 0, newList[start]);
      newList.splice(start, 1);
    } else {
      newList.splice(target, 0, newList[start]);
      newList.splice(start + 1, 1);
    }
    codeImgIds = newList;
    hovering = -1;
  };

  const dragstart = (event: any, i: number) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text/plain", i);
  };
</script>

<style>
  .active {
    border: solid 1px var(--vscode-textLink-foreground);
  }
  .center {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .img-container {
    cursor: move;
    position: relative;
    margin-bottom: 8px;
  }
  .pb {
    margin-top: 14px;
    margin-bottom: 40px;
  }
  .trash {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .fw {
    width: 100%;
  }
</style>

<div class="center">
  {#each codeImgIds as { value: imgId, tmpId }, index (tmpId)}
    <div
      class:fw={imgId === ''}
      class="img-container"
      animate:flip={{ duration: 100 }}
      draggable={true}
      on:dragstart={(event) => {
        dragstart(event, index);
      }}
      on:drop|preventDefault={(event) => {
        drop(event, index);
      }}
      on:dragover|preventDefault={() => false}
      on:dragenter={() => {
        hovering = index;
      }}>
      <svg
        on:click={() => {
          codeImgIds = codeImgIds.filter((_, i) => i !== index);
        }}
        class="trash"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z" /></svg>
      <div class:active={hovering === index}>
        {#if imgId === ''}
          <div style="padding-top: 8px; width: 100%; text-align: center;">
            generating image
            <LoadingSpinner />
          </div>
        {:else}
          <CodeImg id={imgId} />
        {/if}
      </div>
    </div>
  {/each}
  {#if codeImgIds.length < 6}
    <div class="pb">
      <SmallButton className="secondary" on:click={onWantsToAddAnotherImg}>
        + add another
      </SmallButton>
    </div>
  {/if}
</div>

<div style="margin-bottom: 20px;">
  <LoadingButton
    disabled={disabled || atleastOneImgIsLoading}
    on:click={async () => {
      if (!codeImgIds.length) {
        tsvscode.postMessage({
          type: 'onError',
          value: 'You need to add at least 1 code image',
        });
        return;
      }
      disabled = true;
      try {
        let ids = codeImgIds.map((x) => x.value);
        await mutation('/user/imgs', { codeImgIds: ids }, { method: 'PUT' });
        onDone(ids);
      } catch {}
      disabled = false;
    }}>
    {#if atleastOneImgIsLoading}
      wait for imgs to finish generating
    {:else}save{/if}
  </LoadingButton>
</div>
