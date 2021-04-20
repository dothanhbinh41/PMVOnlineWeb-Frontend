import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PMVOnline',
    logoUrl: 'assets/logo.png',
  },
  oAuthConfig: {
    issuer: 'https://pmvonline.azurewebsites.net',
    redirectUri: baseUrl,
    clientId: 'PMVOnline_App',
    responseType: 'code',
    scope: 'offline_access PMVOnline',
  },
  apis: {
    default: {
      url: 'https://pmvonline.azurewebsites.net',
      rootNamespace: 'PMVOnline',
    },
  },
} as Environment;
