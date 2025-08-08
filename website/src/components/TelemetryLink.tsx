import Link from '@docusaurus/Link';
import type { ReactNode } from 'react';

type TelemetryLinkProps = {
  to: string;
  eventPath: string;
  eventTitle: string;
  className: string;
  children?: ReactNode[];
  mobile?: boolean;
};

const sendGoatCounterEvent = (path: string, title: string): void => {
  window.goatcounter?.count({
    path: path,
    title: title,
    event: true,
  });
};

export const TelemetryLink = ({ children, mobile = false, ...props }: TelemetryLinkProps): JSX.Element => {
  const link = (
    <Link
      className={props.className}
      to={props.to}
      onClick={() => sendGoatCounterEvent(props.eventPath, props.eventTitle)}>
      {children}
    </Link>
  );
  /**check for mobile menu */
  return mobile ? <li className="menu__list-item">{link}</li> : link;
};
