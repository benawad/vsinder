<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import {
    defaultThemeAndLanguage,
    initialProfileData,
  } from "../shared/constants";
  import { query } from "../shared/query";
  import type {
    MeResponse,
    State,
    User,
    WebsocketMessages,
  } from "../shared/types";
  import CodeSnippeter from "../screens/CodeSnippeter.svelte";
  import EditProfile from "../screens/EditProfile.svelte";
  import LoadingSpinner from "../ui/LoadingSpinner.svelte";
  import Matches from "../screens/Matches.svelte";
  import ReviewCodeImgs from "../screens/ReviewCodeImgs.svelte";
  import ViewProfile from "../screens/ViewProfile.svelte";
  import { getSocket } from "../shared/io";
  import Backbar from "../ui/Backbar.svelte";
  import { genId } from "../shared/utils";

  let gotTokens = false;
  let currentUserIsLoading: boolean = true;
  let currentUser: User | null = null;
  let hasAddedWsConnection = false;
  let lastState = tsvscode.getState();
  function removeLoadingImgsFromState(s: State) {
    if (s.page === "review-code-imgs") {
      return {
        ...s,
        codeImgIds: s.codeImgIds.filter((x) => x.value),
      };
    }
    return s;
  }
  let state: State =
    lastState && lastState.page !== "login" && lastState.page !== "loading"
      ? removeLoadingImgsFromState(lastState)
      : { page: "loading" };

  async function fetchUser() {
    if (!accessToken || !refreshToken) {
      return;
    }
    try {
      const r: MeResponse = await query("/me");
      currentUser = r.user;
      return r.user;
    } catch {}
  }

  function userToInitialFormData(u: User) {
    const dt = new Date(u.birthday);

    return {
      bio: u.bio,
      displayName: u.displayName,
      gender: u.gender || initialProfileData.gender,
      genderToShow: u.genderToShow || initialProfileData.genderToShow,
      gendersToShow: u.gendersToShow,
      goal: u.goal || initialProfileData.goal,
      ageRangeMax: u.ageRangeMax || initialProfileData.ageRangeMax,
      ageRangeMin: u.ageRangeMin || initialProfileData.ageRangeMin,
      global: u.global,
      flair: u.flair,
      year: "" + dt.getFullYear(),
      month: "" + dt.getMonth(),
      day: "" + dt.getDate(),
      location: u.location,
    };
  }

  function goToEditForm() {
    if (currentUser) {
      state = {
        page: "profile-form",
        data: userToInitialFormData(currentUser),
      };
    }
  }

  function redirectUser(u?: User | null) {
    if (u) {
      addWsListener();
      if (!u.goal) {
        const data = { ...initialProfileData, ...userToInitialFormData(u) };
        state = {
          page: "profile-form",
          data,
        };
      } else if (!u.codeImgIds.length) {
        state = {
          page: "code-snippet",
          data: { code: "", ...defaultThemeAndLanguage },
          codeImgIds: [],
        };
      } else {
        state = { page: "view-profile" };
      }
    } else {
      state = { page: "login" };
    }
  }

  function addWsListener() {
    if (!hasAddedWsConnection) {
      getSocket().addEventListener("message", onWebsocketEvent);
    }
    hasAddedWsConnection = true;
  }

  onMount(async () => {
    tsvscode.postMessage({ type: "send-tokens" });
  });

  $: {
    tsvscode.setState(state);
  }

  window.addEventListener("message", async (event) => {
    const message = event.data;
    switch (message.command) {
      case "init-tokens":
        accessToken = message.payload.accessToken;
        refreshToken = message.payload.refreshToken;
        gotTokens = true;
        try {
          const u = await fetchUser();
          if (state.page === "loading") {
            redirectUser(u);
          } else if (!u) {
            state = { page: "login" };
          } else if (state.page !== "login") {
            addWsListener();
          }
        } catch {}
        currentUserIsLoading = false;
        break;
      case "new-code-snippet":
        if (state.page === "code-snippet") {
          state.data = { ...state.data, ...message.data };
        }
        break;
      case "account-deleted":
        accessToken = "";
        refreshToken = "";
        state = { page: "login" };
        currentUser = null;
        break;
      case "login-complete":
        accessToken = message.payload.accessToken;
        refreshToken = message.payload.refreshToken;
        fetchUser().then((u) => {
          redirectUser(u);
        });
        break;
    }
  });

  function onWebsocketEvent(e: MessageEvent) {
    if (!currentUser) {
      return;
    }
    const payload: WebsocketMessages = JSON.parse(e.data);
    if (payload.type === "new-like") {
      currentUser.numLikes += 1;
    } else if (payload.type === "new-match") {
      if (
        currentUser.unreadMatchUserIds.every(
          ({ userId1, userId2 }) =>
            userId1 !== payload.userId1 && userId2 !== payload.userId2
        )
      ) {
        currentUser.unreadMatchUserIds = [
          {
            userId1: payload.userId1,
            userId2: payload.userId2,
          },
          ...currentUser.unreadMatchUserIds,
        ];
      }
    } else if (payload.type === "new-message") {
      const [u1, u2] = [
        payload.message.recipientId,
        payload.message.senderId,
      ].sort();
      if (
        (state.page !== "matches" ||
          !state.user ||
          (state.user.id !== u1 && state.user.id !== u2)) &&
        currentUser.unreadMatchUserIds.every(
          ({ userId1, userId2 }) => userId1 !== u1 && userId2 !== u2
        )
      ) {
        currentUser.unreadMatchUserIds = [
          {
            userId1: u1,
            userId2: u2,
          },
          ...currentUser.unreadMatchUserIds,
        ];
      }
    }
  }

  function onImgCreated(tmpId: string, value: string) {
    if (state.page === "code-snippet" || state.page === "review-code-imgs") {
      if (value === "error") {
        state.codeImgIds = state.codeImgIds.filter((x) => x.tmpId !== tmpId);
      } else {
        state.codeImgIds = state.codeImgIds.map((x) =>
          x.tmpId === tmpId ? { tmpId, value } : x
        );
      }
    }
  }

  onDestroy(() => {
    getSocket().removeEventListener("message", onWebsocketEvent);
  });
