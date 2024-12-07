import { VariantsType } from "./ProductDetailType";

export interface AddressType {
    address: string;
    city: string;
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    title: string;
  }
  
export interface CreditCardsType {
    cardMonth: string | undefined;
    cardNumber: string | undefined;
    cvvCode: string | undefined;
    fullName: string | undefined;
    cardYear: string | undefined;
  }
  
export interface submitFormType {
    address: string;
    shipping?: string;
    fullName?: string;
    cardNumber?: string;
    cardMonth?: string;
    cardYear?: string;
    cvvCode?: string;
  }
  
export interface DeliveryType {
    products?: VariantsType[];
    address?: AddressType;
    shipping?: string;
    payment?: CreditCardsType;
    deliveryNumber?: string;
    deliveryDate?: string;
  }