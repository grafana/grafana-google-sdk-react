import React, { useState } from 'react';
import { DataSourceSettings } from '@grafana/data';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionConfig } from './ConnectionConfig';
import { DataSourceOptions, DataSourceSecureJsonData, GoogleAuthType } from './types';
import { TEST_IDS } from './testIds';

const TOKEN_MOCK = `{
  "type": "service_account",
  "project_id": "test-project",
  "private_key_id": "private_key_id",
  "private_key": "private_key",
  "client_email": "test@grafana.com",
  "client_id": "id",
  "auth_uri": "url",
  "token_uri": "url",
  "auth_provider_x509_cert_url": "url",
  "client_x509_cert_url": "url"
}
`;

const makeJsonData: (
  authenticationType?: GoogleAuthType
) => DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>['jsonData'] = (
  authenticationType = GoogleAuthType.JWT
) => ({
  authenticationType,
  clientEmail: 'test@grafana.com',
  tokenUri: 'https://accounts.google.com/o/oauth2/token',
  defaultProject: 'test-project',
});

describe('ConnectionConfig', () => {
  it('renders help box', () => {
    render(
      <ConnectionConfig
        options={
          {
            jsonData: {},
          } as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.helpBox)).toBeInTheDocument();
  });

  it('renders drop zone by default', () => {
    render(
      <ConnectionConfig
        options={
          {
            jsonData: {},
          } as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.dropZone)).toBeInTheDocument();
  });

  it('renders JWT paste area when button clicked', () => {
    const { getByTestId } = render(
      <ConnectionConfig
        options={
          {
            jsonData: {},
          } as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );
    const pasteButton = getByTestId(TEST_IDS.pasteJwtButton);
    fireEvent.click(pasteButton);

    expect(screen.queryByTestId(TEST_IDS.pasteArea)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
  });

  it('renders JWT form when token is pasted', () => {
    const { getByTestId } = render(
      <WrapInState
        defaultOptions={
          {
            jsonData: {},
          } as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
      >
        {({ options, setOptions }) => {
          return <ConnectionConfig options={options} onOptionsChange={setOptions} />;
        }}
      </WrapInState>
    );
    const pasteButton = getByTestId(TEST_IDS.pasteJwtButton);
    fireEvent.click(pasteButton);

    const pasteArea = getByTestId(TEST_IDS.pasteArea);
    expect(pasteArea).toBeInTheDocument();

    fireEvent.change(pasteArea, { target: { value: TOKEN_MOCK } });
    fireEvent.blur(pasteArea);

    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
  });

  it('renders drop zone on JWT token reset', () => {
    const jsonData = makeJsonData();
    const { getByTestId } = render(
      <WrapInState
        defaultOptions={
          ({
            jsonData,
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown) as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
      >
        {({ options, setOptions }) => {
          return <ConnectionConfig options={options} onOptionsChange={setOptions} />;
        }}
      </WrapInState>
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();

    const resetButton = getByTestId(TEST_IDS.resetJwtButton);
    fireEvent.click(resetButton);

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).toBeInTheDocument();
  });

  it('renders JWT form when data is provided', () => {
    const jsonData = makeJsonData();
    render(
      <ConnectionConfig
        options={
          ({
            jsonData,
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown) as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
  });

  it('preserves service account credentials when changing auth type', () => {
    const onOptionsChangeSpy = jest.fn();
    const jsonData = makeJsonData();
    const expectedJsonData = makeJsonData(GoogleAuthType.GCE);

    const { getByLabelText } = render(
      <ConnectionConfig
        options={
          ({
            secureJsonData: {},
            jsonData,
          } as unknown) as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={onOptionsChangeSpy}
      />
    );

    const gceAuthButton = getByLabelText(TEST_IDS.authTypeButtonGCE);
    fireEvent.click(gceAuthButton);

    expect(onOptionsChangeSpy).toHaveBeenCalledWith({
      jsonData: expectedJsonData,
      secureJsonData: {},
    });
  });
});

interface WrapInStateChildrenProps {
  options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  setOptions: (options: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>) => void;
}

interface WrapInStateProps {
  defaultOptions: DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>;
  children: (props: WrapInStateChildrenProps) => JSX.Element;
}

const WrapInState = ({ defaultOptions, children }: WrapInStateProps) => {
  const [options, setOptions] = useState(defaultOptions);
  return children({ options, setOptions });
};
