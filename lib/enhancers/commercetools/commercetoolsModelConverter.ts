import { TypedMoney } from "@commercetools/platform-sdk";

const commercetoolsLocale = "en";
const commercetoolsCurrencyCode = "USD";

const renderVariantPrice = (value: TypedMoney | undefined) => {
  if (typeof value?.centAmount === "undefined") {
    return undefined;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: value.currencyCode,
  });

  const currencyAmount = value.centAmount / Math.pow(10, value.fractionDigits);

  return formatter.format(currencyAmount);
};

export const commercetoolsModelConverter = ({ parameter }: any) => {
  const productData = parameter.value;
  if (Array.isArray(productData)) {
    return productData.map((p) => transformCommercetoolsProduct(p));
  } else {
    return transformCommercetoolsProduct(productData);
  }
};

function transformCommercetoolsProduct(productData: any) {
  const currentVariant = productData?.masterData?.current;
  if (!currentVariant) {
    return undefined;
  }

  const productVariant = currentVariant?.masterVariant;
  const productPrice = productVariant?.prices?.find(
    (p) => p.value.currencyCode === commercetoolsCurrencyCode
  );
  const productImages = productVariant?.images?.map((i) => {
    return {
      url: i.url,
      width: i.dimensions.w,
      height: i.dimensions.h,
    };
  });

  return {
    name: currentVariant.name[commercetoolsLocale] || "",
    tag: "",
    description:
      "Duis sed arcu varius, semper quam eget, venenatis eros. Aliquam tincidunt, justo eget ullamcorper finibus, justo arcu luctus felis, ut rhoncus leo turpis eu lectus.",
    price: renderVariantPrice(productPrice.value),
    images: productImages,
  };
}
