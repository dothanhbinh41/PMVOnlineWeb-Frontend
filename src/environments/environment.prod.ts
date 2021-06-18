import { Environment } from '@abp/ng.core';

const baseUrl = 'http://task.pmvina.com';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PMVOnline',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'http://task.pmvina.com:44306',
    redirectUri: baseUrl,
    clientId: 'PMVOnline_App',
    responseType: 'code',
    scope: 'offline_access PMVOnline',
  },
  apis: {
    default: {
      url: 'http://task.pmvina.com:44306',
      rootNamespace: 'PMVOnline',
    },
  },
} as Environment;
