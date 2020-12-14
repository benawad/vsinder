<script lang="ts">
    export let value: string[];
    export let options: Array<{ value: string; label: string }>;
</script>

<style>
    div {
        display: flex;
    }
    label {
        margin-right: 6px;
        display: flex;
    }
    input {
        margin-left: 0px;
        width: unset;
    }
</style>

<div>
    {#each options as opt}
        <label>
            <input type="checkbox" bind:group={value} value={opt.value} />
            {opt.label}
        </label>
    {/each}
</div>
