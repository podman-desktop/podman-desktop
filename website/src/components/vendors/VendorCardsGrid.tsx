import React, { useEffect, useState } from 'react';

import { AddVendorCard } from './AddVendorCard';
import { useMediaQuery } from './useMediaQuery';
import { VendorCard } from './VendorCard';
import type { VendorCardProps } from './vendorData';

const SMALL_SCREEN_QUERY = '(max-width: 767px)';
const SMALL_SCREEN_VISIBLE_COUNT = 3;

const DEFAULT_GRID_STYLE: React.CSSProperties = {
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 22rem))',
  justifyContent: 'start',
};

interface VendorCardsGridProps {
  readonly vendors: VendorCardProps[];
  readonly gridStyle?: React.CSSProperties;
  readonly gapClassName?: string;
  /** Prefer a wide primary vendor + add-vendor panel (meeting default). */
  readonly preferSingleVendorLayout?: boolean;
}

export function VendorCardsGrid({
  vendors,
  gridStyle = DEFAULT_GRID_STYLE,
  gapClassName = 'gap-6',
  preferSingleVendorLayout = true,
}: VendorCardsGridProps): JSX.Element {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isSmallScreen) {
      setExpanded(false);
    }
  }, [isSmallScreen]);

  const shouldCollapse = isSmallScreen && vendors.length > SMALL_SCREEN_VISIBLE_COUNT && !expanded;
  const visibleVendors = shouldCollapse ? vendors.slice(0, SMALL_SCREEN_VISIBLE_COUNT) : vendors;
  const showViewAll = isSmallScreen && vendors.length > SMALL_SCREEN_VISIBLE_COUNT && !expanded;
  const useSingleLayout = preferSingleVendorLayout && vendors.length === 1;

  // On small screens, force a full-width single column (desktop keeps the 22rem card cap).
  const resolvedGridStyle: React.CSSProperties = isSmallScreen
    ? { gridTemplateColumns: '1fr', justifyContent: 'stretch' }
    : gridStyle;

  // Side-by-side on wide screens: primary vendor ~2/3 + add-vendor panel.
  // Use a plain CSS class (not Tailwind lg:grid-cols-*) so production important:true
  // does not pin the layout to a single column.
  if (useSingleLayout) {
    return (
      <div className="pd-single-vendor-layout">
        <div className="pd-single-vendor-layout__primary">
          <VendorCard {...vendors[0]} />
        </div>
        <AddVendorCard />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={`grid ${gapClassName} w-full`} style={resolvedGridStyle}>
        {visibleVendors.map(vendor => (
          <VendorCard key={vendor.name} {...vendor} />
        ))}
        <AddVendorCard />
      </div>

      {showViewAll && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="px-5 py-2.5 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-colors duration-200">
            View all vendors
          </button>
        </div>
      )}
    </div>
  );
}
