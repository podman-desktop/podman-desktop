import React, { useEffect, useRef } from 'react';

import { usePrototypeScope } from './context';
import type { PrototypeScope, VendorViewMode } from './types';

const SCOPES: { id: PrototypeScope; label: string }[] = [
  { id: 'home', label: 'Vendors in the home page' },
  { id: 'downloads', label: 'Downloads page redesign' },
];

const VENDOR_MODES: { id: VendorViewMode; label: string }[] = [
  { id: 'single', label: '1 vendor' },
  { id: 'few', label: '3 vendors' },
  { id: 'many', label: 'Many vendors' },
];

export function PrototypeScopeBar(): JSX.Element {
  const { scope, setScope, vendorViewMode, setVendorViewMode } = usePrototypeScope();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect((): (() => void) | undefined => {
    const el = barRef.current;
    if (!el) return undefined;

    const syncHeight = (): void => {
      document.documentElement.style.setProperty('--prototype-scope-bar-height', `${el.offsetHeight}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return (): void => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--prototype-scope-bar-height');
    };
  }, []);

  return (
    <div ref={barRef} className="prototype-scope-bar" role="region" aria-label="Prototype scope">
      <div className="prototype-scope-bar__inner">
        <div className="prototype-scope-bar__group">
          <span className="prototype-scope-bar__label">Prototype scope</span>
          <div className="prototype-scope-bar__toggle" role="group" aria-label="Prototype scope options">
            {SCOPES.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScope(option.id)}
                className={
                  scope === option.id
                    ? 'prototype-scope-bar__btn prototype-scope-bar__btn--active'
                    : 'prototype-scope-bar__btn'
                }
                aria-pressed={scope === option.id}>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {scope === 'home' && (
          <div className="prototype-scope-bar__group">
            <span className="prototype-scope-bar__label">Vendors</span>
            <div className="prototype-scope-bar__toggle" role="group" aria-label="Vendor count options">
              {VENDOR_MODES.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setVendorViewMode(option.id)}
                  className={
                    vendorViewMode === option.id
                      ? 'prototype-scope-bar__btn prototype-scope-bar__btn--active'
                      : 'prototype-scope-bar__btn'
                  }
                  aria-pressed={vendorViewMode === option.id}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
