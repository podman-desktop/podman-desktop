import type { PodInfoUI } from '/@/lib/pod/PodInfoUI';

export type TransientStatus = 'STARTING' | 'STOPPING' | 'RESTARTING' | 'DELETING' | 'ERROR';
export type PodInfoOverride = Partial<PodInfoUI & { status: TransientStatus }>;

export const podsInfoUiOverrides = $state<{ value: Record<string, PodInfoOverride> }>({ value: {} });
