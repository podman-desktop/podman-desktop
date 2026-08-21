import { faArrowUpRightFromSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import GradientButton from '../GradientButton';

const DISCUSSION_URL = 'https://github.com/podman-desktop/podman-desktop/discussions';

export function AddVendorCard(): JSX.Element {
  return (
    <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col h-full bg-white/40 dark:bg-charcoal-800/40">
      <div className="mb-4 flex items-center" style={{ height: '48px' }}>
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
        </div>
      </div>
      <p className="text-charcoal-300 dark:text-gray-400 mb-4 flex-grow">
        If you are a vendor for Podman Desktop and would like to be added to the website, please open a GitHub
        Discussion to be added.
      </p>
      <div className="mt-auto">
        <GradientButton href={DISCUSSION_URL} external className="vendor-card-cta">
          Open a discussion
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
        </GradientButton>
      </div>
    </div>
  );
}
