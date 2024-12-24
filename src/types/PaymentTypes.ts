  
export interface PaymentMethodPayload {
    card_digits: string;
    card_expiration_date: string;
    card_security_code: string;
  }

  export interface OrderToProductsPayload{
    address_id:string | undefined,
    payment_type:string | undefined,
    card_digits:string,
    card_expiration_date: string,
    card_security_code:string,
    card_type:string | undefined,
  }