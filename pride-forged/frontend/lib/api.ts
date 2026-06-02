import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api",
  timeout: 8000
});

export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  models?: VehicleModel[];
};

export type VehicleModel = {
  id: number;
  brand_id: number;
  name: string;
  slug: string;
  year_from?: number | null;
  year_to?: number | null;
};

export type Wheel = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  diameter: number;
  width: string;
  et: number;
  pcd: string;
  dia: string;
  weight: string;
  images: { id: number; image_url: string }[];
};

const fallbackBrands: Brand[] = [
  { id: 1, name: "BMW", slug: "bmw" },
  { id: 2, name: "Mercedes-Benz", slug: "mercedes" },
  { id: 3, name: "Audi", slug: "audi" },
  { id: 4, name: "Porsche", slug: "porsche" },
  { id: 5, name: "Tesla", slug: "tesla" }
];

const modelMap: Record<string, string[]> = {
  bmw: ["M3", "M4", "M5", "X5M", "X6M"],
  mercedes: ["C63 AMG", "E63 AMG", "G63 AMG"],
  audi: ["RS6", "RS7", "RSQ8"],
  porsche: ["911", "Panamera", "Cayenne Coupe"],
  tesla: ["Model 3", "Model S", "Model X"]
};

export const fallbackModels = Object.entries(modelMap).flatMap(([brandSlug, names], brandIndex) =>
  names.map((name, index) => ({
    id: brandIndex * 10 + index + 1,
    brand_id: brandIndex + 1,
    name,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    year_from: 2019,
    year_to: null,
    brandSlug
  }))
);

export const fallbackWheels: Wheel[] = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const slug = `pride-p${String(number).padStart(2, "0")}`;
  return {
    id: number,
    name: `PRIDE P${String(number).padStart(2, "0")}`,
    slug,
    description: "Премиальная кованая модель с низкой массой, выразительной геометрией и индивидуальными параметрами под автомобиль.",
    price: String(145000 + number * 7000),
    diameter: 19 + (number % 4),
    width: String(8.5 + (number % 4) * 0.5),
    et: 25 + number,
    pcd: number % 2 ? "5x112" : "5x120",
    dia: number % 2 ? "66.6" : "72.6",
    weight: String((8.8 + number / 10).toFixed(2)),
    images: []
  };
});

export async function getBrands(): Promise<Brand[]> {
  try {
    const { data } = await api.get<Brand[]>("/brands");
    return data;
  } catch {
    return fallbackBrands;
  }
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  try {
    const { data } = await api.get<Brand>(`/brands/${slug}`);
    return data;
  } catch {
    const brand = fallbackBrands.find((item) => item.slug === slug);
    return brand
      ? { ...brand, models: fallbackModels.filter((model) => model.brandSlug === slug) }
      : undefined;
  }
}

export async function getWheels(): Promise<Wheel[]> {
  try {
    const { data } = await api.get<Wheel[]>("/wheels");
    return data;
  } catch {
    return fallbackWheels;
  }
}

export async function getWheel(slug: string): Promise<Wheel | undefined> {
  try {
    const { data } = await api.get<Wheel>(`/wheels/${slug}`);
    return data;
  } catch {
    return fallbackWheels.find((wheel) => wheel.slug === slug);
  }
}
