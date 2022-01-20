import { DataSourceJsonData } from '@grafana/data';

export enum GoogleAuthType {
  JWT = 'jwt',
  GCE = 'gce',
}

export interface DataSourceOptions extends DataSourceJsonData {
  authenticationType: GoogleAuthType;
  tokenUri?: string;
  clientEmail?: string;
  defaultProject?: string;
}

export interface DataSourceSecureJsonData {
  privateKey?: string;
}
