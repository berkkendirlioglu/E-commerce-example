export interface AllProductType {
    status: string;
    data: {
      count: number;
      next: string;
      previous: string | null;
      results: ProductInfo[];
    };
}

export interface ProductInfo {
    name: string;
    short_explanation: string;
    slug: string;
    price_info: {
      profit: null;
      total_price: number | string;
      discounted_price: null;
      price_per_servings: number | string;
      discount_percentage: null;
    };
    photo_src: string;
    comment_count: number;
    average_star: number;
    id: string;
  }[];

export interface LoaderData {
    products: ProductInfo[];
    totalCount: number;
}