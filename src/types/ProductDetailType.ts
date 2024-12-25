export interface ProductDetailType {
  status: string;
  data: {
    id: string;
    name: string;
    slug: string;
    short_explanation: string;
    explanation: {
      usage: string;
      features: string;
      description: string;
      nutritional_content: {
        ingredients: {
          aroma: string;
          value: string;
        }[];
        nutrition_facts: {
          ingredients: {
            name: string;
            amounts: string[];
          }[];
          portion_sizes: string[];
        };
        amino_acid_facts: {
          ingredients: {
            name: string;
            amounts: string[];
          }[];
          portion_sizes: string[];
        };
      };
    };
    main_category_id: string;
    sub_category_id: string;
    tags: string[];
    variants: VariantsType[];
    comment_count: number;
    average_star: number | string;
  };
}

export interface VariantsType {
  id: string;
  name?: string;
  count?: number;
  size: {
    gram: number;
    pieces: number;
    total_services: number;
  };
  aroma: string;
  price: {
    profit: null | number;
    total_price: number;
    discounted_price: null | number;
    price_per_servings: number;
    discount_percentage: null | number;
  };
  photo_src: string;
  is_available: boolean;
}

export interface SizeType {
  gram: number;
  pieces: number;
  total_services: number;
}

export interface BasketProductsPayload {
  product_id: string;
  product_variant_id: string;
  pieces: number;
}

export interface BasketProductType {
  status: string;
  data: {
    total_price: number;
    items: {
      product_id: string;
      product_slug: string;
      product_variant_id: string;
      product: string;
      product_variant_detail: {
        size: {
          gram: number;
          pieces: number;
          total_services: number;
        };
        aroma: string;
        photo_src: string;
      };
      pieces: number;
      unit_price: number;
      total_price: number;
    }[];
  };
}
