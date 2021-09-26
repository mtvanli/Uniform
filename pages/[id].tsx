import React, { useRef } from "react";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import Head from "next/head";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import {
  RootComponentInstance,
  UPM_DRAFT_STATE,
  UPM_PUBLISHED_STATE,
} from "@uniformdev/upm";
import { enhancers } from "lib/enhancers";
import { enhance } from "@uniformdev/upm";
import { upmClient } from "lib/upmClient";
import { Composition, Slot } from "@uniformdev/upm-react";
import { resolveRenderer } from "components/composableComponents";

const PreviewDevPanel = dynamic(
  () => import("lib/preview/PreviewDevPanel/PreviewDevPanel")
);

export default function Home({
  preview,
  composition,
}: {
  preview?: string;
  composition: RootComponentInstance;
}) {
  const containerRef = useRef(null);
  const {
    publicRuntimeConfig: { previewEnabled },
  } = getConfig();

  return (
    <>
      <Head>
        <title>Modena Landing</title>
        <meta name="description" content="Modena demo page"></meta>
      </Head>
      <div ref={containerRef}>
        <Composition data={composition} resolveRenderer={resolveRenderer}>
          <Slot name="header" />
          <Slot name="content" />
          <Slot name="footer" />
        </Composition>
      </div>
      {previewEnabled === "true" && (
        <PreviewDevPanel
          containerRef={containerRef}
          preview={preview}
          composition={composition}
        />
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    publicRuntimeConfig: { previewEnabled },
  } = getConfig();

  const pages = await upmClient.getCompositionList({
    skipEnhance: true,
    state:
      process.env.NODE_ENV === "development" || previewEnabled === "true"
        ? UPM_DRAFT_STATE
        : UPM_PUBLISHED_STATE,
  });

  // IMPORTANT: setting fallback to 'true' breaks on Netlify
  // this is needed to be 'true' for Preview environment only
  const fallbackEnabled = previewEnabled === "true";
  return {
    paths: pages.compositions
      .map((c) => c.composition._slug!)
      .filter((slug) => slug),
    fallback: fallbackEnabled,
  };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = context?.params?.id;
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;

  const { preview } = context;
  const {
    publicRuntimeConfig: { previewEnabled },
  } = getConfig();

  const apiResult = await upmClient.getCompositionBySlug({
    slug: `/${slugString}`,
    state:
      process.env.NODE_ENV === "development" || preview
        ? UPM_DRAFT_STATE
        : UPM_PUBLISHED_STATE,
    skipEnhance: true,
  });

  await enhance({ composition: apiResult.composition, enhancers, context });

  return {
    props: {
      composition: apiResult.composition,
      preview: Boolean(preview),
    },
  };
}
