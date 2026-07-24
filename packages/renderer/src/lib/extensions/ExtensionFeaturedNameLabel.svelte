<script lang="ts">
import ExtensionNameIndicators from './ExtensionNameIndicators.svelte';

interface Props {
  displayName: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  nameClass?: string;
  class?: string;
}

let { displayName, isFeatured = false, isVerified = false, nameClass = '', class: className = '' }: Props = $props();
</script>

<span class="inline-flex min-w-0 max-w-full items-center gap-1 font-normal {className}">
  <span class="truncate {nameClass}">{displayName}</span>
  <ExtensionNameIndicators {isFeatured} {isVerified} />
</span>
