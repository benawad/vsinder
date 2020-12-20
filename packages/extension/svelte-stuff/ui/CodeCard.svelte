<script lang="ts">
  import type { Profile } from "../shared/types";
  import Avatar from "./Avatar.svelte";
  import CodeImg from "./CodeImg.svelte";
  import Flair from "./Flair.svelte";

  export let profile: Profile;
  export let stamp: "nope" | "liked" | undefined = undefined;
  let expanded = false;
  $: {
    if (profile) {
      expanded = false;
    }
  }

  function onLeftImage() {
    const idx = profile.imgShowingIdx || 0;
    profile.imgShowingIdx = idx === 0 ? profile.codeImgIds.length - 1 : idx - 1;
  }
  function onRightImage() {
    const idx = profile.imgShowingIdx || 0;
    profile.imgShowingIdx = idx >= profile.codeImgIds.length - 1 ? 0 : idx + 1;
  }
</script>

<style>
  .img-container {
    width: 400px;
    position: relative;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
  .bottom-panel {
    background-color: #0d0d0d;
    border-bottom-left-radius: 9px;
    border-bottom-right-radius: 9px;
    padding: 12px;
    position: absolute;
    z-index: 2;
    bottom: 0;
    width: 100%;
  }
  .flex-grid {
    display: flex;
    width: 100%;
    position: absolute;
    z-index: 3;
    top: 5px;
    border-radius: 3px;
  }
  .col {
    flex: 1;
    margin: 1px;
    border-radius: 3px;
  }
  .inactive {
    background: rgb(153, 153, 153);
    opacity: 0.5;
    padding: 1px;
  }
  .active {
    background: rgb(255, 255, 255);
    opacity: 1;
    padding: 2px;
    border: 1px solid black;
  }
  .inner-wrapper {
    display: flex;
    align-items: center;
  }
  .name {
    font-weight: 800;
    font-size: calc(var(--vscode-font-size) * 1.4);
  }
  .age {
    margin-left: 6px;
    font-weight: 300;
    font-size: calc(var(--vscode-font-size) * 1.2);
    margin-bottom: 1px;
  }
  .bio {
    font-size: calc(var(--vscode-font-size) * 0.9);
    /* max-width: 100%; */
  }
  .dotdotdot {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row {
    display: flex;
    align-items: flex-end;
    margin-bottom: 2px;
  }
  div {
    color: #fff;
  }
  .left {
    top: 0;
    left: 0;
  }
  .left,
  .right {
    height: 100%;
    position: absolute;
    width: 50%;
    z-index: 1;
  }
  .left.has-more,
  .right.has-more {
    cursor: pointer;
  }
  .left.has-more:hover,
  .right.has-more:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .right {
    top: 0;
    right: 0;
  }
  span {
    margin-left: 4px;
  }
  .nope {
    position: absolute;
    right: 30px;
    top: 40px;
    transform: rotate(20deg);
    padding: 4px 6px;
    font-size: 50px;
    color: var(--vscode-inputValidation-errorBorder);
    border-radius: 4px;
    border: solid 4px var(--vscode-inputValidation-errorBorder);
  }
  .liked {
    position: absolute;
    left: 30px;
    top: 40px;
    transform: rotate(-20deg);
    padding: 4px 6px;
    font-size: 50px;
    color: green;
    border-radius: 4px;
    border: solid 4px green;
  }
</style>

<svelte:window
  on:keydown={(e) => {
    if (e.key === ' ' || e.key === 'ArrowDown') {
      onRightImage();
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
        expanded = !expanded;
        e.preventDefault();
    }
  }} />

<div class="img-container">
  {#if stamp === 'nope'}
    <div class="nope">NOPE</div>
  {:else if stamp === 'liked'}
    <div class="liked">LIKED</div>
  {/if}
  <div on:click={onLeftImage} class={`left ${profile.codeImgIds.length > 1 && 'has-more'}`} />
  <div on:click={onRightImage} class={`right ${profile.codeImgIds.length > 1 && 'has-more'}`} />
  <CodeImg id={profile.codeImgIds[profile.imgShowingIdx || 0]} />
  {#if profile.codeImgIds.length > 1}
    <div class="flex-grid">
      {#each profile.codeImgIds as _, i}
        <div class="col {(i === (profile.imgShowingIdx || 0)) ? "active" : "inactive"}"/>
      {/each}
    </div>
  {/if}
  <div
    on:click={() => {
      expanded = !expanded;
    }}
    class="bottom-panel">
    <div class="inner-wrapper">
      <Avatar size={30} src={profile.photoUrl} />
      <div style="margin-left: 10px; min-width: 0px;">
        <div class="row">
          <div class="name">{profile.displayName}</div>
          <div class="age">{profile.age}</div>
          {#if profile.flair in flairMap}
            <span>
              <Flair flair={profile.flair} />
            </span>
          {/if}
        </div>
        <div class:dotdotdot={!expanded} class="bio">{profile.bio}</div>
      </div>
    </div>
  </div>
</div>
