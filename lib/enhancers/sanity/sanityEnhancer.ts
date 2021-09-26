import { createSanityEnhancer } from '@uniformdev/upm-sanity';
import createSanityClient from '@sanity/client';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
const { sanityProjectId, sanityDataset, sanityApiVersion, sanityToken } =
  serverRuntimeConfig;

export const sanityEnhancer = () => {
  if (!sanityProjectId) {
    throw new Error('SANITY_PROJECT_ID env not set.');
  }

  if (!sanityToken) {
    throw new Error('SANITY_TOKEN env not set.');
  }

  const client = createSanityClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    useCdn: false,
    apiVersion: sanityApiVersion,
  });

  const previewClient = createSanityClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    token: sanityToken,
    useCdn: false,
    apiVersion: sanityApiVersion,
  });

  return createSanityEnhancer({
    client,
    previewClient,
    modifyQuery: ({
      component,
      parameter,
      parameterName,
      query,
      queryParameters,
    }) => {
      const modifiedQuery =
        query +
        ' { ..., benefits[]->, stories[]->, image { ..., asset-> }, backgroundImage { ..., asset-> } }';
      return { query: modifiedQuery, queryParameters };
    },
  });
};
