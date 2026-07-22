<script lang="ts">
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';

import NavItem from './NavItem.svelte';

let meta: TinroRouteMeta = { url: '/test' } as TinroRouteMeta;

// define context so that item thinks we're in a section
setContext('nav-items', writable(0));
</script>

<NavItem tooltip="Dashboard" href="/test" {meta}></NavItem>
