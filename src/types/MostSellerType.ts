export interface MostSellerType {
  status: string;
  data:MostSellerData[];
}

export interface MostSellerData {
  name: string;
  short_explanation: string;
  price_info: {
    profit: number | null;
    total_price: number;
    discounted_price: number | null;
    price_per_servings: number;
    discount_percentage: number | null;
  };
  photo_src: string;
  comment_count: number;
  average_star: number;
}

export interface LoaderMostSeller {
    mostSeller:MostSellerType
}
