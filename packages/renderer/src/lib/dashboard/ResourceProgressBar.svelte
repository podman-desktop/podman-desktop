<script lang="ts">
interface Props {
  label: string;
  percent: number;
  value: string;
  warningThreshold?: number;
}

let { label, percent, value, warningThreshold = 80 }: Props = $props();

let isWarning = $derived(percent > warningThreshold);
</script>

<div class="flex flex-col gap-1">
    <div class="flex items-baseline justify-between mb-1">
        <span class="text-xs text-[var(--pd-content-card-text)]">{label}</span>
        <span 
            class="text-sm font-medium"
            class:text-[var(--pd-content-card-text)]={!isWarning}
            class:text-[var(--pd-state-warning)]={isWarning}
        >
            {Math.round(percent)}%
        </span>
    </div>
    <div class="w-full h-1.5 bg-[var(--pd-progressBar-bg)] overflow-hidden rounded-full progress-bar">
        <div 
            class="h-full transition-all duration-300"
            class:bg-[var(--pd-progressBar-in-progress-bg)]={!isWarning}
            class:bg-[var(--pd-state-warning)]={isWarning}
            style="width: {percent}%"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="{label} usage"
        ></div>
    </div>
    <span class="text-[10px] text-[var(--pd-content-text-sub)] mt-0.5">{value}</span>
</div>
