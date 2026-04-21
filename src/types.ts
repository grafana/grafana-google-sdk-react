import { type DataSourceJsonData } from '@grafana/data';

export const GoogleAuthType = {
  JWT: 'jwt',
  GCE: 'gce',
  WIF: 'workloadIdentityFederation',
} as const;

export interface DataSourceOptions extends DataSourceJsonData {
  authenticationType: string;
  tokenUri?: string;
  clientEmail?: string;
  defaultProject?: string;
  privateKeyPath?: string;
  serviceAccountToImpersonate?: string;
  usingImpersonation?: boolean;
  workloadIdentityPoolProvider?: string;
  wifServiceAccountEmail?: string;
}

export interface DataSourceSecureJsonData {
  privateKey?: string;
}
