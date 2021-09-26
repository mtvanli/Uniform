import intentManifest from "../lib/intentManifest.json";
import { createCloudflareEventHandler } from "@uniformdev/optimize-edge-cloudflare";

export async function handleRequest(event: FetchEvent): Promise<Response> {
  const handler = createCloudflareEventHandler();

  const { processed, response } = await handler({
    event,
    intentManifest,
  });

  // If it was not processed, assume it was a static asset.
  if (!processed) {
    response.headers.set("cache-control", "public, max-age=604800, immutable");
  }

  return response;
}
