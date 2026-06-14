<script lang="ts">
import { type ExtensionCompatibilityIssue, mapCompatibilityIssuesToDetailsWarnings } from './extension-compatibility';
import ExtensionDetailsWarnings from './ExtensionDetailsWarnings.svelte';

interface Props {
  issues: ExtensionCompatibilityIssue[];
  /** banner = details page; compact-bar = installed list; icon = tooltip only */
  variant?: 'banner' | 'compact-bar' | 'icon';
  class?: string;
}

let { issues, variant = 'banner', class: className = '' }: Props = $props();

const warnings = $derived(mapCompatibilityIssuesToDetailsWarnings(issues));
</script>

<ExtensionDetailsWarnings warnings={warnings} {variant} class={className} />
