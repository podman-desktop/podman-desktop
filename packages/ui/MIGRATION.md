# @podman-desktop/ui-svelte

## Version 1.19

- ([#12559](https://github.com/podman-desktop/podman-desktop/pull/12559)) The `breadcrumbTitle` property has been removed from the `Page`, `FormPage`, and `DetailsPage` components. You can safely remove this `breadcrumbTitle` property from the calls to these components, as its value was not used.
- ([#12555](https://github.com/podman-desktop/podman-desktop/pull/12555)) The `NavPage` component now uses `snippet`s instead of `slot`s. You can have a look at [this blog post](https://sveltekit.io/blog/snippets) to learn more about `slot` to `snippet` migration.
- ([#12561](https://github.com/podman-desktop/podman-desktop/pull/12561)) The `Page` component now uses `snippet`s instead of `slot`s. You can have a look at [this blog post](https://sveltekit.io/blog/snippets) to learn more about `slot` to `snippet` migration.
