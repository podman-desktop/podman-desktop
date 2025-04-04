<script lang="ts">
import { faArrowDown, faArrowUp, faMessage } from '@fortawesome/free-solid-svg-icons';
import Fa from 'svelte-fa';

import type { GithubDiscussionsData } from '../../../../main/src/plugin/github/github-discussions-data';

interface Props {
  reactions: GithubDiscussionsData;
}

let { reactions }: Props = $props();
</script>

<div class="flex flex-row gap-x-4">
  <!-- +1 reaction -->
  {#if reactions.reactions['+1']}
    <div class="flex flex-row items-center gap-x-1">
      <Fa icon={faArrowUp}/>
      {reactions.reactions['+1']}
    </div>
  {/if}
  <!-- number of comments -->
  {#if reactions.comments}
    <div class="flex flex-row items-center gap-x-1">
      <Fa icon={faMessage}/>
      {reactions.comments}
    </div>
  {/if}

  <!-- -1 reaction -->
  {#if reactions.reactions['-1']}
    <div class="flex flex-row items-center gap-x-1">
      <Fa icon={faArrowDown}/>
      {reactions.reactions['-1']}
    </div>
  {/if}
</div>

