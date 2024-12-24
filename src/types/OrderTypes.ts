export interface AllOrderTypes {
  status: string;
  data: {
    order_no: string;
    order_status: string;
    created_at: string;
    total_price: number;
    cart_detail: {
      variant_id: string;
      name: string;
      photo_src: string;
      pieces: string;
      unit_price: string;
      total_price: string;
      slug: string;
    }[];
  }[];
}

export interface OrderDetailsType {
    status: string;
    data: {
      order_no: string;
      order_status: string;
      shipment_tracking_number: string;
      address: {
        title: string;
        country: string;
        region: string;
        subregion: string;
        full_address: string;
        phone_number: string;
      };
      payment_detail: {
        card_digits: string;
        card_expiration_date: string;
        card_security_code: string;
        payment_type: string;
        card_type: string;
        base_price: number;
        shipment_fee: number;
        payment_fee: number;
        discount_ratio: number;
        discount_amount: number;
        final_price: number;
      };
      shopping_cart: {
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
    };
  }
