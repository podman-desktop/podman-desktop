<script lang="ts">
import { faBell } from '@fortawesome/free-solid-svg-icons';

import DropDownMenuGroup from './DropDownMenuGroup.svelte';
import DropDownMenuItem from './DropDownMenuItem.svelte';
import DropDownMenuSeparator from './DropDownMenuSeparator.svelte';

interface Props {
  label?: string;
}

let { label }: Props = $props();
</script>

<DropDownMenuItem title="Before" icon={faBell} />
<DropDownMenuSeparator />
<DropDownMenuGroup label={label}>
  <DropDownMenuItem title="Child 1" icon={faBell} />
  <DropDownMenuItem title="Child 2" icon={faBell} />
</DropDownMenuGroup>
