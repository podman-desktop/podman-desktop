import { Redirect } from '@docusaurus/router';
import React from 'react';

export default function WindowsDownloads(): JSX.Element {
  return <Redirect to="/downloads?os=windows" />;
}
