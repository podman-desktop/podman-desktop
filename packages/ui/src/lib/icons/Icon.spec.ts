/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import '@testing-library/jest-dom/vitest';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import { ContainerIcon } from '.';
import Icon from './Icon.svelte';

describe('font awesome', () => {
  test('basic icon should be created', () => {
    render(Icon, { icon: faGithub });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).not.toHaveAttribute('style');
  });

  test('icon should reflect prefered {number}x size', () => {
    render(Icon, { icon: faGithub, size: '2x' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('style', expect.stringContaining('font-size: 2em;'));
  });

  test('icon should reflect prefered sm size', () => {
    render(Icon, { icon: faGithub, size: 'sm' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('svelte-fa-size-sm');
  });

  test('icon should have class', () => {
    render(Icon, { icon: faGithub, class: 'some-class' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('some-class');
  });

  test('icon should have color defined by parent', () => {
    render(Icon, { icon: faGithub });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    const path = img.querySelector('path');
    expect(path).toHaveAttribute('fill', 'currentColor');
  });

  test('icon should have title', () => {
    const { getByTitle } = render(Icon, { icon: faGithub, title: 'test title' });

    const img = getByTitle('test title');
    expect(img).toBeInTheDocument();
  });
});

describe('class icon', () => {
  test('basic icon should be created', () => {
    render(Icon, { icon: 'fas fa-icon' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('fas fa-icon');
    expect(img.nodeName).toBe('SPAN');
  });

  test('icon should reflect prefered fa-{number}x size', () => {
    render(Icon, { icon: 'fas fa-icon', size: 'fa-2x' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('fas fa-icon');
    expect(img).toHaveClass('fa-2x');
  });

  test('icon should have class', () => {
    render(Icon, { icon: 'fas fa-icon', class: 'some-class' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('fas fa-icon');
    expect(img).toHaveClass('some-class');
  });

  test('icon should have title', () => {
    const { getByTitle } = render(Icon, { icon: 'fas fa-icon', title: 'test title' });

    const img = getByTitle('test title');
    expect(img).toBeInTheDocument();
  });

  test('brand icon should be created', () => {
    render(Icon, { icon: 'fab fa-discord' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('fab fa-discord');
  });
});

describe('component icon', () => {
  test('basic icon should be created', () => {
    render(Icon, { icon: ContainerIcon });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
  });

  test('icon should reflect prefered {number} size', () => {
    render(Icon, { icon: ContainerIcon, size: '42' });

    const img = screen.getByRole('img', { hidden: true });
    const imgComponent = img.firstChild;
    expect(imgComponent).toBeInTheDocument();
    expect(imgComponent).toHaveAttribute('width', '42');
    expect(imgComponent).toHaveAttribute('height', '42');
  });

  test('icon should have class', () => {
    render(Icon, { icon: ContainerIcon, class: 'some-class' });

    const img = screen.getByRole('img', { hidden: true });
    const imgComponent = img.firstChild;
    expect(imgComponent).toBeInTheDocument();
    expect(imgComponent).toHaveClass('some-class');
  });

  test('icon should have title', () => {
    const { getByTitle } = render(Icon, { icon: ContainerIcon, title: 'test title' });

    const img = getByTitle('test title');
    expect(img).toBeInTheDocument();
  });
});

describe('string icon', () => {
  test('basic icon should be created', () => {
    const icon = 'data:image/png;base64,fooBar';
    render(Icon, { icon: icon });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', icon);
  });

  test('icon should reflect prefered {number} size', () => {
    const icon = 'data:image/png;base64,fooBar';
    render(Icon, { icon: icon, size: 42 });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toHaveAttribute('style', 'width: 42px; height: 42px;');
    expect(img).toHaveAttribute('src', icon);
  });

  test('icon should have class', () => {
    const icon = 'data:image/png;base64,fooBar';
    render(Icon, { icon: icon, class: 'some-class' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('some-class');
    expect(img).toHaveAttribute('src', icon);
  });

  test('icon should have title', () => {
    const icon = 'data:image/png;base64,fooBar';
    render(Icon, { icon: icon, title: 'test title' });

    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'test title');
    expect(img).toHaveAttribute('src', icon);
  });
});
