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

DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)
if [ -z "$DOCKER_COMPOSE_VERSION" ]; then
  echo "Failed to fetch Docker Compose version"
  exit 1
fi
curl -Lo ./docker-compose https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64
chmod +x ./docker-compose
sudo mv ./docker-compose /usr/local/bin/docker-compose
