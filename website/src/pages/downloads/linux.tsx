import { Redirect } from '@docusaurus/router';
import React from 'react';

export default function LinuxDownloads(): JSX.Element {
  return <Redirect to="/downloads?os=linux" />;
}
