import { type DataSourceJsonData } from "@grafana/data";

export const GoogleAuthType = {
  JWT: "jwt",
  GCE: "gce",
} as const;

export interface DataSourceOptions extends DataSourceJsonData {
  authenticationType: string;
  tokenUri?: string;
  clientEmail?: string;
  defaultProject?: string;
  privateKeyPath?: string;
  serviceAccountToImpersonate?: string;
  usingImpersonation?: boolean;
}

export interface DataSourceSecureJsonData {
  privateKey?: string;
}
