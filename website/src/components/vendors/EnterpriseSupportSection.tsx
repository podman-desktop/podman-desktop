import React from 'react';

import { VendorCardsGrid } from './VendorCardsGrid';
import type { VendorCardProps } from './vendorData';

interface EnterpriseSupportSectionProps {
  readonly vendors: VendorCardProps[];
  readonly gridStyle?: React.CSSProperties;
  readonly title?: string;
}

export function EnterpriseSupportSection({
  vendors,
  gridStyle,
  title = 'Enterprise Support',
}: EnterpriseSupportSectionProps): JSX.Element {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <div className="border-b-2 border-purple-500 w-16 mb-8" />

      <VendorCardsGrid vendors={vendors} gridStyle={gridStyle} gapClassName="gap-4" />
    </>
  );
}
