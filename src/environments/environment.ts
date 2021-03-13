import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
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
    scope: 'offline_access openid profile role email phone PMVOnline',
  },
  apis: {
    default: {
      url: 'https://localhost:44306',
      rootNamespace: 'PMVOnline',
    },
  },
} as Environment;