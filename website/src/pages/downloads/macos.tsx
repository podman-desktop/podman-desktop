import { Redirect } from '@docusaurus/router';
import React from 'react';

export default function MacOSDownloads(): JSX.Element {
  return <Redirect to="/downloads?os=macos" />;
}
