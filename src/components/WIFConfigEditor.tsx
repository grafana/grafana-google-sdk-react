import { type DataSourceSettings, onUpdateDatasourceJsonDataOption } from '@grafana/data';
import { Field, Input } from '@grafana/ui';
import React from 'react';
import { TEST_IDS } from '../testIds';
import { type DataSourceOptions, type DataSourceSecureJsonData } from '../types';

export interface WIFConfigEditorProps {
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  onOptionsChange: (options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>) => void;
}

export function WIFConfigEditor({ options, onOptionsChange }: WIFConfigEditorProps) {
  const onChange = (key: keyof DataSourceOptions) =>
    onUpdateDatasourceJsonDataOption({ options, onOptionsChange }, key);

  return (
    <>
      <Field
        label="Workload Identity Pool Provider"
        description="Full resource name of the workload identity pool provider (e.g. projects/123/locations/global/workloadIdentityPools/my-pool/providers/my-provider)"
      >
        <Input
          id="workloadIdentityPoolProvider"
          width={80}
          value={options.jsonData.workloadIdentityPoolProvider || ''}
          placeholder="projects/<number>/locations/global/workloadIdentityPools/<pool>/providers/<provider>"
          onChange={onChange('workloadIdentityPoolProvider')}
          data-testid={TEST_IDS.workloadIdentityPoolProviderInput}
        />
      </Field>

      <Field
        label="Service account email"
        description="Optional. If set, the federated identity impersonates this service account when calling Google APIs."
      >
        <Input
          id="wifServiceAccountEmail"
          width={80}
          value={options.jsonData.wifServiceAccountEmail || ''}
          placeholder="name@project.iam.gserviceaccount.com"
          onChange={onChange('wifServiceAccountEmail')}
          data-testid={TEST_IDS.wifServiceAccountEmailInput}
        />
      </Field>

      <Field label="Default project">
        <Input
          id="defaultProject"
          width={60}
          value={options.jsonData.defaultProject || ''}
          onChange={onChange('defaultProject')}
        />
      </Field>
    </>
  );
}
