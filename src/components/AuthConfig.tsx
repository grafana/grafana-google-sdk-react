import { DataSourceSettings, onUpdateDatasourceJsonDataOption, SelectableValue } from '@grafana/data';
import { Field, FieldSet, Input, RadioButtonGroup } from '@grafana/ui';
import React, { useState } from 'react';
import { DataSourceOptions, DataSourceSecureJsonData, GoogleAuthType } from '../types';
import { JWTConfigEditor } from './JWTConfigEditor';
import { JWTForm } from './JWTForm';

export interface AuthConfigProps {
  authOptions: SelectableValue[];
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  onOptionsChange: (options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>) => void;
}

export function AuthConfig(props: AuthConfigProps) {
  const { options, onOptionsChange, authOptions } = props;
  const { jsonData, secureJsonFields, secureJsonData } = options;
  const getJTWConfig = (): boolean =>
    Boolean(
      jsonData.clientEmail &&
        jsonData.defaultProject &&
        jsonData.tokenUri &&
        ((secureJsonFields && secureJsonFields.privateKey) || jsonData.privateKeyPath)
    );

  if (!jsonData.authenticationType) {
    jsonData.authenticationType = GoogleAuthType.JWT;
  }

  const [jwtAuth, setJWTAuth] = useState<boolean>(isJWTAuth(jsonData.authenticationType));
  const [configEditorVisible, setConfigEditorVisible] = useState<boolean>(getJTWConfig());
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(true);

  const showConfigEditor = (): void => {
    setConfigEditorVisible(true);
  };

  const showUpload = (): void => {
    setIsPasting(false);
    setIsUploading(true);
    setConfigEditorVisible(false);
  };

  const showPaste = (): void => {
    setIsPasting(true);
    setIsUploading(false);
    setConfigEditorVisible(false);
  };

  const onAuthTypeChange = (authenticationType: string) => {
    setConfigEditorVisible(getJTWConfig());
    onOptionsChange({
      ...options,
      jsonData: { ...options.jsonData, authenticationType },
    });
    setJWTAuth(isJWTAuth(authenticationType));
  };

  const onResetApiKey = (jsonData?: Partial<DataSourceOptions>) => {
    const nextSecureJsonData = { ...secureJsonData };
    const nextJsonData = !jsonData ? { ...options.jsonData } : { ...options.jsonData, ...jsonData };

    delete nextJsonData.clientEmail;
    delete nextJsonData.defaultProject;
    delete nextJsonData.tokenUri;
    delete nextJsonData.privateKeyPath;
    delete nextSecureJsonData.privateKey;

    setJWTAuth(true);
    setConfigEditorVisible(false);
    onOptionsChange({
      ...options,
      secureJsonFields: { ...options.secureJsonFields, privateKey: false },
      secureJsonData: nextSecureJsonData,
      jsonData: nextJsonData,
    });
  };

  return (
    <>
      <FieldSet label="Authentication">
        <Field label="Authentication type">
          <RadioButtonGroup
            options={authOptions}
            value={jsonData.authenticationType || GoogleAuthType.JWT}
            onChange={onAuthTypeChange}
          />
        </Field>
      </FieldSet>

      {jwtAuth && (
        <FieldSet label="JWT Key Details">
          {configEditorVisible ? (
            <JWTForm
              options={options}
              onReset={() => onResetApiKey()}
              onOptionsChange={onOptionsChange}
              showUpload={showUpload}
              showPaste={showPaste}
            />
          ) : (
            <JWTConfigEditor
              showConfigEditor={showConfigEditor}
              showUpload={showUpload}
              showPaste={showPaste}
              isPasting={isPasting}
              isUploading={isUploading}
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

      {jsonData.authenticationType === GoogleAuthType.GCE && (
        <Field label="Default project">
          <Input
            id="defaultProject"
            width={60}
            value={options.jsonData.defaultProject || ''}
            onChange={onUpdateDatasourceJsonDataOption(props, 'defaultProject')}
          />
        </Field>
      )}
    </>
  );
}

const isJWTAuth = (authenticationType: string): boolean => {
  return authenticationType === GoogleAuthType.JWT || authenticationType === undefined;
};
