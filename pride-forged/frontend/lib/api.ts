import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.INTERNAL_API_URL
      : process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
});

export type WheelImage = {
  id: number;
  image_url: string;
};

export type Wheel = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  diameter: number;
  width: string | number;
  et: number;
  pcd: string;
  dia: string | number;
  weight: string | number;
  images: WheelImage[];
};

export type VehicleModel = {
  id: number;
  brand_id: number;
  name: string;
  slug: string;
  year_from?: number | null;
  year_to?: number | null;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  models?: VehicleModel[];
};

export type Fitment = {
  id: number;
  vehicle_model: VehicleModel;
  wheel: Wheel;
};

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function toApiError(error: unknown, resource: string): ApiRequestError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const detail = typeof error.response?.data?.detail === "string" ? error.response.data.detail : undefined;
    return new ApiRequestError(detail ?? `Не удалось загрузить ${resource}`, status);
  }

  return new ApiRequestError(`Не удалось загрузить ${resource}`);
}

async function request<T>(path: string, resource: string, params?: Record<string, string | undefined>): Promise<T> {
  try {
    const { data } = await api.get<T>(path, { params });
    return data;
  } catch (error) {
    throw toApiError(error, resource);
  }
}

export function getBrands(): Promise<Brand[]> {
  return request<Brand[]>("/brands", "марки автомобилей");
}

export function getBrand(slug: string): Promise<Brand> {
  return request<Brand>(`/brands/${slug}`, "марку автомобиля");
}

export async function getBrandsWithModels(): Promise<Brand[]> {
  const brands = await getBrands();
  return Promise.all(brands.map((brand) => getBrand(brand.slug)));
}

export function getModels(brandSlug?: string): Promise<VehicleModel[]> {
  return request<VehicleModel[]>("/models", "модели автомобилей", { brand_slug: brandSlug });
}

export function getWheels(): Promise<Wheel[]> {
  return request<Wheel[]>("/wheels", "каталог дисков");
}

export function getWheel(slug: string): Promise<Wheel> {
  return request<Wheel>(`/wheels/${slug}`, "диск");
}

export function getFitments(filters: { brandSlug?: string; modelSlug?: string; wheelSlug?: string } = {}): Promise<Fitment[]> {
  return request<Fitment[]>("/fitment", "подбор дисков", {
    brand_slug: filters.brandSlug,
    model_slug: filters.modelSlug,
    wheel_slug: filters.wheelSlug
  });
}
