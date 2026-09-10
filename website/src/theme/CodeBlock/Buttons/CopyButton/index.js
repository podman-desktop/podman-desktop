/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { CodeBlockContextProvider, useCodeBlockContext } from '@docusaurus/theme-common/internal';
import CopyButton from '@theme-original/CodeBlock/Buttons/CopyButton';
import React from 'react';

import { stripPrompts } from './stripPrompts.js';

// Update the CopyButton to remove the '$ ' or '# ' from the code
export default function CopyButtonWrapper(props) {
  const { metadata, wordWrap } = useCodeBlockContext();
  const updatedMetadata = { ...metadata, code: stripPrompts(metadata.code) };

  return (
    <>
      <CodeBlockContextProvider metadata={updatedMetadata} wordWrap={wordWrap}>
        <CopyButton {...props} />
      </CodeBlockContextProvider>
    </>
  );
}
