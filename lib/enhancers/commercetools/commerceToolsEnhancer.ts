import getConfig from 'next/config';
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createCommercetoolsEnhancer } from '@uniformdev/upm-commercetools';
import fetch from 'node-fetch';

const { serverRuntimeConfig } = getConfig();
const {
  commercetoolsAuthUrl,
  commercetoolsProjectKey,
  commercetoolsClientId,
  commercetoolsClientSecret,
  commercetoolsApiUrl,
} = serverRuntimeConfig;

export const commercetoolsEnhancer = () => {
  if (!commercetoolsAuthUrl) {
    throw new Error('CTP_AUTH_URL env not set.');
  }

  if (!commercetoolsProjectKey) {
    throw new Error('CTP_PROJECT_KEY env not set.');
  }

  if (!commercetoolsClientId) {
    throw new Error('CTP_CLIENT_ID env not set.');
  }

  if (!commercetoolsClientSecret) {
    throw new Error('CTP_CLIENT_SECRET env not set.');
  }

  if (!commercetoolsApiUrl) {
    throw new Error('CTP_API_URL env not set.');
  }

  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: commercetoolsAuthUrl,
    projectKey: commercetoolsProjectKey,
    credentials: {
      clientId: commercetoolsClientId,
      clientSecret: commercetoolsClientSecret,
    },
  });

  const httpMiddleware = createHttpMiddleware({
    host: commercetoolsApiUrl,
    fetch,
  });

  const ctpClient = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  });

  const apiRoot: ApiRoot = createApiBuilderFromCtpClient(ctpClient);

  return createCommercetoolsEnhancer({
    apiRoot,
    projectKey: commercetoolsProjectKey,
  });
};
