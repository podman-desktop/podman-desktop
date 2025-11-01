#!/bin/bash

# wrapper script allowing to set env vars before launching the application

# https://github.com/podman-desktop/podman-desktop/issues/14387
export XDG_SESSION_TYPE=x11

# run the app
exec "./podman-desktop" "$@"
