<script lang="ts">
  import { flairOptions } from "../shared/constants";
  import { mutation } from "../shared/mutation";
  import type { ProfileFormData, User } from "../shared/types";
  import { getAge } from "../shared/utils";
  import CheckboxGroup from "../ui/CheckboxGroup.svelte";
  import Flair from "../ui/Flair.svelte";
  import InputField from "../ui/InputField.svelte";
  import LoadingButton from "../ui/LoadingButton.svelte";
  import RadioGroup from "../ui/RadioGroup.svelte";
  import SelectField from "../ui/SelectField.svelte";

  export let onNext: (u: User) => void;
  export let data: ProfileFormData;
  export let buttonText: string;
  let form: HTMLFormElement;
  const currentYear = new Date().getFullYear();
  let disabled = false;

  $: {
    if (!data.gendersToShow) {
      data.gendersToShow =
        data.genderToShow === "everyone"
          ? ["male", "female", "non-binary"]
          : [data.genderToShow];
    }
  }

  $: age =
    data.year && data.month && data.day
      ? getAge(
          new Date(
            parseInt(data.year),
            parseInt(data.month),
            parseInt(data.day)
          )
        )
      : null;

  $: {
    if (data.year && data.month && data.day) {
      const age = getAge(
        new Date(parseInt(data.year), parseInt(data.month), parseInt(data.day))
      );
      if (age < 18 && data.goal !== "friendship") {
        data.goal = "friendship";
      }
    }
  }
</script>

<style>
  .label {
    margin-bottom: 4px;
    font-size: calc(var(--vscode-font-size) * 0.9);
  }
  form > div {
    margin-bottom: 30px;
  }
  .row {
    display: flex;
  }
  .row > div {
    min-width: 40px;
  }
  span {
    width: 10px;
  }
  [type="checkbox"] {
    vertical-align: middle;
  }
</style>

<form
  bind:this={form}
  disabled
  on:submit={() => false}
  style="margin-top: 20px;">
  <div>
    <InputField
      required
      name="displayName"
      label="Name"
      bind:value={data.displayName} />
  </div>
  <div>
    <InputField
      required
      textArea
      name="bio"
      label="Bio {data.bio ? data.bio.length : 0}/150"
      bind:value={data.bio} />
  </div>
  <div>
    <SelectField
      bind:value={data.flair}
      name="flair"
      label="Flair:"
      options={flairOptions} />
    <Flair flair={data.flair} />
  </div>
  <div>
    <div class="label">
      Birthday (used to compute age:
      {getAge(new Date(parseInt(data.year), parseInt(data.month), parseInt(data.day)))})
    </div>
    <div class="row">
      <SelectField
        required
        bind:value={data.month}
        name="month"
        options={[{ value: '', label: 'Month' }, { value: '0', label: 'Jan' }, { value: '1', label: 'Feb' }, { value: '2', label: 'Mar' }, { value: '3', label: 'Apr' }, { value: '4', label: 'May' }, { value: '5', label: 'Jun' }, { value: '6', label: 'Jul' }, { value: '7', label: 'Aug' }, { value: '8', label: 'Sep' }, { value: '9', label: 'Oct' }, { value: '10', label: 'Nov' }, { value: '11', label: 'Dec' }]} />
      <span />
      <SelectField
        required
        bind:value={data.day}
        name="day"
        options={[{ value: '', label: 'Day' }, ...Array.from(
            Array(31),
            (_, i) => ({
              value: `${i + 1}`,
              label: `${i + 1}`,
            })
          )]} />
      <span />
      <SelectField
        required
        bind:value={data.year}
        name="year"
        options={[{ value: '', label: 'Year' }, ...Array.from(
            Array(120),
            (_, i) => ({
              label: `${currentYear - i}`,
              value: `${currentYear - i}`,
            })
          )]} />
    </div>
  </div>
  <div>
    <div class="label">I'm looking for:</div>
    <RadioGroup
      bind:value={data.goal}
      options={[{ label: age && age < 18 ? 'love 18+' : 'love', value: 'love' }, { label: 'friendship', value: 'friendship' }]} />
  </div>
  {#if data.goal === 'love'}
    <div>
      <div class="label">Gender:</div>
      <RadioGroup
        bind:value={data.gender}
        options={[{ label: 'male', value: 'male' }, { label: 'female', value: 'female' }, { label: 'non-binary', value: 'non-binary' }]} />
    </div>
    {#if data.gendersToShow}
      <div>
        <div class="label">Show me code from:</div>
        <CheckboxGroup
          bind:value={data.gendersToShow}
          options={[{ label: 'males', value: 'male' }, { label: 'females', value: 'female' }, { label: 'non-binary', value: 'non-binary' }]} />
      </div>
    {/if}
    <div>
      <div class="label">Age Range:</div>
      <div class="row">
        <div class="row">
          <InputField
            required
            type="number"
            min={18}
            max={150}
            name="minAgeRange"
            placeholder="18"
            bind:value={data.ageRangeMin} />
        </div>
        <span />
        <div class="row">
          <InputField
            required
            placeholder="24"
            type="number"
            min={18}
            max={150}
            name="maxAgeRange"
            bind:value={data.ageRangeMax} />
        </div>
      </div>
    </div>
  {/if}
  <div style="padding-top: 20px;">
    <LoadingButton
      on:click={async () => {
        if (!form.reportValidity()) {
          return;
        }
        disabled = true;
        try {
          const { year, month, day, ...values } = data;
          const { user } = await mutation('/user', { ...values, birthday: `${year}-${('0' + (parseInt(month) + 1)).slice(-2)}-${day.length === 1 ? '0' + day : day}` }, { method: 'PUT' });
          onNext(user);
        } catch {}
        disabled = false;
      }}
      type="button"
      {disabled}>
      {#if disabled}loading{:else}{buttonText}{/if}
    </LoadingButton>
  </div>
</form>
