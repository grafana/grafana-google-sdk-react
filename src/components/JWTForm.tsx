import {
  DataSourceSettings,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceSecureJsonDataOption,
} from '@grafana/data';
import { Button, Field, Input, LegacyForms, SecretInput, useTheme2 } from '@grafana/ui';
import React from 'react';
import { TEST_IDS } from '../testIds';
import { DataSourceOptions, DataSourceSecureJsonData } from '../types';

const { SecretFormField } = LegacyForms;

export interface JWTFormProps {
  onReset: () => void;
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  onOptionsChange: (options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>) => void;
  showUpload: () => void;
  showPaste: () => void;
}

enum PrivateKeyConfig {
  PATH = 'path',
  JWT = 'jwt',
}

const getInitialPrivateKeyConfig = (options: DataSourceOptions): PrivateKeyConfig => {
  return 'privateKeyPath' in options && options.privateKeyPath !== '' ? PrivateKeyConfig.PATH : PrivateKeyConfig.JWT;
};

export const JWTForm: React.FC<JWTFormProps> = ({ options, onReset, onOptionsChange, showPaste, showUpload }) => {
  const [privateKeyConfig, setPrivateKeyConfig] = React.useState<PrivateKeyConfig>(
    getInitialPrivateKeyConfig(options.jsonData)
  );
  const onJWTFormChange = (key: keyof DataSourceOptions) =>
    onUpdateDatasourceJsonDataOption({ options, onOptionsChange }, key);

  const togglePrivateKeyFields = (): void => {
    if (privateKeyConfig === PrivateKeyConfig.JWT) {
      setPrivateKeyConfig(PrivateKeyConfig.PATH);
    } else {
      setPrivateKeyConfig(PrivateKeyConfig.JWT);
    }
  };
  const theme = useTheme2();

  const Description = (
    <span>
      {privateKeyConfig === PrivateKeyConfig.PATH ? (
        <a className="external-link" onClick={togglePrivateKeyFields} data-testid={TEST_IDS.linkPrivateKey}>
          Paste private key
        </a>
      ) : (
        'Paste private key'
      )}{' '}
      or &nbsp;
      {privateKeyConfig === PrivateKeyConfig.JWT ? (
        <a className="external-link" onClick={togglePrivateKeyFields} data-testid={TEST_IDS.linkPrivateKeyPath}>
          provide path to private file
        </a>
      ) : (
        'provide path to private key file'
      )}
    </span>
  );

  const privateKeyProps = {
    isConfigured: Boolean(options.secureJsonFields.privateKey),
    value: options.secureJsonData?.privateKey || '',
    placeholder: 'Enter Private key',
    onReset: () => onReset(),
    // Note: React might escape newline characters like this \\n so we need to handle that somewhere.
    onChange: onUpdateDatasourceSecureJsonDataOption({ options, onOptionsChange }, 'privateKey'),
    ['data-testid']: TEST_IDS.privateKeyInput,
  };

  return (
    <div data-testid={TEST_IDS.jwtForm}>
      <Field label="Project ID">
        <Input
          id="defaultProject"
          width={60}
          value={options.jsonData.defaultProject || ''}
          onChange={onJWTFormChange('defaultProject')}
        />
      </Field>

      <Field label="Client email">
        <Input
          width={60}
          id="clientEmail"
          value={options.jsonData.clientEmail || ''}
          onChange={onJWTFormChange('clientEmail')}
        />
      </Field>

      <Field label="Token URI">
        <Input
          width={60}
          id="tokenUri"
          value={options.jsonData.tokenUri || ''}
          onChange={onJWTFormChange('tokenUri')}
        />
      </Field>

      {privateKeyConfig === PrivateKeyConfig.PATH && (
        <Field label="Private key path" description={Description}>
          <Input
            width={60}
            id="privateKeyPath"
            value={options.jsonData.privateKeyPath || ''}
            placeholder="File location of your private key (e.g. /etc/secrets/gce.pem)"
            onChange={onJWTFormChange('privateKeyPath')}
            data-testid={TEST_IDS.privateKeyPathInput}
          />
        </Field>
      )}

      {privateKeyConfig === PrivateKeyConfig.JWT && (
        <>
          {/* Backward compatibility check. SecretInput was added in 8.5 */}
          {!!SecretInput ? (
            <Field label="Private key" description={Description}>
              <SecretInput {...privateKeyProps} width={60} />
            </Field>
          ) : (
            <SecretFormField {...privateKeyProps} label="Private key" labelWidth={10} inputWidth={20} />
          )}
        </>
      )}

      {
        <>
          <Button
            data-testid={TEST_IDS.pasteJwtButton}
            type="button"
            fill="outline"
            style={{ color: `${theme.colors.primary.text}` }}
            onClick={showPaste}
          >
            Paste JWT Token
          </Button>
          <span style={{ paddingRight: '10px', paddingLeft: '10px' }}>or</span>
          <Button
            data-testid={TEST_IDS.uploadJwtButton}
            type="button"
            fill="outline"
            style={{ color: `${theme.colors.primary.text}` }}
            onClick={showUpload}
          >
            Upload JWT Token
          </Button>
        </>
      }
    </div>
  );
};
