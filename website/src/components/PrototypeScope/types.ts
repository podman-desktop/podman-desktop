export type PrototypeScope = 'home' | 'downloads';

export type VendorViewMode = 'single' | 'few' | 'many';

export const PROTOTYPE_SCOPE_BAR_HEIGHT = 40;

export const PROTOTYPE_SCOPE_STORAGE_KEY = 'enterprise-support-prototype-scope';
export const VENDOR_VIEW_STORAGE_KEY = 'enterprise-support-vendor-view';

export const SCOPE_PATHS: Record<PrototypeScope, string> = {
  home: '/',
  downloads: '/downloads',
};
