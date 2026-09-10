<script lang="ts">
import Label from './Label.svelte';

interface Props {
  name?: string;
  tip?: string;
  slot?: string;
  role?: string;
  capitalize?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
}
let {
  name = '',
  tip = '',
  slot = '',
  role = undefined,
  capitalize = false,
  top = undefined,
  bottom = undefined,
  left = undefined,
  right = undefined,
  topLeft = undefined,
  topRight = undefined,
  bottomLeft = undefined,
  bottomRight = undefined,
}: Props = $props();
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
