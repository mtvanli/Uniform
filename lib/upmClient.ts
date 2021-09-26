import { UpmClient } from "@uniformdev/upm";
import getConfig from "next/config";

const {
  serverRuntimeConfig: {
    uniformApiKey,
    presentationApiHost,
    presentationProjectId,
  },
} = getConfig();

export const upmClient = new UpmClient({
  apiKey: uniformApiKey,
  apiHost: presentationApiHost,
  projectId: presentationProjectId,
});
