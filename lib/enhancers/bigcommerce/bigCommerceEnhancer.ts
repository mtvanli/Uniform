import getConfig from 'next/config';
import {
  createBigCommerceClient,
  createBigCommerceEnhancer,
} from '@uniformdev/upm-bigcommerce';

const { serverRuntimeConfig } = getConfig();
const { bigCommerceStoreHash, bigCommerceToken } = serverRuntimeConfig;

export const bigCommerceEnhancer = () => {
  if (!bigCommerceStoreHash) {
    throw new Error('BIGCOMMERCE_STORE_HASH env not set.');
  }

  if (!bigCommerceToken) {
    throw new Error('BIGCOMMERCE_TOKEN env not set.');
  }

  return createBigCommerceEnhancer({
    client: createBigCommerceClient({
      storeHash: bigCommerceStoreHash,
      token: bigCommerceToken,
    }),
    createProductOptions: () => {
      return {
        include_fields: ['id', 'name', 'price', 'description'],
      };
    },
    createProductQueryOptions: () => {
      return {
        include_fields: ['id', 'name', 'price', 'description'],
      };
    },
  });
};
