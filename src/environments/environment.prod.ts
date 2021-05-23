import * as npm  from '../../package.json';

export const environment = {
  production: true,
  VERSION: npm.version,
  dataServiceUrl: 'https://hogwarts-api.multiclicksistemas.net',
  dataBrowserServiceUrl: 'https://hogwarts-api.multiclicksistemas.net',
};
