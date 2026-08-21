import React, { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

import { prototypeScopeStore } from './store';
import type { PrototypeScope, VendorViewMode } from './types';

export function usePrototypeScope(): {
  scope: PrototypeScope;
  setScope: (scope: PrototypeScope) => void;
  vendorViewMode: VendorViewMode;
  setVendorViewMode: (mode: VendorViewMode) => void;
} {
  const snapshot = useSyncExternalStore(
    prototypeScopeStore.subscribe,
    prototypeScopeStore.getSnapshot,
    prototypeScopeStore.getServerSnapshot,
  );

  useEffect(() => {
    prototypeScopeStore.syncFromLocation();
  }, []);

  const setScope = useCallback((next: PrototypeScope) => {
    prototypeScopeStore.setScope(next);
  }, []);

  const setVendorViewMode = useCallback((mode: VendorViewMode) => {
    prototypeScopeStore.setVendorViewMode(mode);
  }, []);

  return useMemo(
    () => ({
      scope: snapshot.scope,
      setScope,
      vendorViewMode: snapshot.vendorViewMode,
      setVendorViewMode,
    }),
    [snapshot.scope, snapshot.vendorViewMode, setScope, setVendorViewMode],
  );
}

/** Kept for Root mounting — no React context required anymore. */
export function PrototypeScopeProvider({ children }: { readonly children: React.ReactNode }): JSX.Element {
  usePrototypeScope();
  return <>{children}</>;
}
