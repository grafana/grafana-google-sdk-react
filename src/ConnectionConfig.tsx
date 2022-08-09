import { DataSourcePluginOptionsEditorProps, onUpdateDatasourceJsonDataOption } from '@grafana/data';
import { Alert, Field, FieldSet, RadioButtonGroup } from '@grafana/ui';
import { BackendSrv } from '@grafana/runtime';

import React, { useState } from 'react';
import { TEST_IDS } from 'testIds';
import { JWTConfigEditor } from './components/JWTConfigEditor';
import { JWTForm } from './components/JWTForm';
import { GOOGLE_AUTH_TYPE_OPTIONS } from './constants';
import { DataSourceOptions, DataSourceSecureJsonData, GoogleAuthType } from './types';

export type ConfigEditorProps = DataSourcePluginOptionsEditorProps<DataSourceOptions, DataSourceSecureJsonData> & {
  backendSrv?: BackendSrv;
};

export const ConnectionConfig: React.FC<ConfigEditorProps> = (props: ConfigEditorProps) => {
  const { options, onOptionsChange } = props;
  const { jsonData, secureJsonFields, secureJsonData } = options;
  const [error, setError] = useState<string | undefined>(undefined);

  if (!jsonData.authenticationType) {
    jsonData.authenticationType = GoogleAuthType.JWT;
  }

  const isJWT = jsonData.authenticationType === GoogleAuthType.JWT || jsonData.authenticationType === undefined;

  const onAuthTypeChange = async (authenticationType: GoogleAuthType) => {
    let gceDefaultProject = jsonData.gceDefaultProject;
    try {
      if (authenticationType === 'gce' && !gceDefaultProject) {
        gceDefaultProject = await props.backendSrv.get(
          `/api/datasources/${props.options.id}/resources/gceDefaultProject`
        );
      }
    } catch (err) {
      setError(err.data.message);
    }
    onOptionsChange({
      ...options,
      jsonData: { ...options.jsonData, authenticationType, gceDefaultProject },
    });
  };

  const hasJWTConfigured = Boolean(
    secureJsonFields &&
      secureJsonFields.privateKey &&
      jsonData.clientEmail &&
      jsonData.defaultProject &&
      jsonData.tokenUri
  );

  const onResetApiKey = (jsonData?: Partial<DataSourceOptions>) => {
    const nextSecureJsonData = { ...secureJsonData };
    const nextJsonData = !jsonData ? { ...options.jsonData } : { ...options.jsonData, ...jsonData };

    delete nextJsonData.clientEmail;
    delete nextJsonData.defaultProject;
    delete nextJsonData.tokenUri;
    delete nextSecureJsonData.privateKey;

    onOptionsChange({
      ...options,
      secureJsonData: nextSecureJsonData,
      jsonData: nextJsonData,
    });
  };

  const onJWTFormChange = (key: keyof DataSourceOptions) => onUpdateDatasourceJsonDataOption(props, key);

  return (
    <>
      <FieldSet label="Authentication">
        <Field label="Authentication type">
          <RadioButtonGroup
            options={GOOGLE_AUTH_TYPE_OPTIONS}
            value={jsonData.authenticationType || GoogleAuthType.JWT}
            onChange={onAuthTypeChange}
          />
        </Field>
      </FieldSet>

      {isJWT && (
        <FieldSet label="JWT Key Details">
          {hasJWTConfigured ? (
            <JWTForm options={options.jsonData} onReset={onResetApiKey} onChange={onJWTFormChange} />
          ) : (
            <JWTConfigEditor
              onChange={(jwt) => {
                onOptionsChange({
                  ...options,
                  secureJsonFields: { ...secureJsonFields, privateKey: true },
                  secureJsonData: {
                    ...secureJsonData,
                    privateKey: jwt.privateKey,
                  },
                  jsonData: {
                    ...jsonData,
                    clientEmail: jwt.clientEmail,
                    defaultProject: jwt.projectId,
                    tokenUri: jwt.tokenUri,
                  },
                });
              }}
            />
          )}{' '}
        </FieldSet>
      )}
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
      {error !== undefined && (
        <Alert title="Error retrieving default project" severity="error">
          {error}
        </Alert>
      )}
    </>
  );
};
