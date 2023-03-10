import { DataSourceJsonData } from '@grafana/data';

export const GoogleAuthType = {
  JWT: 'jwt',
  GCE: 'gce',
} as const;

export interface DataSourceOptions extends DataSourceJsonData {
  authenticationType: string;
  tokenUri?: string;
  clientEmail?: string;
  defaultProject?: string;
  privateKeyPath?: string;
}

export interface DataSourceSecureJsonData {
  privateKey?: string;
}
