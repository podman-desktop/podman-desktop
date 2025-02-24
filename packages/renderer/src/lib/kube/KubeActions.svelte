<script lang="ts">
import KubeApplyYamlButton from '/@/lib/kube/KubeApplyYAMLButton.svelte';

interface Props {
  disabled?: boolean;
}

let { disabled = false }: Props = $props();
</script>

<KubeApplyYamlButton {disabled}/>
