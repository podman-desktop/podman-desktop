import useBaseUrl from '@docusaurus/useBaseUrl';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemedImage from '@theme/ThemedImage';
import React from 'react';

import GradientButton from './GradientButton';

type VendorCardProps = {
  name: string;
  description: string;
  logo: string;
  logoDark?: string;
  learnMore?: string;
  addClass?: string;
};

export const VendorCard = (props: Readonly<VendorCardProps>): JSX.Element => {
  const logoAlt = `${props.name} logo`;
  const divClass = `p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col bg-white/60 dark:bg-charcoal-800/60 items-start ${props.addClass}`;

  return (
    <div className={divClass}>
      <ThemedImage
        className="mb-4 h-12 w-fit"
        alt={logoAlt}
        sources={{
          light: useBaseUrl(props.logo),
          dark: useBaseUrl(props.logoDark ?? props.logo),
        }}
      />
      <p className="text-charcoal-300 dark:text-gray-400 mb-4 flex-grow">{props.description}</p>
      <div className="mt-auto">
        {props.learnMore && (
          <GradientButton href={props.learnMore} className="vendor-card-cta">
            Learn more
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
          </GradientButton>
        )}
      </div>
    </div>
  );
};
