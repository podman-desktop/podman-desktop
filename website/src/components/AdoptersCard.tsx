import ThemedImage from '@theme/ThemedImage';
import React from 'react';

interface AdoptersCardProps {
  readonly logo: string;
  readonly logoDark?: string; // Optional dark mode logo
  readonly alt: string;
  readonly url: string;
  readonly width: string;
  readonly height: string;
}

function AdoptersCard({ logo, logoDark, alt, url, width, height }: AdoptersCardProps): JSX.Element {
  return (
    <div className="flex items-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
        style={{ width, height }}>
        <ThemedImage
          alt={alt}
          sources={{
            light: logo,
            dark: logoDark ?? logo,
          }}
          style={{ width: '100%', height: '100%', opacity: 1 }}
          className="object-contain"
        />
      </a>
    </div>
  );
}
export default AdoptersCard;
