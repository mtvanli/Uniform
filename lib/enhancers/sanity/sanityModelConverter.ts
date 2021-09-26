export const sanityModelConverter = ({ parameter }: any) => {
  const entry = parameter.value;
  if (entry) {
    const content = entry;
    Object.keys(entry).map((fieldKey) => {
      // sanity image field transformation to a uniform model
      if (content[fieldKey]?._type === "image") {
        content[fieldKey] = transformSanityImage(content[fieldKey]);
      }
    });
    return content;
  }
  return parameter.value;
};

function transformSanityImage(sanityImage: any) {
  return {
    src: sanityImage?.asset?.url,
    alt: sanityImage?.asset?.originalFilename,
    width: sanityImage?.asset?.metadata?.dimensions?.width,
    height: sanityImage?.asset?.metadata?.dimensions?.height,
    // sourceData: {
    //   ...sanityImage?.asset,
    // },
  };
}
