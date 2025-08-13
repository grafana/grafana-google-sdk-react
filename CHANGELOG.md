# Change Log

All notable changes to this project will be documented in this file.

## v0.3.5

- Fix `getOptionsWithDefaults` function to call `onOptionsChange` to persist the default value

## v0.3.4

- Enable service account impersonation by default in `ConnectionConfig` component

## v0.3.3

- Add `showServiceAccountImpersonationConfig` prop to `AuthConfig` component

## v0.3.2

- Fix package.jon repository URL
- Fix build to emit CJS files

## v0.3.1

- Fix: do not mutate the options object

## v0.3.0

- Add service account impersonation support

## v0.2.0

- Update package bundling to emit ESM and CJS modules
- Raise minimum Grafana version to 10.4.0

## v0.1.2

- Fix config options disappearing.

## v0.1.1

- Move grafana dependencies to peerDependencies
- Remove GitHub package release

## v0.1.0

- Export AuthConfig.tsx that can be reused without the infobox
- JWTForm can now take private key path instead of private key // You need to handle it in the backend
- GoogleAuthType is now a const instead of enum type
- Bump grafana packages to 9.4.1

## v0.0.4

- Fix: make JWT file input accessible via keyboard

## v0.0.3

- Fix: preserve JWT details when switching auth type

## v0.0.2

- Fix reset button

## v0.0.1

- Initial Release
