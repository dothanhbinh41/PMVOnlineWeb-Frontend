import { Environment } from '@abp/ng.core';

const baseUrl = 'https://task.pmvina.com';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PMVOnline',
    logoUrl: 'assets/logo.png',
  },
  oAuthConfig: {
    issuer: 'https://api.pmvina.com',
    redirectUri: baseUrl,
    clientId: 'PMVOnline_App',
    responseType: 'code',
    scope: 'offline_access PMVOnline',
  },
  apis: {
    default: {
      url: 'https://api.pmvina.com',
      rootNamespace: 'PMVOnline',
    },
  },
} as Environment;
