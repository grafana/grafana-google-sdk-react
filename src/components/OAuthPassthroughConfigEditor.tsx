import { type DataSourceSettings, onUpdateDatasourceJsonDataOption } from '@grafana/data';
import { Field, Input } from '@grafana/ui';
import React from 'react';
import { TEST_IDS } from '../testIds';
import { type DataSourceOptions, type DataSourceSecureJsonData } from '../types';

export interface OAuthPassthroughConfigEditorProps {
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  onOptionsChange: (options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>) => void;
}

export function OAuthPassthroughConfigEditor({ options, onOptionsChange }: OAuthPassthroughConfigEditorProps) {
  return (
    <Field
      label="Default project"
      description="Required when forwarding the signed-in user's OAuth identity. The user's OAuth token doesn't carry a project context, so the data source can't infer it from the credentials."
    >
      <Input
        id="defaultProject"
        width={60}
        value={options.jsonData.defaultProject || ''}
        placeholder="my-gcp-project"
        onChange={onUpdateDatasourceJsonDataOption({ options, onOptionsChange }, 'defaultProject')}
        data-testid={TEST_IDS.oauthPassthroughDefaultProjectInput}
      />
    </Field>
  );
}
