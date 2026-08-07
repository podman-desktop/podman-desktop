import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';

export type ClientOs = 'Windows' | 'macOS' | 'Linux';
export type PlatformId = 'windows' | 'macos' | 'linux';

export interface ClientPlatform {
  os: ClientOs;
  id: PlatformId;
  icon: IconProp;
}

export const ALL_PLATFORMS: ClientPlatform[] = [
  { os: 'Windows', id: 'windows', icon: faWindows },
  { os: 'macOS', id: 'macos', icon: faApple },
  { os: 'Linux', id: 'linux', icon: faLinux },
];

export function getClientPlatform(): ClientPlatform | null {
  if (typeof navigator === 'undefined') return null;

  const ua = navigator.userAgent;
  if (ua.includes('Windows')) {
    return { os: 'Windows', id: 'windows', icon: faWindows };
  }
  if (ua.includes('Mac')) {
    return { os: 'macOS', id: 'macos', icon: faApple };
  }
  if (ua.includes('Linux')) {
    return { os: 'Linux', id: 'linux', icon: faLinux };
  }
  return null;
}

export function getPlatformById(id: string | null | undefined): ClientPlatform | null {
  if (!id) return null;
  const normalized = id.toLowerCase();
  return ALL_PLATFORMS.find(platform => platform.id === normalized) ?? null;
}

/** Read `?os=macos|windows|linux` from a location search string. */
export function getPlatformFromSearch(search: string): ClientPlatform | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return getPlatformById(params.get('os'));
}
