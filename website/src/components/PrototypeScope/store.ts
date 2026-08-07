import {
  PROTOTYPE_SCOPE_STORAGE_KEY,
  type PrototypeScope,
  SCOPE_PATHS,
  VENDOR_VIEW_STORAGE_KEY,
  type VendorViewMode,
} from './types';

type Listener = () => void;

export interface PrototypeScopeSnapshot {
  scope: PrototypeScope;
  vendorViewMode: VendorViewMode;
}

function scopeFromPathname(pathname: string): PrototypeScope | undefined {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/downloads')) return 'downloads';
  return undefined;
}

function readScope(): PrototypeScope {
  if (typeof window === 'undefined') return 'home';
  const fromPath = scopeFromPathname(window.location.pathname);
  if (fromPath) return fromPath;
  const stored = window.localStorage.getItem(PROTOTYPE_SCOPE_STORAGE_KEY);
  return stored === 'home' || stored === 'downloads' ? stored : 'home';
}

function readVendorView(): VendorViewMode {
  if (typeof window === 'undefined') return 'single';
  const stored = window.localStorage.getItem(VENDOR_VIEW_STORAGE_KEY);
  return stored === 'single' || stored === 'few' || stored === 'many' ? stored : 'single';
}

let snapshot: PrototypeScopeSnapshot = {
  scope: 'home',
  vendorViewMode: 'single',
};
let hydrated = false;
const listeners = new Set<Listener>();
const serverSnapshot: PrototypeScopeSnapshot = {
  scope: 'home',
  vendorViewMode: 'single',
};

function emit(): void {
  listeners.forEach(listener => listener());
}

function applyBodyClass(next: PrototypeScope): void {
  if (typeof document === 'undefined') return;
  document.body.classList.remove('prototype-scope-home', 'prototype-scope-downloads', 'prototype-scope-get-started');
  document.body.classList.add(next === 'home' ? 'prototype-scope-home' : 'prototype-scope-downloads');
}

function ensureHydrated(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  snapshot = {
    scope: readScope(),
    vendorViewMode: readVendorView(),
  };
  applyBodyClass(snapshot.scope);
}

export const prototypeScopeStore = {
  subscribe(listener: Listener): () => void {
    ensureHydrated();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): PrototypeScopeSnapshot {
    ensureHydrated();
    return snapshot;
  },
  getServerSnapshot(): PrototypeScopeSnapshot {
    return serverSnapshot;
  },
  setScope(next: PrototypeScope): void {
    ensureHydrated();
    if (snapshot.scope !== next) {
      snapshot = { ...snapshot, scope: next };
      window.localStorage.setItem(PROTOTYPE_SCOPE_STORAGE_KEY, next);
      applyBodyClass(next);
      emit();
    }
    const target = SCOPE_PATHS[next];
    if (window.location.pathname !== target) {
      window.location.assign(target);
    }
  },
  setVendorViewMode(mode: VendorViewMode): void {
    ensureHydrated();
    if (snapshot.vendorViewMode === mode) return;
    snapshot = { ...snapshot, vendorViewMode: mode };
    window.localStorage.setItem(VENDOR_VIEW_STORAGE_KEY, mode);
    emit();
  },
  syncFromLocation(): void {
    ensureHydrated();
    const fromPath = scopeFromPathname(window.location.pathname);
    if (fromPath && fromPath !== snapshot.scope) {
      snapshot = { ...snapshot, scope: fromPath };
      window.localStorage.setItem(PROTOTYPE_SCOPE_STORAGE_KEY, fromPath);
      applyBodyClass(fromPath);
      emit();
    }
  },
};
