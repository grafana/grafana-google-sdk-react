import { type DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { Alert } from '@grafana/ui';
import React, { useEffect, useMemo } from 'react';
import { AuthConfig } from './components/AuthConfig';
import { GOOGLE_AUTH_TYPE_OPTIONS, WIF_AUTH_TYPE_OPTION } from './constants';
import { TEST_IDS } from './testIds';
import { type DataSourceOptions, type DataSourceSecureJsonData, GoogleAuthType } from './types';
import { getOptionsWithDefaults } from './utils';

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<DataSourceOptions, DataSourceSecureJsonData> & {
  enableWIF?: boolean;
};

export const ConnectionConfig: React.FC<ConfigEditorProps> = (props: ConfigEditorProps) => {
  const { options, onOptionsChange, enableWIF } = props;
  const optionsWithDefault = getOptionsWithDefaults(options);
  const authOptions = useMemo(
    () => (enableWIF ? [...GOOGLE_AUTH_TYPE_OPTIONS, WIF_AUTH_TYPE_OPTION] : GOOGLE_AUTH_TYPE_OPTIONS),
    [enableWIF]
  );

  // Handle setting default authenticationType as a side effect
  useEffect(() => {
    if (!options.jsonData.authenticationType) {
      const newOptions = {
        ...options,
        jsonData: { ...options.jsonData, authenticationType: GoogleAuthType.JWT },
      };
      onOptionsChange(newOptions);
    }
  }, [options.jsonData.authenticationType, options, onOptionsChange]);

  const isGCE = optionsWithDefault.jsonData.authenticationType === GoogleAuthType.GCE;

  return (
    <>
      <AuthConfig
        authOptions={authOptions}
        onOptionsChange={onOptionsChange}
        showServiceAccountImpersonationConfig={true}
        options={optionsWithDefault}
      />
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
      {isGCE && (
        <Alert title="" severity="info">
          Verify GCE default service account by clicking Save & Test
        </Alert>
      )}
    </>
  );
};
