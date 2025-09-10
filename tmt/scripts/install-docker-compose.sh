#!/bin/bash
set -e
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)
curl -Lo ./docker-compose https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64
chmod +x ./docker-compose
sudo mv ./docker-compose /usr/local/bin/docker-compose
