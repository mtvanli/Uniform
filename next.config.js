const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  serverRuntimeConfig: {
    previewSecret: process.env.UNIFORM_PREVIEW_SECRET,
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulEnvironment: process.env.CONTENTFUL_ENVIRONMENT,
    contentfulPreviewToken: process.env.CONTENTFUL_CPA_ACCESS_TOKEN,
    contentfulDeliveryToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN,
    presentationApiHost: process.env.UNIFORM_PRESENTATION_API_HOST,
    presentationProjectId: process.env.UNIFORM_PROJECT_ID,
    uniformApiKey: process.env.UNIFORM_API_KEY,
    bigCommerceStoreHash: process.env.BIGCOMMERCE_STORE_HASH,
    bigCommerceToken: process.env.BIGCOMMERCE_TOKEN,
    contentstackApiKey: process.env.CONTENTSTACK_API_KEY,
    contentstackDeliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    contentstackEnvironment: process.env.CONTENTSTACK_ENVIRONMENT,
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityToken: process.env.SANITY_TOKEN,
    sanityDataset: process.env.SANITY_DATASET || "production",
    sanityApiVersion: process.env.SANITY_API_VERSION || "v2021-03-25",
    commercetoolsAuthUrl: process.env.CTP_AUTH_URL,
    commercetoolsProjectKey: process.env.CTP_PROJECT_KEY,
    commercetoolsClientId: process.env.CTP_CLIENT_ID,
    commercetoolsClientSecret: process.env.CTP_CLIENT_SECRET,
    commercetoolsApiUrl: process.env.CTP_API_URL,
  },
  images: {
    loader: "cloudinary",
    domains: ["res.cloudinary.com"],
    path: "https://res.cloudinary.com/uniformdev/image/fetch",
  },
  publicRuntimeConfig: {
    gaTrackingId: process.env.GA_UA_ID,
    previewEnabled: process.env.UNIFORM_PREVIEW_ENABLED,
    previewSecret: process.env.UNIFORM_PREVIEW_SECRET,
    edgeEnabled: process.env.UNIFORM_NESI_ENABLED,
  },
  future: {
    webpack5: false,
  },
  target: "serverless",
  trailingSlash: true,
  webpack: (config, { dev }) => {
    // next builds with source maps are too big for workers KV to handle, disable
    // until this changes.

    // disable sourcemaps of webpack
    config.devtool = false;

    // disable soucemaps of babel-loader
    for (const r of config.module.rules) {
      if (r.loader === "babel-loader") {
        r.options.sourceMaps = false;
      }
    }

    return config;
  },
});
