import type { ApiEnvelope } from "@/types/models";

import api from "@/lib/api";

type RandomUsersPage = {
  data: Array<{
    id: number;
    email: string;
    picture: {
      large: string;
    };
    name: {
      first: string;
      last: string;
    };
    location: {
      country: string;
    };
  }>;
};

type RandomProductsPage = {
  data: Array<{
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    rating: number;
    images: string[];
  }>;
};

export async function fetchCatalogSeed() {
  const [usersResponse, productsResponse] = await Promise.all([
    api.get<ApiEnvelope<RandomUsersPage>>("/public/randomusers"),
    api.get<ApiEnvelope<RandomProductsPage>>("/public/randomproducts")
  ]);

  return {
    users: usersResponse.data.data.data,
    products: productsResponse.data.data.data
  };
}
