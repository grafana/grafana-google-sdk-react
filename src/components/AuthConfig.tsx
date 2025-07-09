import {
  type DataSourceSettings,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceJsonDataOptionChecked,
  type SelectableValue,
} from "@grafana/data";
import { Field, FieldSet, Input, RadioButtonGroup, Switch } from "@grafana/ui";
import React, { useState } from "react";
import {
  type DataSourceOptions,
  type DataSourceSecureJsonData,
  GoogleAuthType,
} from "../types";
import { getOptionsWithDefaults } from "../utils";
import { JWTConfigEditor } from "./JWTConfigEditor";
import { JWTForm } from "./JWTForm";

export interface AuthConfigProps {
  authOptions: SelectableValue[];
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  onOptionsChange: (
    options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
  ) => void;
  showServiceAccountImpersonationConfig?: boolean;
}

export function AuthConfig(props: AuthConfigProps) {
  const {
    options,
    onOptionsChange,
    authOptions,
    showServiceAccountImpersonationConfig,
  } = props;
  const { jsonData, secureJsonFields, secureJsonData } =
    getOptionsWithDefaults(options);
  const getJTWConfig = (): boolean =>
    Boolean(
      jsonData.clientEmail &&
        jsonData.defaultProject &&
        jsonData.tokenUri &&
        ((secureJsonFields && secureJsonFields.privateKey) ||
          jsonData.privateKeyPath)
    );

  const [jwtAuth, setJWTAuth] = useState<boolean>(
    isJWTAuth(jsonData.authenticationType)
  );
  const [configEditorVisible, setConfigEditorVisible] = useState<boolean>(
    getJTWConfig()
  );
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
    const nextJsonData = !jsonData
      ? { ...options.jsonData }
      : { ...options.jsonData, ...jsonData };

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
          )}{" "}
        </FieldSet>
      )}

      {jsonData.authenticationType === GoogleAuthType.GCE && (
        <Field label="Default project">
          <Input
            id="defaultProject"
            width={60}
            value={options.jsonData.defaultProject || ""}
            onChange={onUpdateDatasourceJsonDataOption(props, "defaultProject")}
          />
        </Field>
      )}
      {showServiceAccountImpersonationConfig && (
        <FieldSet label="Service account impersonation">
          <Field
            label="Enable"
            htmlFor="usingImpersonation"
            description={
              <span>
                Read more about service account impersonation{" "}
                <a
                  href="https://cloud.google.com/iam/docs/service-account-impersonation"
                  rel="noreferrer"
                  className="external-link"
                  target="_blank"
                >
                  here
                </a>
              </span>
            }
          >
            <Switch
              value={options.jsonData.usingImpersonation || false}
              onChange={onUpdateDatasourceJsonDataOptionChecked(
                props,
                "usingImpersonation"
              )}
              id="usingImpersonation"
            />
          </Field>
          {options.jsonData.usingImpersonation && (
            <Field
              label="Service account to impersonate"
              htmlFor="serviceAccountToImpersonate"
            >
              <Input
                id="serviceAccountToImpersonate"
                width={60}
                value={options.jsonData.serviceAccountToImpersonate || ""}
                onChange={onUpdateDatasourceJsonDataOption(
                  props,
                  "serviceAccountToImpersonate"
                )}
              />
            </Field>
          )}
        </FieldSet>
      )}
    </>
  );
}

const isJWTAuth = (authenticationType: string): boolean => {
  return (
    authenticationType === GoogleAuthType.JWT ||
    authenticationType === undefined
  );
};
