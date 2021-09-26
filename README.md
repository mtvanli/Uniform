# Modena Demo

This is a [Next.js](https://nextjs.org/) demo enabled with Uniform Optimize and Presentation Management capabilities.

The project is enabled for edge-side personalization and A/B testing, however it is not required.

# Supported Content + Commerce stacks

1. Contentful + BigCommerce
1. Contentful + Commercetools
1. Contentstack + BigCommerce
1. Contentstack + Commercetools
1. Sanity + BigCommerce
1. TODO: Sanity + Commercetools
1. TODO: SalesforceCMS + BigCommerce

# Known issues
1. If you are using npm as your package manager, you have to upgrade to the latest release. 
2. Contentstack: image dimensions are not retrieved, so width and height cannot be set explicitly.

# Initial application setup

## Step 1: Package installation

1. Set the `NPM_TOKEN` environment variable to the value provided by your Uniform account manager (see the `.npmrc` file).

1. Install dependencies
   ```shell
   npm install
   # or
   yarn
   ```

## Step 2: Application configuration

1. Create a new project on uniform.app and configure your desired integrations (see the list of supported integrations above). Your Uniform account manager can help enable relevant integrations.
1. Create API keys under your team on uniform.app:

   1. Create an API keys with the following permissions: 
        - `Read drafts` and `Read intent manifest`
        - `Compositions:Read Draft` and `Compositions:Read Published`
   
   1. Set the `UNIFORM_API_KEY` env var with this value.
   
   1. Create an API key for the CLI with wider permissions (must check all checkboxes under `Uniform Presentation Manager`)
   
   1. Set the `UPM_CLI_API_KEY` env var with this value.
1. Perform publish of optimize manifest by clicking the **Publish** button from your project's Personalization tab.
1. Copy `.env.example` as `.env`.
1. Setup your environment variables in `.env` file.
   ```bash
   # your project id inside uniform dashboard:
   UNIFORM_PROJECT_ID=
   ; # application api key (used for Optimize and UPM)
   UNIFORM_API_KEY=
   ; # CLI key: needs all permissions enabled on UPM feature level
   UPM_CLI_API_KEY=
   ```
1. Add connection tokens for your specific system you are connecting to:

   ```bash

       # BigCommerce
       BIGCOMMERCE_STORE_HASH=
       BIGCOMMERCE_TOKEN=

       # COMMERCETOOLS
       CTP_PROJECT_KEY=
       CTP_CLIENT_SECRET=
       CTP_CLIENT_ID=
       CTP_AUTH_URL=
       CTP_API_URL=

       # CONTENTFUL
       CONTENTFUL_SPACE_ID=
       CONTENTFUL_ENVIRONMENT=
       CONTENTFUL_CDA_ACCESS_TOKEN=
       CONTENTFUL_CPA_ACCESS_TOKEN=

       # CONTENTSTACK
       CONTENTSTACK_API_KEY=
       CONTENTSTACK_DELIVERY_TOKEN=
       CONTENTSTACK_ENVIRONMENT=

       # SANITY
       SANITY_PROJECT_ID=
       SANITY_TOKEN=

   ```

1. `npm run push:<stack name>` to sync the component library and compositions from disk to your project.
    
    where *`<stack name>`*:
    - `contentful-bigcommerce`
    - `contentful-commercetools`
    - `contentstack-bigcommerce`
    - `contentstack-commercetools`
    - `sanity-bigcommerce`

1. Publish your compositions under /Presentation tab.

# Step 3: Importing content into CMS

## Import into Contentful

The Modena demo site comes with some sample content that must be imported into your CMS.
At this time, only the export dump for Contentful is available, content for other CMSs can be provided on demand.

1. Make sure you have an account with Contentful and an empty space (recommended). You can sign up for a free account at Contentful.com.
1. Login to Contentful via CLI: `contentful login` and follow the steps.  
Check that you have access to your space via CLI: `contentful space list`.

1. Run `contentful space import --space-id <your-space-id> --content-file content/contentful-modena-export.json` to import the content (change space id to your Contentful space id).


   Learn more about Contentful export/import in the official docs [here](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/).

1. Create Content delivery / API key tokens in Contentful under `https://app.contentful.com/spaces/your-space/api/keys`. You would need the following values for later:
   - Space ID
   - Content Delivery API - access token
   - Content Preview API - access token


### Run the development server without local Cloudflare

1. Run the following command:

   ```shell
   npm run dev
   # or
   yarn dev
   ```

1. Open <http://localhost:4120> with your browser to see the result.

### Run the development server with local Cloudflare workers

1. Set `UNIFORM_NESI_ENABLED=true` in .env file to enable edge-side personalization execution mode.

1. Run the following command:

   ```shell
   npm run dev:all
   # or
   yarn dev:all
   ```

1. Open <http://localhost:8787> with your browser to see the result.


## Import to Contentstack
To import data into Contentstack you must have an empty stack available and created a Management Token in that stack (You need BOTH your Management Token AND you Stack API key to do the import) the following commands can be used:

Login to you Contentstack:
```shell
csdx auth:login
```

With this command you WILL need your Management Token and you Stack API key.
https://www.contentstack.com/docs/developers/cli/authenticate-with-the-cli/
```shell
csdx auth:tokens:add -m
```
You add a named token for importing data, assets and definitions into your stack on Contentstack.

To do the actual import:
```shell
csdx cm:import -a <The named token you added in above step> -d ./content/contentstack-modena-export
```

Done!

Remember to publish in Contentstack!

## Import to Sanity
TODO: Coming soon

## Step 4: Run the application: 
1. `npm run dev` to start the project.
1. Open `http://localhost:4120/landing`

### Run the development server with local Cloudflare workers

This option allows to run the application with edge-side personalization capability.

1. Set `UNIFORM_NESI_ENABLED=true` in .env file to enable edge-side personalization execution mode.

1. Run the following command:

   ```shell
   npm run dev:all
   # or
   yarn dev:all
   ```

1. Open <http://localhost:8787> with your browser to see the result.

# Appendix A: Production application setup

## Step 1: Configure webhooks

If you are running a Jamstack-style deployment (kudos if you do :)) then you would need to kick off a site build when anything is changed within your project (whether it is a new intent added / changed, or a composition is created or updated).

