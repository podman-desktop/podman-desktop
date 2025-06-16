import Link from '@docusaurus/Link';
import React from 'react';

interface GradientButtonProps {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly solid?: boolean;
}

// Creates a gradient button that can either be "solid" or "outlined" with a gradient border.
export default function GradientButton({
  href,
  children,
  className = '',
  solid = false,
}: GradientButtonProps): JSX.Element {
  const outerClasses = solid
    ? 'w-fit z-10 relative'
    : 'p-[2px] rounded border-gradient bg-gradient-to-r from-sky-500 to-purple-500 w-fit z-10 relative';

  const innerClasses =
    'inline-block p-3 rounded font-semibold text-base transition-colors duration-200 ' +
    (solid
      ? 'bg-gradient-to-r from-sky-600 to-purple-600 text-white hover:opacity-90'
      : 'bg-white dark:bg-charcoal-800 text-charcoal-300 dark:text-white hover:bg-purple-600 hover:text-white') +
    ' ' +
    className;

  return (
    <div className={outerClasses}>
      <Link to={href} className={innerClasses}>
        {children}
      </Link>
    </div>
  );
}
