<script lang="ts">
    import { onMount } from "svelte";

    export let query: string;

    let mql: MediaQueryList;
    let mqlListener: (query: MediaQueryListEvent) => void;
    let wasMounted = false;
    let matches = false;

    onMount(() => {
        wasMounted = true;
        return () => {
            removeActiveListener();
        };
    });

    $: {
        if (wasMounted) {
            removeActiveListener();
            addNewListener(query);
        }
    }

    function addNewListener(query: string) {
        mql = window.matchMedia(query);
        mqlListener = v => matches = v.matches;
        mql.addEventListener("change", mqlListener);
        matches = mql.matches;
    }

    function removeActiveListener() {
        if (mql && mqlListener) {
            mql.removeEventListener("change", mqlListener);
        }
    }
</script>

<slot {matches} />
