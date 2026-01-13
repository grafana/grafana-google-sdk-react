import { type DataSourceSettings } from '@grafana/data';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { ConnectionConfig } from './ConnectionConfig';
import { TEST_IDS } from './testIds';
import { type DataSourceOptions, type DataSourceSecureJsonData, GoogleAuthType } from './types';

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
  authenticationType?: (typeof GoogleAuthType)[keyof typeof GoogleAuthType]
) => DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>['jsonData'] = (
  authenticationType = GoogleAuthType.JWT
) => {
  return Object.freeze({
    authenticationType,
    clientEmail: 'test@grafana.com',
    tokenUri: 'https://accounts.google.com/o/oauth2/token',
    defaultProject: 'test-project',
  });
};

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
    expect(screen.queryByTestId(TEST_IDS.uploadJwtButton)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.fillJwtManuallyButton)).toBeInTheDocument();
  });

  it('renders private key path input when link is clicked', () => {
    const { getByTestId } = render(
      <WrapInState
        defaultOptions={
          {
            jsonData: {
              clientEmail: 'test@grafana.com',
              tokenUri: 'https://accounts.google.com/o/oauth2/token',
              defaultProject: 'test-project',
            },
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
      >
        {({ options, setOptions }) => {
          return <ConnectionConfig options={options} onOptionsChange={setOptions} />;
        }}
      </WrapInState>
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();

    const togglePublicKeyPathLink = getByTestId(TEST_IDS.linkPrivateKeyPath);
    fireEvent.click(togglePublicKeyPathLink);

    expect(screen.queryByTestId(TEST_IDS.privateKeyInput)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.privateKeyPathInput)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.uploadJwtButton)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteJwtButton)).toBeInTheDocument();
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
    const { getByText } = render(
      <WrapInState
        defaultOptions={
          {
            jsonData,
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
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

    const resetButton = getByText('Reset');
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
          {
            jsonData,
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
  });

  it('renders JWT form when data is provided (with private key)', () => {
    render(
      <ConnectionConfig
        options={
          {
            jsonData: {
              clientEmail: 'test@grafana.com',
              tokenUri: 'https://accounts.google.com/o/oauth2/token',
              defaultProject: 'test-project',
            },
            secureJsonFields: {
              privateKey: true,
            },
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.privateKeyInput)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.privateKeyPathInput)).not.toBeInTheDocument();
  });

  it('renders JWT form when data is provided (with private key path)', () => {
    render(
      <ConnectionConfig
        options={
          {
            jsonData: {
              clientEmail: 'test@grafana.com',
              tokenUri: 'https://accounts.google.com/o/oauth2/token',
              defaultProject: 'test-project',
              privateKeyPath: 'private/key/path',
            },
            secureJsonFields: {},
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={() => {}}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.jwtForm)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.privateKeyPathInput)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.pasteArea)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.dropZone)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.privateKeyInput)).not.toBeInTheDocument();
  });

  it('preserves service account credentials when changing auth type', () => {
    const onOptionsChangeSpy = jest.fn();
    const jsonData = makeJsonData();
    const expectedJsonData = makeJsonData(GoogleAuthType.GCE);

    const { getByLabelText } = render(
      <ConnectionConfig
        options={
          {
            secureJsonData: {},
            jsonData,
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
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

  it('makes sure JWT is selected by default', () => {
    const onOptionsChangeSpy = jest.fn();
    const jsonData = Object.freeze({});

    render(
      <ConnectionConfig
        options={
          {
            secureJsonData: {},
            jsonData,
          } as unknown as DataSourceSettings<DataSourceOptions, DataSourceSecureJsonData>
        }
        onOptionsChange={onOptionsChangeSpy}
      />
    );

    expect(screen.queryByTestId(TEST_IDS.fillJwtManuallyButton)).toBeInTheDocument();
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
