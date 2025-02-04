import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import { TelemetryLink } from '@site/src/components/TelemetryLink';

export default {
  ...ComponentTypes,
  'custom-telemetryLink': props => (
    <TelemetryLink {...props} className="navbar__item navbar__link">
      Downloads
    </TelemetryLink>
  ),
};
