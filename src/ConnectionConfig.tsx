import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { Alert } from '@grafana/ui';
import React from 'react';
import { AuthConfig } from './components/AuthConfig';
import { GOOGLE_AUTH_TYPE_OPTIONS } from './constants';
import { TEST_IDS } from './testIds';
import { DataSourceOptions, DataSourceSecureJsonData, GoogleAuthType } from './types';

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<DataSourceOptions, DataSourceSecureJsonData>;

export const ConnectionConfig: React.FC<ConfigEditorProps> = (props: ConfigEditorProps) => {
  const {
    options: { jsonData },
  } = props;

  if (!jsonData.authenticationType) {
    jsonData.authenticationType = GoogleAuthType.JWT;
  }

  const isJWT = jsonData.authenticationType === GoogleAuthType.JWT || jsonData.authenticationType === undefined;

  return (
    <>
      <AuthConfig authOptions={GOOGLE_AUTH_TYPE_OPTIONS} {...props} />
      <div className="grafana-info-box" style={{ marginTop: '16px' }} data-testid={TEST_IDS.helpBox}>
        <p>
          Don’t know how to get a service account key file or create a service account? Read more{' '}
          <a
            className="external-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://grafana.com/docs/grafana/latest/datasources/google-cloud-monitoring/google-authentication/"
          >
            in the documentation.
          </a>
        </p>
      </div>
      {!isJWT && (
        <Alert title="" severity="info">
          Verify GCE default service account by clicking Save & Test
        </Alert>
      )}
    </>
  );
};
