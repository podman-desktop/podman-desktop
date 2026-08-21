import React from 'react';

import { usePrototypeScope } from '../PrototypeScope/context';
import { VendorCardsGrid } from './VendorCardsGrid';
import { getVendors } from './vendorData';

export function SupportedVendorsSection(): JSX.Element {
  const { vendorViewMode } = usePrototypeScope();
  const vendors = getVendors(vendorViewMode);

  return (
    <section className="text-charcoal-300 dark:text-white body-font py-24 bg-white dark:bg-black bg-gradient-to-tr from-purple-200/60 dark:from-purple-900/40 to-transparent">
      <div className="container mx-auto flex flex-col px-5">
        <h2 className="text-4xl/[1.5] font-bold mb-4 text-charcoal-300 dark:text-white">Enterprise support</h2>
        <p className="text-base md:text-lg text-charcoal-300 dark:text-gray-300 mb-10 w-full">
          Need enterprise-grade support for production? Explore commercial support options with long-term maintenance
          for Podman Desktop.
        </p>

        <VendorCardsGrid vendors={vendors} />
      </div>
    </section>
  );
}
