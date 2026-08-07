import Link from '@docusaurus/Link';
import type { MouseEventHandler, ReactNode } from 'react';

type TelemetryLinkProps = {
  to: string;
  eventPath: string;
  eventTitle: string;
  className: string;
  children?: ReactNode[];
  mobile?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const sendGoatCounterEvent = (path: string, title: string): void => {
  window.goatcounter?.count({
    path: path,
    title: title,
    event: true,
  });
};

export const TelemetryLink = ({ children, mobile = false, onClick, ...props }: TelemetryLinkProps): JSX.Element => {
  const link = (
    <Link
      className={props.className}
      to={props.to}
      onClick={event => {
        sendGoatCounterEvent(props.eventPath, props.eventTitle);
        onClick?.(event);
      }}>
      {children}
    </Link>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
};
