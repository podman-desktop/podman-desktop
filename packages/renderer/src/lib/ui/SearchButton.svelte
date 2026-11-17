<script lang="ts">
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';

import { t } from '/@/lib/i18n/translations.svelte';

interface Props {
  onclick?: () => void;
}

let { onclick = (): void => {} }: Props = $props();
</script>

<button id="Search button" title={t('common.search') ?? 'Search'} class="text-[color:var(--pd-global-nav-icon)] flex justify-center items-center gap-1" style="-webkit-app-region: none;" {onclick}>
    <Icon icon={faMagnifyingGlass} />{t('common.search') ?? 'Search'}
</button>
