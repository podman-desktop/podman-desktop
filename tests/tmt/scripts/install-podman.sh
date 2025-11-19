# /**********************************************************************
#  Copyright (C) 2025 Red Hat, Inc.
#  
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  
#  http://www.apache.org/licenses/LICENSE-2.0
#  
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#  
#  SPDX-License-Identifier: Apache-2.0
#  ***********************************************************************/

#!/bin/bash
set -euo pipefail

# Uninstall a preinstalled Podman version to ensure the desired version will be installed.
sudo dnf remove -y podman

# Construct the download URL for the specific Podman version.
COMPOSE_VERSION="fc$(echo "$COMPOSE" | cut -d'-' -f2)"

# Install Podman based on the requested version:
# "nightly": latest nightly build from rhcontainerbot/podman-next COPR repository
if [[ "$PODMAN_VERSION" == "nightly" ]]; then
    sudo dnf copr enable -y rhcontainerbot/podman-next
    sudo dnf install -y podman --disablerepo=testing-farm-tag-repository 
    PODMAN_VERSION="$(dnf --quiet \
        --repofrompath=podman-next,https://download.copr.fedorainfracloud.org/results/rhcontainerbot/podman-next/fedora-$(rpm -E %fedora)/${ARCH}/ \
        list --showduplicates podman 2>/dev/null | grep dev | tail -n1 | cut -d':' -f2 | cut -d'-' -f1 )"
else
    # For "latest" or specific version, fetch version if needed and install from RPM
    if [[ "$PODMAN_VERSION" == "latest" ]]; then
        PODMAN_VERSION="$(curl -s https://api.github.com/repos/containers/podman/releases/latest | jq -r .tag_name | sed 's/^v//')"
    fi
    CUSTOM_PODMAN_URL="https://kojipkgs.fedoraproject.org//packages/podman/${PODMAN_VERSION}/1.${COMPOSE_VERSION}/${ARCH}/podman-${PODMAN_VERSION}-1.${COMPOSE_VERSION}.${ARCH}.rpm"
    curl -Lo podman.rpm "$CUSTOM_PODMAN_URL"
    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to download Podman RPM from $CUSTOM_PODMAN_URL"
        exit 1
    fi
    if [[ ! -s podman.rpm ]]; then
        echo "Error: Downloaded Podman RPM file is missing or empty."
        rm -f podman.rpm
        exit 1
    fi
    sudo dnf install -y ./podman.rpm
    rm -f podman.rpm
fi

# Verify that the installed Podman version matches the expected version. 
INSTALLED_PODMAN_VERSION="$(podman --version | cut -d' ' -f3)"
NORMALIZED_PODMAN_VERSION="${PODMAN_VERSION//\~/-}"

if [[ "$INSTALLED_PODMAN_VERSION" != "$NORMALIZED_PODMAN_VERSION" ]]; then
    echo "Podman version mismatch: expected $NORMALIZED_PODMAN_VERSION but got $INSTALLED_PODMAN_VERSION"
    exit 1
fi

echo "Podman installed successfully: $INSTALLED_PODMAN_VERSION"
