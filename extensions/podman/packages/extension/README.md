# Podman extension

This extension handles:

- monitor the podman machines on Linux, macOS and Windows
- creation of podman machines on macOS and Windows
- connect to the podman socket so you can see the containers, images, volumes, etc. from podman

## SSH server identity

Remote SSH tunnels and Podman machine shells require explicit approval of a new
server's SHA256 host-key fingerprint. Compare the displayed fingerprint with one
obtained from the server administrator through a trusted channel before choosing
**Trust and Save**. Cancelling or dismissing the prompt refuses the connection.

Approved fingerprints are stored per hostname and port in `ssh-host-keys` under
the Podman extension's storage directory, separately from OpenSSH `known_hosts`.
Subsequent connections must present the same key; changed keys are rejected
without offering to replace the pin. If a server key legitimately changes or a
machine is recreated, independently verify the new fingerprint before removing
the pin file identified in the error and reconnecting. A rejected remote tunnel
does not automatically retry; disable and re-enable remote connections to retry.

The SSH handshake timeout is paused while host-key verification awaits approval
and resumes afterward. Saved pins are published atomically without overwriting
existing keys; simultaneous approvals of an identical key are accepted.
