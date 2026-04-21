import { TEST_IDS } from './testIds';
import { GoogleAuthType } from './types';

export const GOOGLE_AUTH_TYPE_OPTIONS = [
  {
    label: 'Google JWT File',
    value: GoogleAuthType.JWT,
    ariaLabel: TEST_IDS.authTypeButtonJWT,
  },
  {
    label: 'GCE Default Service Account',
    value: GoogleAuthType.GCE,
    ariaLabel: TEST_IDS.authTypeButtonGCE,
  },
];

export const WIF_AUTH_TYPE_OPTION = {
  label: 'Workload Identity Federation',
  value: GoogleAuthType.WIF,
  ariaLabel: TEST_IDS.authTypeButtonWIF,
};
