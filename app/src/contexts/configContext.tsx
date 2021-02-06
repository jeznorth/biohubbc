import axios from 'axios';
import { KeycloakConfig } from 'keycloak-js';
import React, { useEffect, useState } from 'react';
import { ensureProtocol } from 'utils/Utils';

export interface IConfig {
  API_HOST: string;
  CHANGE_VERSION: string;
  NODE_ENV: string;
  VERSION: string;
  KEYCLOAK_CONFIG: KeycloakConfig;
}

export const ConfigContext = React.createContext<IConfig | undefined>({
  API_HOST: '',
  CHANGE_VERSION: '',
  NODE_ENV: '',
  VERSION: '',
  KEYCLOAK_CONFIG: {
    url: '',
    realm: '',
    clientId: ''
  }
});

/**
 * Return the app config based on locally set environment variables.
 *
 * @return {*}  {IConfig}
 */
const getLocalConfig = (): IConfig => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  const API_PORT = process.env.REACT_APP_API_PORT;

  const API_URL = (API_PORT && `${API_HOST}:${API_PORT}`) || API_HOST || 'localhost';

  return {
    API_HOST: ensureProtocol(API_URL, 'http://'),
    CHANGE_VERSION: process.env.CHANGE_VERSION || 'NA',
    NODE_ENV: process.env.NODE_ENV,
    VERSION: `${process.env.VERSION || 'NA'}(build #${process.env.CHANGE_VERSION || 'NA'})`,
    KEYCLOAK_CONFIG: {
      url: process.env.SSO_URL || 'https://dev.oidc.gov.bc.ca/auth',
      realm: process.env.SSO_REALM || '35r1iman',
      clientId: process.env.SSO_CLIENT_ID || 'biohubbc'
    }
  };
};

/**
 * Return the app config based on a deployed app, running via `app/server/index.js`
 *
 * @return {*}  {Promise<IConfig>}
 */
const getDeployedConfig = async (): Promise<IConfig> => {
  const { data } = await axios.get<IConfig>('/config');

  return data;
};

/**
 * Return true if NODE_ENV=development, false otherwise.
 *
 * @return {*}  {boolean}
 */
const isDevelopment = (): boolean => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
};

/**
 * Provides environment variables.
 *
 * This will fetch env vars from either `process.env` if running with NODE_ENV=development, or from
 * `app/server/index.js` if running as a deployed NODE_ENV=production build.
 *
 * @param {*} props
 * @return {*}
 */
export const ConfigContextProvider: React.FC = (props) => {
  const [config, setConfig] = useState<IConfig>();

  useEffect(() => {
    const loadConfig = async () => {
      if (isDevelopment()) {
        const localConfig = getLocalConfig();
        setConfig(localConfig);
      } else {
        const deployedConfig = await getDeployedConfig();
        setConfig(deployedConfig);
      }
    };

    if (!config) {
      loadConfig();
    }
  }, []);

  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
};
