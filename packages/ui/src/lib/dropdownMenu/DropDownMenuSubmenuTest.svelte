<script lang="ts">
import { faBell, faRocket } from '@fortawesome/free-solid-svg-icons';

import DropdownMenu from './DropdownMenu.svelte';
import DropDownMenuItem from './DropDownMenuItem.svelte';
import DropDownMenuSubmenu from './DropDownMenuSubmenu.svelte';

interface Props {
  enabled?: boolean;
  onClick: () => void;
}

let { enabled = true, onClick }: Props = $props();
</script>

<DropdownMenu>
  <DropDownMenuSubmenu title="Submenu" icon={faRocket} enabled={enabled}>
    <DropDownMenuItem title="Child 1" icon={faBell} onClick={onClick} />
    <DropDownMenuItem title="Child 2" icon={faBell} onClick={onClick} />
  </DropDownMenuSubmenu>
</DropdownMenu>
