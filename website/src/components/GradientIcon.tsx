import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

interface GradientIconProps {
  readonly icon: IconDefinition;
  readonly size?: number;
  readonly className?: string;
}

// By default we cannot "gradient" the icons because they are not SVGs, so we use a workaround
export default function GradientIcon({ icon, size = 12, className = '' }: Readonly<GradientIconProps>): JSX.Element {
  return (
    <div
      className={`inline-block bg-gradient-to-r from-sky-600 to-purple-600 ${className}`}
      style={{
        WebkitMaskImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(renderToSvg(icon))}')`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',
        width: `${size * 0.25}rem`,
        height: `${size * 0.25}rem`,
      }}
    />
  );
}

// The absolute minimal SVG renderer for solid icons, in order for us to "gradient" them.
function renderToSvg(icon: IconDefinition): string {
  const [width, height, , , pathData] = icon.icon;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <path fill="black" d="${pathData}" />
    </svg>
  `;
}
