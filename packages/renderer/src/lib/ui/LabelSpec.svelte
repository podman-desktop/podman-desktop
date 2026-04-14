<script lang="ts">
import Label from './Label.svelte';

export let name = '';
export let tip = '';
export let slot = '';
export let role: string | undefined = undefined;
export let capitalize: boolean = false;
export let top: boolean | undefined = undefined;
export let bottom: boolean | undefined = undefined;
export let left: boolean | undefined = undefined;
export let right: boolean | undefined = undefined;
export let topLeft: boolean | undefined = undefined;
export let topRight: boolean | undefined = undefined;
export let bottomLeft: boolean | undefined = undefined;
export let bottomRight: boolean | undefined = undefined;
</script>

<Label tip={tip} role={role} name={name} capitalize={capitalize}
{top}
  {bottom}
  {left}
  {right}
  {topLeft}
  {topRight}
  {bottomLeft}
  {bottomRight}>{slot}</Label>
