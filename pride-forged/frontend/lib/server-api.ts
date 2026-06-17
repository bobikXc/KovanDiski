import { cache } from "react";

import {
  ApiRequestError,
  type Brand,
  type Fitment,
  type VehicleModel,
  type Wheel,
  getBrand,
  getBrands,
  getBrandsWithModels,
  getFitments,
  getModels,
  getWheel,
  getWheels
} from "@/lib/api";

export const getBrandsCached = cache(() => getBrands());
export const getBrandsWithModelsCached = cache(() => getBrandsWithModels());
export const getBrandCached = cache((slug: string) => getBrand(slug));
export const getModelsCached = cache((brandSlug?: string) => getModels(brandSlug));
export const getWheelsCached = cache(() => getWheels());
export const getWheelCached = cache((slug: string) => getWheel(slug));
export const getFitmentsCached = cache((brandSlug?: string, modelSlug?: string, wheelSlug?: string) => getFitments({ brandSlug, modelSlug, wheelSlug }));

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
    return await getBrandsCached();
  } catch (error) {
    logSafeFailure("brands", error);
    return [];
  }
}

export async function safeGetBrandsWithModels(): Promise<Brand[]> {
  try {
    return await getBrandsWithModelsCached();
  } catch (error) {
    logSafeFailure("brands with models", error);
    return [];
  }
}

export async function safeGetModels(brandSlug?: string): Promise<VehicleModel[]> {
  try {
    return await getModelsCached(brandSlug);
  } catch (error) {
    logSafeFailure("models", error);
    return [];
  }
}

export async function safeGetWheels(): Promise<Wheel[]> {
  try {
    return await getWheelsCached();
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