Uniform allows you to configure webhooks allowing to trigger site builds (in Netlify, for example).

In order to create a new webhook:

1. Navigate to `Your Project / Settings / Webhooks`
1. Create a new webhook with a memorable name.
1. For the URL, use the webhook that your build system provided you with.

## Step 2: Run production build and deployment

### Option 1: Without Cloudflare

1. Run the following command:

   ```shell
   npm run ci:build
   # or
   yarn ci:build

   ```

1. To test the statically exported site, run `npx serve out` and check if the site renders on `localhost:5000`.

1. To deploy, run the command required to transfer the contents of the `./out` directory to your hosting service.

### Option 2: With Cloudflare

1. Copy `wrangler.toml.example` as `wrangler.toml`
1. Populate `account_id` and `zone_id` with values from your Cloudflare account.
1. Enable edge-side personalization mode by setting this env var to true:

   ```bash
   UNIFORM_NESI_ENABLED=true
   ```

1. Run the following command:
   ```shell
   npm run yolo
   # or
   yarn yolo
   ```

> At the end of this step, the app will be deployed to Worker Sites (static files and the worker code that run edge personalization and a/b testing).

# Appendix B: Configuring the preview mode

1. Set the following env var values:
   ```
   # set preview secret which will be appended to the `secret=` query string variable to activate the preview mode:
   UNIFORM_PREVIEW_SECRET=your-secret
   # Enable it to fetch pre-published content:
   UNIFORM_PREVIEW_ENABLED=true
   # Disable the edge-side personalization by setting this to false:
   UNIFORM_NESI_ENABLED=false
   ```

1. Run build: `npm run build`.
1. Run start: `npm run start`. This will start the next.js server in preview on `localhost:4120`
1. Open the preview url by passing the following query string parameters:
   - `slug` - the value of the slug of your composition
   - `secret` - the value of the `UNIFORM_PREVIEW_SECRET` env var.

   for example:
   `http://localhost:4120/api/preview?slug=/landing&secret=your-secret`


   > This will enable preview mode, allowing you to change composition, save and see hot reloaded composition without refreshes or publishing.

1. Set the preview url under your project in uniform.app (`Settings` -> `UPM settings`) and save. This will enable the "preview" button inside the composition editor.
   `http://localhost:4120/api/preview?secret=your-secret`

# Appendix C: Deploy to Netlify

Are you doing multiple demos and want to be able to fairly quickly switch between different configurations. A set of ENV files have been created.   

They are named `.env_<PartOfEnvironmentThatFileConfigures>.example.`
To use the files, rename them .NetlifyDeploy and fill in the relevant configuration. If you have configured your "normal" .Env file, it should be fairly selfexplanatory what goes where. 

To control the Enviroment in Netlify from a Terminal install the Netlify CLI.
https://docs.netlify.com/cli/get-started/

Setup a Netlify site, connected to you Modena code repo.
Link your local repo to your Netlify Site by running - https://docs.netlify.com/cli/get-started/#link-and-unlink-sites:

```shell
netlify link
```
You can now use the scripts in package.json and create your own configurations as well.
e.g.
```shell
npm run netlify:CF-BC-CFlare
   # or
yarn netlify:CF-BC-CFlare
```
Which will configure your Netlify Environment with relevant variables to run Contentful, BigCommerce and Cloudflare
# Troubleshooting

1. You may get the following error during next build/export if `UNIFORM_PREVIEW_ENABLED=true`. Set this value to false and re-run the build/export process.

   ```
   info  - Launching 23 workers
   Error: Found pages with `fallback` enabled:
   /[id]
   Pages with `fallback` enabled in `getStaticPaths` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export

       at C:\Users\alex\source\modena\node_modules\next\dist\export\index.js:25:196
       at async Span.traceAsyncFn (C:\Users\alex\source\modena\node_modules\next\dist\telemetry\trace\trace.js:6:584)
   ```

1. If you are getting 404 when running `npm run dev`, make sure you publish the Optimize manifest from the dashboard / personalization tab at least once.

    ```bash
    $ uniform optimize manifest download --output ./lib/intentManifest.json
    ⚠ Error fetching intent manifest https://uniform.app/api/v1/manifest?projectId=f902c648-0a96-4874-890b-cf5670743f86
    ❗ 404 Not Found, content No published data for provided API key; it may be invalid, or no publish has occurred since creating it.
    ```

 # Personalization
   Uniform presentation Manager directly support using Uniforms Testing and Personalization capabilites as well. You can easily configure a set of simple Intents and Signals for this demo as well.  

   We suggest configuring the following Intents in the /Personalization tab (Read about Intents here - <https://docs.uniform.app/optimize/intro>) each configured with one Query string signal:
   
   - Men
   - Women
   - Men hipster
   - Women Luxury

  For each Intent, configure one signal:

   - Type: Querystring
   - Name: utm
   - Querystring Parametername: utm_campaign
   - Querystring value: `<same as Intentname - e.g. "Men">`
   - Leave other settings as `Default`
   

  Publish your Intents when done to make them avaible to your build.


