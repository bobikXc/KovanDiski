import { unstable_cache } from "next/cache";

import {
  ApiRequestError,
  type Brand,
  type Fitment,
  type VehicleModel,
  type Wheel,
} from "@/lib/api";

const REVALIDATE_SECONDS = 300;

export type SiteData = {
  brands: Brand[];
  brandsWithModels: Brand[];
  models: VehicleModel[];
  wheels: Wheel[];
};

function getApiBaseURL() {
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl || baseUrl.startsWith("/")) {
    return "http://backend:8000/api";
  }

  return baseUrl;
}

function buildApiUrl(path: string, params?: Record<string, string | undefined>) {
  const baseUrl = getApiBaseURL();
  const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export async function apiGet<T>(
  path: string,
  fallback: T,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const url = buildApiUrl(path, params);

  console.log("[API GET]", path, new Date().toISOString());

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error("API request failed", {
        path,
        status: response.status,
        url: url.toString(),
      });

      return fallback;
    }

    return await response.json() as T;
  } catch (error) {
    console.error("API request error", {
      path,
      error,
    });

    return fallback;
  }
}

function attachModelsToBrands(brands: Brand[], models: VehicleModel[]): Brand[] {
  return brands.map((brand) => ({
    ...brand,
    models: models.filter((model) => model.brand_id === brand.id),
  }));
}

export const getSiteData = unstable_cache(
  async (): Promise<SiteData> => {
    const [brands, models, wheels] = await Promise.all([
      apiGet<Brand[]>("/brands", []),
      apiGet<VehicleModel[]>("/models", []),
      apiGet<Wheel[]>("/wheels", []),
    ]);

    return {
      brands,
      brandsWithModels: attachModelsToBrands(brands, models),
      models,
      wheels,
    };
  },
  ["site-data"],
  { revalidate: REVALIDATE_SECONDS },
);

export const getFitmentsCached = unstable_cache(
  async (brandSlug?: string, modelSlug?: string, wheelSlug?: string) => apiGet<Fitment[]>("/fitment", [], {
    brand_slug: brandSlug,
    model_slug: modelSlug,
    wheel_slug: wheelSlug,
  }),
  ["fitments"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getBrandCached(slug: string): Promise<Brand> {
  const { brandsWithModels } = await getSiteData();
  const brand = brandsWithModels.find((item) => item.slug === slug);

  if (!brand) {
    throw new ApiRequestError("Brand not found", 404);
  }

  return brand;
}

export async function getWheelCached(slug: string): Promise<Wheel> {
  const { wheels } = await getSiteData();
  const wheel = wheels.find((item) => item.slug === slug);

  if (!wheel) {
    throw new ApiRequestError("Wheel not found", 404);
  }

  return wheel;
}

function logSafeFailure(resource: string, error: unknown) {
  if (error instanceof ApiRequestError && error.status === 429) {
    console.warn(`${resource}: сервис временно перегружен`, error);
    return;
  }

  console.error(`${resource}: failed to load`, error);
}

function shouldRethrow(error: unknown) {
  return error instanceof ApiRequestError && error.status === 404;
}

export async function safeGetBrands(): Promise<Brand[]> {
  try {
    const { brands } = await getSiteData();
    return brands;
  } catch (error) {
    logSafeFailure("brands", error);
    return [];
  }
}

export async function safeGetBrandsWithModels(): Promise<Brand[]> {
  try {
    const { brandsWithModels } = await getSiteData();
    return brandsWithModels;
  } catch (error) {
    logSafeFailure("brands with models", error);
    return [];
  }
}

export async function safeGetModels(brandSlug?: string): Promise<VehicleModel[]> {
  try {
    const { brands, models } = await getSiteData();

    if (!brandSlug) {
      return models;
    }

    const brand = brands.find((item) => item.slug === brandSlug);
    return brand ? models.filter((model) => model.brand_id === brand.id) : [];
  } catch (error) {
    logSafeFailure("models", error);
    return [];
  }
}

export async function safeGetWheels(): Promise<Wheel[]> {
  try {
    const { wheels } = await getSiteData();
    return wheels;
  } catch (error) {
    logSafeFailure("wheels", error);
    return [];
  }
}

export async function safeGetFitments(filters: { brandSlug?: string; modelSlug?: string; wheelSlug?: string } = {}): Promise<Fitment[]> {
  try {
    return await getFitmentsCached(filters.brandSlug, filters.modelSlug, filters.wheelSlug);
  } catch (error) {
    logSafeFailure("fitments", error);
    return [];
  }
}

export async function safeGetBrand(slug: string): Promise<Brand | null> {
  try {
    return await getBrandCached(slug);
  } catch (error) {
    if (shouldRethrow(error)) {
      throw error;
    }

    logSafeFailure("brand", error);
    return null;
  }
}

export async function safeGetWheel(slug: string): Promise<Wheel | null> {
  try {
    return await getWheelCached(slug);
  } catch (error) {
    if (shouldRethrow(error)) {
      throw error;
    }

    logSafeFailure("wheel", error);
    return null;
  }
}