</script>

<style>
  .mainer {
    padding: 0px var(--container-paddding);
    flex: 1;
  }
</style>

<main class:mainer={state?.page !== 'matches'}>
  {#if !gotTokens}
    <div
      on:click={() => {
        tsvscode.postMessage({ type: 'send-tokens' });
      }}>
      Hopefully you never see this text, but if you do that means this code
      hasn't received a message from VSCode and it was expecting one. Try
      clicking on this text to tell VSCode to send us another message.
    </div>
  {:else if state.page === 'loading'}
    <LoadingSpinner />
  {:else if state.page === 'profile-form'}
    {#if currentUser?.gender}
      <Backbar
        onBack={() => {
          state = { page: 'view-profile' };
        }} />
    {/if}
    <EditProfile
      bind:data={state.data}
      buttonText={currentUser?.codeImgIds.length ? 'save' : 'next'}
      onNext={(user) => {
        currentUser = user;
        if (currentUser.codeImgIds.length) {
          state = { page: 'view-profile' };
        } else {
          state = { page: 'code-snippet', data: { code: '', ...defaultThemeAndLanguage }, codeImgIds: [] };
        }
      }} />
  {:else if state.page === 'login'}
    <div style="margin-bottom: 40px;">
      By tapping login with Github, you agree to our
      <a href="https://www.vsinder.com/terms">terms</a>
    </div>
    <button
      on:click={() => {
        tsvscode.postMessage({ type: 'login' });
      }}>login with GitHub to get started</button>
  {:else if state.page === 'code-snippet'}
    <Backbar
      onBack={() => {
        if (state.page === 'code-snippet' && state.codeImgIds.length) {
          state = { page: 'review-code-imgs', codeImgIds: state.codeImgIds };
        } else {
          goToEditForm();
        }
      }} />
    <CodeSnippeter
      onImg={async (data) => {
        const tmpId = genId();
        if (state.page === 'code-snippet') {
          state = { page: 'review-code-imgs', codeImgIds: [...state.codeImgIds, { tmpId, value: '' }] };
        }
        try {
          const r = await fetch(
            'https://x9lecdo5aj.execute-api.us-east-1.amazonaws.com/code-to-img',
            {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if (r.status !== 200) {
            throw new Error(await r.text());
          }
          const { key } = await r.json();
          onImgCreated(tmpId, key);
        } catch (err) {
          tsvscode.postMessage({ type: 'onError', value: err.message });
          onImgCreated(tmpId, 'error');
        }
      }}
      bind:data={state.data} />
  {:else if state.page === 'review-code-imgs'}
    <Backbar
      onBack={() => {
        if (currentUser?.codeImgIds.length) {
          state = { page: 'view-profile' };
        } else {
          goToEditForm();
        }
      }} />
    <ReviewCodeImgs
      onDone={(codeImgIds) => {
        if (currentUser) {
          currentUser.codeImgIds = codeImgIds;
        }
        state = { page: 'view-profile' };
      }}
      onWantsToAddAnotherImg={() => {
        if (state.page === 'review-code-imgs') {
          state = { page: 'code-snippet', codeImgIds: state.codeImgIds, data: { code: '', ...defaultThemeAndLanguage } };
        }
      }}
      bind:codeImgIds={state.codeImgIds} />
  {:else if state.page === 'view-profile'}
    <ViewProfile
      {currentUser}
      {currentUserIsLoading}
      onLogout={() => {
        state = { page: 'login' };
        currentUser = null;
      }}
      onViewMatches={() => {
        state = { page: 'matches' };
      }}
      onEditProfile={() => {
        goToEditForm();
      }}
      onEditCode={(codeImgIds) => {
        state = { page: 'review-code-imgs', codeImgIds: codeImgIds.map(
            (x, i) => ({
              tmpId: genId(),
              value: x,
            })
          ) };
      }} />
  {/if}
</main>

{#if state.page === 'matches'}
  <Matches
    onNewState={(s) => {
      state = s;
    }}
    {currentUserIsLoading}
    bind:currentUser
    bind:state />
{/if}
