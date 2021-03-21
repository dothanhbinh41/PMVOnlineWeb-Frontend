import { Environment } from '@abp/ng.core';

const baseUrl = 'https://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PMVOnline',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44306',
    redirectUri: baseUrl,
    clientId: 'PMVOnline_App',
    responseType: 'code',
    scope: 'offline_access PMVOnline',
  },
  apis: {
    default: {
      url: 'https://localhost:44306',
      rootNamespace: 'PMVOnline',
    },
  },
} as Environment;
