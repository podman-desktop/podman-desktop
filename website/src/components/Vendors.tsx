import { AddVendorCard } from '@site/src/components/AddVendorCard';
import { VendorCard } from '@site/src/components/VendorCard';
import React from 'react';

export function VendorCards(): JSX.Element {
  return (
    <section className="text-charcoal-300 dark:text-white body-font py-24 bg-white dark:bg-black bg-gradient-to-tr from-purple-200/60 dark:from-purple-900/40 to-transparent">
      <div className="container mx-auto flex flex-col px-5">
        <h2 className="text-4xl/[1.5] font-bold mb-4 text-charcoal-300 dark:text-white">Enterprise support</h2>
        <p className="text-base md:text-lg text-charcoal-300 dark:text-gray-300 mb-10 w-full">
          Need enterprise-grade support for production? Explore commercial support options with long-term maintenance
          for Podman Desktop.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <VendorCard
            name="Red Hat"
            description="Red Hat offers the Red Hat Build of Podman Desktop with enterprise support, long-term maintenance, and production-ready builds."
            logo="/img/redhat-logo.svg"
            learnMore="https://red.ht/redhatbuildofpodmandesktop"
            addClass="lg:col-span-2"
          />
          <AddVendorCard />
        </div>
      </div>
    </section>
  );
}
